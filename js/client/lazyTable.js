(function(window) {
    var document = window.document;
    function LazyTable(cssId, functionObject) {
        this._cssId = cssId;
        this._countFunc = functionObject.count;
        this._fetchRowsFunc = functionObject.fetchRows; // async
        this._fetchTemplateRowFunc = functionObject.fetchTemplateRow; // async
        this._saveFieldFunc = functionObject.saveField;
        this._fetchedRows = [];
        this._headerCellRenderFunc = CellRenderer.renderHeaderCell;
        this._bodyCellRenderFunc = CellRenderer.renderBodyCell;
        this._shouldCheckScroll = true;

        this._rowWidth = 1000;
        this._scrollTimeoutMsec = 100;

        // largest possible div height:
        //      firefox - 17895697px
        //      chrome -- larger than ff!
        //      ie - 10737418px

        this._maxTableHeight = 10737418;
        this._lastScrollTop = null;
        this._lastScrollLeft = null;
        this._screenSizeGraceRows = 10;
    }

    LazyTable.prototype.constructor = LazyTable;

    LazyTable.prototype._fetchData = function(startIdx, count, callback) {
        //console.log('fetchdata', startIdx, count);
        this._fetchRowsFunc(startIdx, count, function(error, rows) { callback(startIdx, rows); });
    };

    /**
     * initial rendering
     */
    LazyTable.prototype.render = function() {
        var self = this;
        this._countRows(function(err, count) {
            this._count = count;
            this._fetchTemplateRow(function(error, row) {
                this._templateRow = row;
                this._viewportEl = jQuery('#' + this._cssId);
                this._viewportEl.addClass('viewport');
                jQuery(this._viewportEl).css({ height: '100%', position: 'relative', width: '100%', overflow: 'scroll' });
                jQuery(this._viewportEl).attr('id', 'myid');
                var scrollFunc = function() { this._scrollTo(jQuery(this._viewportEl).scrollTop(), jQuery(this._viewportEl).scrollLeft()); }.bind(this);
                jQuery(this._viewportEl).scroll(scrollFunc);
                jQuery(this._viewportEl).resize(scrollFunc);
                this._tableEl = jQuery('<div/>').attr('id', 'table').css({ position: 'relative',  }).addClass('lazy-table');
                jQuery(this._viewportEl).append(this._tableEl);
                var inputDimensions = this._getDefaultInputDimensions(); // depends on tableEl!
                this._rowHeight = inputDimensions.height + 2;
                this._cellWidth = inputDimensions.width + 4;
                var count = this._count;
                this._heightIsOverflowed = (count * this._rowHeight > this._maxTableHeight);
                this._heightIsOverflowed = false;
                console.log('_heightIsOverflowed', this._heightIsOverflowed);
                this._rowWidth = this._templateRow.fields.length * (this._cellWidth + 2);
                LazyTable.allWidths(this._tableEl, this._rowWidth);
                if ( this._heightIsOverflowed ) {
                    LazyTable.allHeights(this._tableEl, this._maxTableHeight);
                } else {
                    LazyTable.allHeights(this._tableEl, (this._rowHeight * (this._count + 1)));
                }

                var headerRowCss = { 
                        height: (this._rowHeight + 4) + 'px',
                };
                this._headerRowEl = jQuery('<div>').attr('id', 'header-row').css(headerRowCss);
                LazyTable.allWidths(this._headerRowEl, this._rowWidth);
                jQuery(this._headerRowEl).addClass('header row');
                this._tableEl.append(this._headerRowEl);
                for (var i=0; i < this._templateRow.fields.length; ++i ) {
                    var css = { 
                            width: this._cellWidth + 'px',
                            height: this._rowHeight + 'px',
                    };
                    var el = jQuery('<div/>').css(css).attr('id', 'header-cell-' + i);
                    jQuery(el).css(css);
                    jQuery(el).addClass('header cell');
                    if ( i === this._templateRow.fields.length - 1 ) {
                        jQuery(el).addClass('last');
                    }
                    jQuery(this._headerRowEl).append(el);
                    this._headerCellRenderFunc(el, i, this._templateRow.fields[i]);
                }

                jQuery(this._headerRowEl).css({
                    top: (jQuery(this._tableEl).offset().top),
                    left: (jQuery(this._tableEl).offset().left)
                });
                this._fetchData(0, this._viewportRows() + this._screenSizeGraceRows, function(startIdx, rows) {
                    this._mergeFetchedRows(startIdx, rows);
                    this._renderFetchedRows();
                    jQuery('input', this._tableEl)[0].focus();
                }.bind(this)); // TODO interface to outside for templaterow -- we need it now for code below
            }.bind(this));

            jQuery(this._tableEl).change(function(ev) {
                var value;
                console.log('change', ev);
                var input = ev.target;
                var id = jQuery(input).attr('id');
                var parts = id.split('-');
                var rowIdx = parts[2];
                var fieldIdx = parts[3];

                var field = self._fetchedRows[rowIdx].fields[fieldIdx];


                if ( jQuery(input).attr('type') === 'checkbox' ) {
                    value = jQuery(input).prop('checked');
                } else {
                    value = jQuery(input).val();
                }
                self._saveFieldFunc({ id: self._fetchedRows[rowIdx].id, field: { name: field.name, value: value }}, function(resp) { console.log(resp); });
            }).keydown(function(ev) {
                console.log(ev.target, ev);
                if ( ev.keyCode === 40 ) { // down
                    var input = ev.target;
                    var id = jQuery(input).attr('id');// todo abstract into func
                    var parts = id.split('-');
                    var name = parts[1];
                    var rowIdx = window.parseInt(parts[2]);
                    var fieldIdx = window.parseInt(parts[3]);
                    if ( jQuery('#edit-' + name + '-' + (rowIdx + 1) + '-' + fieldIdx).length ) {
                        jQuery('#edit-' + name + '-' + (rowIdx + 1) + '-' + fieldIdx).putCursorAtEnd();
                    }
                } else if ( ev.keyCode === 38 ) { // up
                    var input = ev.target;
                    var id = jQuery(input).attr('id');// todo abstract into func
                    var parts = id.split('-');
                    var name = parts[1];
                    var rowIdx = window.parseInt(parts[2]);
                    var fieldIdx = window.parseInt(parts[3]);
                    if ( jQuery('#edit-' + name + '-' + (rowIdx - 1) + '-' + fieldIdx).length ) {
                        jQuery('#edit-' + name + '-' + (rowIdx - 1) + '-' + fieldIdx).putCursorAtEnd();
                    }
                }
            });
        }.bind(this));
    };

    LazyTable.prototype._fetchTemplateRow = function(callback) {
        return this._fetchTemplateRowFunc(callback);
    }
    LazyTable.prototype._countRows = function(callback) {
        return this._countFunc(callback);
    }

    LazyTable.prototype._viewportRows = function() {
        var height = jQuery(this._viewportEl).height();
        return Math.floor(height / this._rowHeight);
    };

    LazyTable.prototype._scrollTo = function(scrollTop, scrollLeft) {
        this._lastScrollTop = scrollTop;
        this._lastScrollLeft = scrollLeft;
        if ( this._shouldCheckScroll ) {
            this._shouldCheckScroll = false;
            window.setTimeout(function() {
                this._innerScrollTo(jQuery(this._viewportEl).scrollTop(), scrollLeft);
                this._shouldCheckScroll = true;
            }.bind(this), this._scrollTimeoutMsec);
        }

    };

    LazyTable.prototype._innerScrollTo = function(scrollTop, scrollLeft) {
        if ( this._lastScrollTop === scrollTop ) {
            // console.log('scroll to ', scrollTop, 'of', jQuery(this._tableEl).height());

            var startIdx = Math.round(scrollTop / this._rowHeight);
            if (this._heightIsOverflowed ) {
                console.log('startIdx old', startIdx);
                startIdx = Math.round(scrollTop / jQuery(this._tableEl).height() * this._count);
                console.log('startIdx new', startIdx);
                if ( startIdx >= this._count * 0.9 ) {
                    startIdx = this._count - this._viewportRows();
                    console.log('startIdx very new', startIdx);
                }
            }
            var fetchStartIdx = Math.max(startIdx - this._screenSizeGraceRows, 0)
            var fetchCount = Math.min(this._viewportRows() + 2 * this._screenSizeGraceRows, this._count - fetchStartIdx) + 1;
            this._fetchData(fetchStartIdx, fetchCount, function(startIdx, rows) {
                this._mergeFetchedRows(startIdx, rows);
                (function(callback) {
                    if ( this._heightIsOverflowed ) {
                        this._fetchData(this._count - fetchCount, fetchCount, callback);
                    } else {
                        callback();
                    }
                }(function() {
                    this._renderFetchedRows(scrollLeft === this._lastScrollLeft);
                    this._emptyCache(startIdx);
                }.bind(this)));
            }.bind(this));
        } else {
            this._lastDifferentScrollTop = this._lastScrollTop;
        }
        if ( this._lastScrollLeft !== scrollLeft ) {
            this._lastDifferentScrollLeft = this._lastScrollLeft;
        }
        // TODO I have no clue why the following formula seems to work...!
        var headerLeft = ( jQuery(this._tableEl).offset().left - scrollLeft / (2 * this._templateRow.fields.length * this._templateRow.fields.length) );
        jQuery(this._headerRowEl).css({ left: headerLeft + 'px' });
    };

    LazyTable.prototype._emptyCache = function(startIdx) {
        var i;
        var count = this._count;
        var startBlockEnd = 2 * this._viewportRows();
        var endBlockStart = Math.max(0, this._count - 2 * this._viewportRows());
        var keepStart = Math.max(0, Math.min(startIdx - 2 * this._screenSizeGraceRows));
        var keepEnd = Math.min(this._count, startIdx + this._viewportRows() + 2 * this._screenSizeGraceRows);
        for (i = 0; i < keepStart; ++i) {
            delete this._fetchedRows[i];
            jQuery('#row-' + i).remove();
        }
        for (i = keepEnd; i < count; ++i) {
            delete this._fetchedRows[i];
            jQuery('#row-' + i).remove();
        }
    };


    LazyTable.prototype._renderFetchedRows = function(doFocusAfterwards) {
        if ( typeof(doFocusAfterwards) === 'undefined') {
            doFocusAfterwards = false;
        }
        var rows = this._fetchedRows;
        var rowsLength = rows.length;
        var rowIdx, fieldIdx;
        Timer.start('_renderFetchedRows');
        var activeElId = jQuery(window.document.activeElement).attr('id');
        for ( rowIdx = 0; rowIdx  < rowsLength; ++rowIdx ) {
            if ( typeof(rows[rowIdx]) !== 'undefined' ) {
                //console.log('render', rowIdx);
                var row = rows[rowIdx];
                var fields = row.fields;
                var fieldsLength =fields.length;
                var topPx = (5 + (rowIdx + 1) * this._rowHeight) + 'px';
                if ( this._heightIsOverflowed && rowIdx >= this._count * 0.9) {
                    topPx = (5 + jQuery(this._tableEl).height() - ((this._count - rowIdx + 1) * this._rowHeight)) + 'px';
                }
                var rowCss = { 
                        top: topPx,
                        left: 0,
                        position: 'absolute',
                        overflow: 'hidden'
                };

                var rowDiv = jQuery('<div/>').attr('id', 'row-' + rowIdx);
                rowDiv.css(rowCss);
                LazyTable.allWidths(rowDiv, this._rowWidth);
                LazyTable.allHeights(rowDiv, this._rowHeight);
                if ( jQuery('#row-' + rowIdx).length ) {
                    jQuery('#row-' + rowIdx).replaceWith(rowDiv);
                } else {
                    jQuery(this._tableEl).append(rowDiv);
                }
                var tableWidth = jQuery(this._viewportEl).width();
                var fieldIdx = 0;
                var lastEl = null;
                var vEl = jQuery(this._viewportEl);
                var vElWidth = vEl.width();
                while ( fieldIdx === 0 || (fieldIdx > 0 && fieldIdx < fieldsLength && lastEl.offsetLeft <= vEl.scrollLeft() + vElWidth) ) {
                    lastEl = this._renderCell(rowDiv[0], rowIdx, fieldIdx, fields[fieldIdx]);
                    ++fieldIdx;
                }
            }
        }
        if ( doFocusAfterwards && jQuery('#' + activeElId).length > 0 && this._isElementVisible(jQuery('#' + activeElId)) ) {
            jQuery('#' + activeElId).focus();
        }
        Timer.end('_renderFetchedRows');
        Timer.log('_renderFetchedRows');
    };

    LazyTable.prototype._renderCell = function(rowDiv, rowIdx, fieldIdx, field) {
        // console.log('_renderCell', rowIdx, fieldIdx);
        var css = { 
        };
        var div = document.createElement('div');
        div.setAttribute('id', 'cell-' + rowIdx + '-' + fieldIdx);
        var divClass = 'body cell';
        if ( fieldIdx === this._templateRow.fields.length - 1 ) {
            divClass += ' last';
        }
        if ( rowIdx % 2 === 0 ) {
            divClass += ' even';
        } else {
            divClass += ' odd';
        }
        if ( field.isEditable ) {
            divClass += ' editable';
        }
        div.setAttribute('class', divClass);
        div.style.width = this._cellWidth + 'px';
        div.style.height = this._rowHeight + 'px';
        rowDiv.appendChild(div);
        this._bodyCellRenderFunc(div, rowIdx, fieldIdx, field);
        return div;
    };

    LazyTable.prototype._mergeFetchedRows = function(startIdx, rows) {
        for ( var i = 0; i < rows.length; ++i ) { // TODO optimize
            //console.log('merge', startIdx + i);
            this._fetchedRows[startIdx + i] = rows[i];
        }
    };

    LazyTable.prototype._getDefaultInputDimensions = function() {
        var input = jQuery('<input type="text"/>');
        jQuery(this._tableEl).append(input);
        var rv= { width: jQuery(input).width(), height: jQuery(input).height() };
        jQuery(input).remove();
        return rv;
    };

    LazyTable.prototype._isElementVisible = function(elm, evalType) {
        evalType = evalType || "visible";

        var vpH = jQuery(window).height(), // Viewport Height
            st = jQuery(window).scrollTop(), // Scroll Top
            y = jQuery(elm).offset().top,
            elementHeight = jQuery(elm).height();

        if (evalType === "visible") return ((y < (vpH + st)) && (y > (st - elementHeight)));
        if (evalType === "above") return ((y < (vpH + st)));
    }

    /////////////////////////

    /*
     * static functions, default renderers...
     */

    LazyTable.allWidths = function(el, width) {
        jQuery(el).css({ 'min-width': width + 'px', 'width': width + 'px', 'max-width': width  + 'px'});
    };

    LazyTable.allHeights = function(el, height) {
        jQuery(el).css({ 'min-height': height + 'px', 'height': height + 'px', 'max-height': height  + 'px'});
    };

    ///////////////////////////////////

    function CellRenderer() {}

    CellRenderer.Editable = function() {}

    CellRenderer.NonEditable = function() {}

    CellRenderer.renderHeaderCell = function(el, fieldIdx, field) {
        jQuery(el).html(field.label);
    };

    CellRenderer.renderBodyCell = function(el, rowIdx, fieldIdx, field) {
        var matrixLine = _(CellRenderer.BodyCellRenderingMatrix).find(function(desc) {
            var rv = ( desc.isEditable === field.isEditable || desc.isEditable === null )
                && ( desc.className === null || desc.className.toString() === field.className.toString() )
                && ( desc.dataType === field.dataType || desc.dataType === null);
                // console.log('matrix find', field.name, desc, rv);
            return rv;
        });

        if ( typeof(matrixLine) === 'undefined' ) {
            console.error('matrixLine not found', field);
            throw new Error('matrixLine not found for field ' + field.name);
        }
        if ( matrixLine.func === undefined ) {
            console.error('matrixLine func is undef:', field, matrixLine);
            throw new Error('matrixLine func is undef' + field.name);
        }
        var input = matrixLine.func.bind(this)(el, rowIdx, fieldIdx, field);
    };

    CellRenderer.Editable.renderStringField = function(el, rowIdx, fieldIdx, field) {
        var input = jQuery('<input type="text" id="' + CellRenderer._getFieldId(rowIdx, fieldIdx, field) + '" name="' + field.name + '" value="' + field.value + '" />');
        jQuery(input).addClass('edit');
        jQuery(el).append(input);
        return input;
    };

    /**
     * also handles noneditable
     */
    CellRenderer.Editable.renderBoolField = function(el, rowIdx, fieldIdx, field) {
        var inner = jQuery('<div/>');
        inner.addClass('bool');
        var input = jQuery('<input type="checkbox" id="' + CellRenderer._getFieldId(rowIdx, fieldIdx, field) + '" name="' + field.name + '" value="1"' + (field.value ? ' checked="checked"' : '' )+ ' />');
        inner.append(input);
        if ( !field.isEditable ) {
            jQuery(input).attr('disabled', 'disabled');
        }
        jQuery(el).append(inner);
        return input;
    };

    CellRenderer.Editable.renderEnumField = function(el, rowIdx, fieldIdx, field) {
        var inner = jQuery('<div/>');
        inner.addClass('enum');
        var html = '<select id="' + CellRenderer._getFieldId(rowIdx, fieldIdx, field) + '" name="' + field.name + '">';
        html += _(field.options).map(function(o) { 
            return '<option value="' + o.value + '"' + (field.value === o.value ? ' selected="selected"' : '') + '>' + o.label + '</option>'; 
        }).join('');
        inner.html(html);

        jQuery(el).append(inner);
        return jQuery('#' + CellRenderer._getFieldId(rowIdx, fieldIdx, field));
    };



    CellRenderer.NonEditable.renderStringField = function(el, rowIdx, fieldIdx, field) {
        jQuery(el).html(field.value);
    };

    CellRenderer.NonEditable.renderNumberField = function(el, rowIdx, fieldIdx, field) {
        var inner = jQuery('<div/>');
        inner.html(field.value);
        inner.addClass('number');
        jQuery(el).append(inner);
    };

    CellRenderer._getFieldId = function(rowIdx, fieldIdx, field) {
        return 'edit-' + field.name + '-' + rowIdx + '-' + fieldIdx;
    };

    CellRenderer.BodyCellRenderingMatrix = [
        { isEditable: true, className: 'Field', dataType: 'string', func: CellRenderer.Editable.renderStringField },
        { isEditable: true, className: 'Field', dataType: 'int', func: CellRenderer.Editable.renderStringField },
        { isEditable: true, className: 'Field', dataType: 'int', func: CellRenderer.Editable.renderStringField },
        { isEditable: true, className: 'EnumField', dataType: null, func: CellRenderer.Editable.renderEnumField },
        { isEditable: null, className: 'Field', dataType: 'bool', func: CellRenderer.Editable.renderBoolField },
        { isEditable: false, className: 'Field', dataType: 'string', func: CellRenderer.NonEditable.renderStringField },
        { isEditable: false, className: 'Field', dataType: 'int', func: CellRenderer.NonEditable.renderNumberField },
        { isEditable: null, className: null, dataType: null, func: CellRenderer.NonEditable.renderStringField }, // fallback
        // TODO: date, (time), options, lookup
    ];


    Timer = {
        times: {},
        start: function(name) {
            Timer.times[name] = { start: new Date(), end: null, diffMsec: null };
        },
        end: function(name) {
            var time = Timer.times[name];
            time.end = new Date();
            time.diffMsec = time.end - time.start;
        },
        log: function(name) {
            var time = Timer.times[name];
            console.log('Timer', name, 'diffMsec', time.diffMsec);
        }
    };

    window.LazyTable = LazyTable;
})(window);
