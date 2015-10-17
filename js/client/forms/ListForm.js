/*
 * Copyright (C) 2015 Christian Friedl <Mag.Christian.Friedl@gmail.com>
 *
 * This file is part of BJO2.
 *
 * Mapitor is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 3 as
 * published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, see <http://www.gnu.org/licenses/>.
 */

(function(window) {
    "use strict";

    function startTag(name, attrs) {
        return '<' + name + _(attrs).reduce(function(memo, attr) { return memo + ' ' + attr.name + '="' + attr.value + '"'; }, '') + '>';
    }
    function endTag(name) {
        return '</' + name + '>';
    }
    function singleTag(name, attrs) {
        return '<' + name + _(attrs).reduce(function(memo, attr) { return memo + ' ' + attr.name + '="' + attr.value + '"'; }, '') + ' />';
    }
    function attr(name, value) {
        return { name: name, value: value };
    }

    function tag(name, attrs, subTags, text) {
        if ( subTags.length > 0 || (typeof(text) !== 'undefined' && text.length > 0) ) {
            return '<' + name
                +_(_(attrs).keys()).reduce(function(memo, name) { return memo + ' ' + name + '="' + attrs[name] + '"'; }, '')
                + '>'
                + _(subTags).reduce(function(memo, text) { return memo + text; }, '')
                + text
                + '</' + name + '>';
        } else {
            return '<' + name
                +_(_(attrs).keys()).reduce(function(memo, name) { return memo + ' ' + name + '="' + attrs[name] + '"'; }, '')
                + ' />';
        }
                
    }

    var ListForm = {};

    ListForm.createFieldId = function(id, field) {
        return 'field-' + id + '-' + field.name;
    };
    ListForm.createEditableFieldHtml = function(id, field, module, controller) {
        var fieldId = ListForm.createFieldId(id, field);
        if ( field.className === 'sql.LookupField' ) {
            return '<input id="' + ListForm.createFieldId(id, field) + '" name="' + field.name + '" type="hidden" value="' + (field.value ? field.value : '') + '" />'
                + field.value + '&nbsp;<button id="lookup-opener-' + id + '-' + field.name + '">^</button>'
                + `<script>jQuery(document).ready(function() {
                     jQuery('#lookup-opener-` + id + `-` + field.name + `').click(function(ev) {
                         ev.preventDefault();
                         openLookupPopup('` + fieldId + `', '` + JSON.stringify(field.options) + `', '` + module + `', '` + controller + `');
                     });
                });</script>`;
        } else {
            return '<input class="edit-field" id="' +  fieldId + '" name="' + field.name + '" type="text" value="' + (field.value ? field.value : '') + '" />'; 
        }
    };
    
    ListForm.createFieldHtml = function(id, field, module, controller) {
        if ( field.isEditable ) {
            return '<td>' + ListForm.createEditableFieldHtml(id, field, module, controller) + '</td>';
        } else {
            return '<td><input type="hidden" id="field-' + id + '-' + field.name + '" name="' + field.name + '" value="' + (field.value ? field.value : '') + '" />' + (field.value ? field.value : '') + '</td>'; 
        }
    };

    ListForm.createFieldFilterHtml = function(cssId, field, module, controller) {
        var filterFieldUrl = '/' + [module, controller, 'list'].join('/');
        return startTag('select', [ attr('id', 'filter-op-' + field.name) ])
                + startTag('option', [ attr('value', '') ]) + '' + endTag('option')
                + startTag('option', [ attr('value', 'eq') ]) + '=' + endTag('option')
                + startTag('option', [ attr('value', 'lt') ]) + '<' + endTag('option')
                + startTag('option', [ attr('value', 'gt') ]) + '>' + endTag('option')
            + endTag('select')
            + singleTag('input', [ attr('type', 'text'), attr('id', 'filter-text-' + field.name), attr('size', 10), attr('maxlength', 255) ])
        + tag('script', { type: 'text/javascript' }, [],
                `jQuery(document).ready(function() {
                    jQuery('select#filter-op-` + field.name + `,input#filter-text-` + field.name + `').change(function(ev) {
                        console.log('inchange', jQuery(this).attr('id'));
                        if ( m = (jQuery(this).attr('id').match(/^filter-(\\w+)-(\\w+)$/)) ) {
                            var data = { conditions: [] };
                            
                            jQuery('select', jQuery(this).parent()).each(function() {
                                var m = jQuery(this).attr('id').match(/^filter-(\\w+)-(\\w+)$/);
                                var opId = 'filter-op-' + m[2];
                                var valueId = 'filter-text-' + m[2];
                                var name = m[2];
                                console.log('opId', opId, jQuery('#'+opId).val());
                                if ( jQuery('#' + valueId).val().length > 0 ) {
                                    var obj = { fieldName: name, opName: jQuery('#' + opId).val(), value: jQuery('#' + valueId).val() };
                                    data.conditions.push(obj);
                                }
                            });

                            jQuery.ajax({
                                type: 'POST', 
                                url: '` + filterFieldUrl + `',
                                data: JSON.stringify(data),
                                dataType: 'json',
                                contentType: 'application/json',
                                success: function(data) {
                                    console.log('filter successs, got data', data);
                                    ListForm.refreshData('` + cssId + `', data);
                                    ListForm.afterCreateHtml('` + cssId + `', data);
                                }
                            });
                        }
                    });
                });`
        );
    };

    ListForm.refreshData = function(cssId, data) {
        jQuery('#' + cssId + ' tbody').html(
            _(data.rows).reduce(function(memo, row) { 
                return memo + ListForm.createRowHtml(row, data.module, data.controller);
        }.bind(ListForm), ''));
    };

    ListForm.createInsertRowHtml = function(row, module, controller) {
        return '<tr class="edit insert" id="insert-row">' 
            + _(row.fields).reduce(function(memo, field) { 
                var field2 = { name: field.name, isEditable: field.isEditable, value: '' };
                return memo + ListForm.createFieldHtml('insert', field2, module, controller); 
            }, '')
        + '</tr>';
    };
    ListForm.createRowHtml = function(row, module, controller) {
        return '<tr class="edit" id="edit-row-' + row.id + '">' 
            + _(row.fields).reduce(function(memo, field) {
                return memo + ListForm.createFieldHtml(row.id, field, module, controller) 
            }.bind(ListForm) , '')
        + '</tr>'; 
    }

    ListForm.createHtml = function(cssId, data) {
        console.log('listform data', data);
        switch (data.action) {
            case 'prepare':
                return ListForm.createPrepareHtml(cssId, data);
                break;
            case 'list':
                return ListForm.createListHtml(cssId, data);
                break;
        }
    };
    ListForm.createPrepareHtml = function(cssId, data) {
        var listUrl = '/' + [data.module, data.controller, 'list'].join('/');
        var countUrl = '/' + [data.module, data.controller, 'count'].join('/');
        var html = `
            <form id="` + cssId + `">
                <div class="list-pane">
                    <table class="list-form">
                        <thead>
                            <tr class="filters head">`
                                + _(data.templateRow.fields).reduce(function(memo, field) { 
                                    return memo 
                                    + '<th>' + (field.className !== 'sql.CalcField' ? ListForm.createFieldFilterHtml(cssId, field, data.module, data.controller) : '&nbsp;') + '</th>'; 
                                }, '')
                            + `</tr>
                            <tr class="head">`
                                + _(data.templateRow.fields).reduce(function(memo, field) { 
                                    return memo 
                                    + '<th>' + field.label + '</th>'; 
                                }, '')
                            + `</tr>`
                        + `</thead>
                        <tbody>`
                        + `</tbody>
                    </table>
                </div>
            </form>
            <script type="text/javascript">
                jQuery(document).ready(function() {
                    jQuery.ajax('`+ countUrl + `', {
                            success: function(data2) {
                                var datax = JSON.parse(data2);
                                jQuery('#` + cssId + ` tbody').html(ListForm.createDummyListHtml('` + cssId + `', datax));
                            }
                        }
                    );
                    jQuery('.list-pane').scroll(function(ev) {
                        var self = this;
                        var oldScrollTop = jQuery(this).scrollTop();
                        setTimeout(function() {
                            if ( jQuery(self).scrollTop() == oldScrollTop ) {
                                var count = jQuery('.list-pane tr').length;
                                var trHeight = jQuery('.list-pane tr:first-child').height();
                                var tableHeight = jQuery('table.list-form').height();
                                var startPos = Math.max(0, Math.round(oldScrollTop / tableHeight * count) - 5);
                                var limit = Math.round(jQuery('#bjo-main-form').height() / trHeight) + 10;
                                console.log('count', count, 'scrollTop', oldScrollTop, 'tableheight', tableHeight, 'trheight', trHeight, 'startpos', startPos, 'limit', limit);
                                var start = new Date().getTime();
                                jQuery.ajax({ url: '/invoice/invoice/list', 
                                    type: 'POST', 
                                    data: JSON.stringify({ conditions: { offset: startPos, limit: limit } }),
                                    dataType: 'json',
                                    contentType: 'application/json',
                                    success: function(datax) {
                                        console.log('success data', datax);
                                        var end = new Date().getTime();
                                        // var datax = JSON.parse(data);
                                        console.log('fetched data in', end-start, 'row count is', datax.rows.length);
                                        _(datax.rows).each(function(row) {
                                            if ( jQuery('#edit-row-' + row.id).hasClass('dummy') ) {
                                                jQuery('#edit-row-' + row.id).replaceWith(ListForm.createRowHtml(row, 'invoice', 'invoice'));
                                            }
                                        });
                                        var end2 = new Date().getTime();
                                        console.log('displayed data in', end2-end);

                                    }
                                });
                            } else {
                                oldScrollTop = jQuery(self).scrollTop();
                            }
                        } , 100);
                    });
                });
            </script>
        `;
        return html;
    };

    ListForm.createDummyListHtml = function(cssId, data) {
        var html = '';
        data.rows = [];
        _(data.count).times(function(n) {
            html += '<tr id="edit-row-' + n + '" class="dummy"><td><input type="text"/></td></tr>';
        });
        return html;
    };

    ListForm.createListHtml = function(cssId, data) {
        var html = `
            <form id="` + cssId + `">
                <div class="list-pane">
                    <table class="list-form">
                        <thead>
                            <tr class="filters head">`
                                + _(data.templateRow.fields).reduce(function(memo, field) { 
                                    return memo 
                                    + '<th>' + (field.className !== 'sql.CalcField' ? ListForm.createFieldFilterHtml(cssId, field, data.module, data.controller) : '&nbsp;') + '</th>'; 
                                }, '')
                            + `</tr>
                            <tr class="head">`
                                + _(data.templateRow.fields).reduce(function(memo, field) { 
                                    return memo 
                                    + '<th>' + field.label + '</th>'; 
                                }, '')
                            + `</tr>`
                        + `</thead>
                        <tbody>`
                        + _(data.rows).reduce(function(memo, row) { 
                            return memo + ListForm.createRowHtml(row, data.module, data.controller);
                        }.bind(ListForm), '')
                        + `</tbody>
                        <tfoot>`
                        + this.createInsertRowHtml(data.templateRow, data.module, data.controller)
                        + `<tr class="foot">`
                            + _(data.aggregateRow).reduce(function(memo, field) {
                                console.log('_agg',field);
                                if ( field.className==='sql.CalcField' ) {
                                    return memo + '<td>' + field.value + '</td>';
                                } else {
                                    return memo + '<td>&nbsp;</td>';
                                }
                            }, '')
                        + `</tr>
                        <tr>
                            <th>&nbsp;</th>
                            <td>count: <span id="count">` + data.count + `</td>
                        </tr>
                    </tfoot>
                </table>
                </div>` // list-pane
            + `</form>

        <div id="lookupPopup" class="popup"></div>
    <script>
        function openLookupPopup(hiddenFieldId, optionsJson, module, controller) {
            var options = JSON.parse(optionsJson);
            var html = '<select id="lookup-select-' + hiddenFieldId + '">'
                + '<option>select...</option>'
                + _(_(options).keys()).reduce(function(memo, key) {
                    return memo + '<option value="' + key + '">' + options[key] + '</option>';
                })
                + '</select>';
            jQuery('#lookupPopup').html(html).dialog();
            jQuery('#lookup-select-' + hiddenFieldId).change(function(ev) {
                console.log(jQuery(this), jQuery(this).val());
                jQuery('#' + hiddenFieldId).val(jQuery(this).val());
                jQuery('#lookupPopup').dialog('close');
                ListForm.handleFieldChange('` + cssId + `', hiddenFieldId, module, controller);
            });
        }
    </script>
        `;
        return html;
    };

    ListForm.save = function(formId) {
        $.ajax(data.url, {
            type: 'POST',
            data: $('#' + formId).serialize(),
            success: function(data) {
                console.log(data);
            }

        });

    };

    ListForm.afterCreateHtml = function(cssId, data) {
        _(data.rows).each(function(row) {
            ListForm.addJQueryFieldHandlers(cssId, 'edit-row-' + row.id, row, data.module, data.controller);
        });
        ListForm.addJQueryFieldHandlers(cssId, 'insert-row', data.templateRow, data.module, data.controller);

    }

    ListForm.addJQueryFieldHandlers = function(cssId, rowCssId, row, module, controller) {
        $('#' + cssId + ' #' + rowCssId + ' input.edit-field').change(function(ev) {
            ev.preventDefault();
            ListForm.handleFieldChange(cssId, jQuery(this).attr('id'), module, controller);
        })
        .click(function(ev) {
            if ( getSelection().type === 'Caret' ) {
                this.setSelectionRange(0, $(this).val().length);
            }
        });
    };

    ListForm.handleFieldChange = function(cssId, id, module, controller) {
        console.log('change');
        var m = undefined;
        if ( m = (id).match(/^field-(\w+)-(\w+)$/) ) {
            var id = m[1];
            var fieldName = m[2];
            var ajaxData = { row: serializeRow(cssId, id), fieldName: fieldName, id: id };

            var saveFieldUrl = '/' + [module, controller, 'saveField'].join('/');
            console.log(saveFieldUrl);
            var countUrl = '/' + [module, controller, 'count'].join('/');

            $.ajax({
                type: 'POST', 
                url: saveFieldUrl,
                data: JSON.stringify(ajaxData),
                dataType: 'json',
                contentType: 'application/json',
                success: function(data) {
                    if ( data.flags.hasInserted ) {
                        var oldRowHtml = ListForm.createRowHtml(data.row);
                        var newInsertRowHtml = ListForm.createInsertRowHtml(data.row, data.module, data.controller);

                        $('#' + cssId + ' table.list-form tfoot tr#insert-row').remove();
                        $('#' + cssId + ' table.list-form tfoot').prepend(newInsertRowHtml);
                        $('#' + cssId + ' table.list-form tbody').append(oldRowHtml);
                        console.log(data);
                        ListForm.updateCount(cssId, data.count);
                        ListForm.addJQueryFieldHandlers(cssId, 'edit-row-' + data.row.id, data.row, data.module, data.controller);
                        ListForm.addJQueryFieldHandlers(cssId, 'insert-row', data.row, data.module, data.controller);
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {alert("ERROR:" + xhr.responseText+" - "+thrownError);} 
            });
        }
    }

    ListForm.updateCount = function(cssId, count) {
        $('#' + cssId + ' #count').html(count);
    }

            function idFieldValue(row) { 
                var field = _(row.fields).find(function(f) { return f.name === 'id'; });
                if ( field ) { 
                    return field.value;
                } else {
                    return null;
                }
            }
            function serializeRow(formId, rowId) {
                var rv = {};
                $('#' + formId + ' [id^=field-' + rowId + ']').each(function(i, f) { rv[$(f).attr('name')] = $(f).val(); });
                return rv;
            }
    window.ListForm = ListForm;
})(window);
