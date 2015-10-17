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

    var FormRouter = function() {};

    FormRouter.route = function(data) {
        switch ( data.form ) {
            case 'edit':
                return new EditForm(data);
                break;
            case 'list':
                return ListForm;
                break;
            default:
                throw 'no such action as ' + data.action;
        }
    };

    window.FormRouter = FormRouter;
})(window);
