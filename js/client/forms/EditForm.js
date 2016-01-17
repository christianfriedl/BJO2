/*
 * Copyright (C) 2015,2016 Christian Friedl <Mag.Christian.Friedl@gmail.com>
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

    function EditForm(data, cssId) {
        Form.call(this, data, cssId);
        this._data = data;
        this._cssId = cssId;
        console.log('ef data', data);
    }

    function editForm(data, cssId) { return new EditForm(data, cssId); }
    EditForm.prototype = new Form();

    EditForm.prototype.toHtml = function() {
        this.fetchRow(this._data.id, function(err, row) {
            this._data.row = row;
            var table = new SingleRowTable(this._cssId, this._data.row, this.getSaveFieldFunc());
            table.render();
        }.bind(this));
        return;

        return Tags.script({ type: 'text/javascript' }, [], `
            jQuery(document).ready(function() { 
                var table = new SingleRowTable(` + this._thisFormHtml() + `._cssId, ` + this._thisFormHtml() + `._data.row, ` + this._thisFormHtml() + `.getSaveFieldFunc());
                table.render();
            });`);
    };

    EditForm.prototype.countRows = function(callback) {
        var fetchUrl = '/' + [ this._data.module, this._data.controller, 'count'].join('/');
        var data = { conditions: {} };
        jQuery.ajax({
            type: 'POST', 
            url: fetchUrl,
            data: JSON.stringify(data),
            dataType: 'json',
            contentType: 'application/json',
            success: function(data) {
                console.log('fetchRows successs, got data', data);
                callback(false, data.count);
            }
        });
    };

    EditForm.prototype.fetchRow = function(id, callback) {
        var fetchUrl = '/' + [ this._data.module, this._data.controller, 'edit'].join('/');
        var data = { id: id };
        console.log('fetchrow sends data', data, JSON.stringify(data));
        jQuery.ajax({
            type: 'GET', 
            url: fetchUrl,
            data: data,
            dataType: 'json',
            contentType: 'application/json',
            success: function(data) {
                console.log('fetchRows successs, got data', data);
                callback(false, data.row);
            }
        });
    };

    EditForm.prototype.fetchTemplateRow = function(callback) {
        var fetchUrl = '/' + [ this._data.module, this._data.controller, 'templateRow'].join('/');
        jQuery.ajax({
            type: 'POST', 
            url: fetchUrl,
            data: JSON.stringify({}),
            dataType: 'json',
            contentType: 'application/json',
            success: function(data) {
                console.log('fetchTemplateRow successs, got data', data);
                callback(false, data);
            }
        });
    };

    EditForm.prototype.saveField = function(fieldName, row, callback) {
        console.log('listform will saveField');
        var url = '/' + [ this._data.module, this._data.controller, 'saveField'].join('/');
        var data = { fieldName: fieldName, row: row };
        jQuery.ajax({
            type: 'POST', 
            url: url,
            data: JSON.stringify(data),
            dataType: 'json',
            contentType: 'application/json',
            success: function(data) {
                console.log('saveField successs, got data', data);
                callback(false, data);
            }
        });
    };

    EditForm.prototype.getSaveFieldFunc = function() {
        return this.saveField.bind(this);
    };

    window.EditForm = EditForm;
    window.editForm = editForm;
})(window);
