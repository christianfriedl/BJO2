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

    function attr(name, value) {
        return { name: name, value: value };
    }

    /*
     * optional object attrs
     * optional array subTags
     * optional string text
     */
    function tag(name, attrs, subTags, text) {
        if ( typeof(subTags) === 'undefined' ) {
            subTags = {};
        }
        if ( typeof(text) === 'undefined' ) {
            text = '';
        }
        return '<' + name
            +_(_(attrs).keys()).reduce(function(memo, name) { return memo + ' ' + name + '="' + attrs[name] + '"'; }, '')
            + '>'
            + _(subTags).reduce(function(memo, text) { return memo + text; }, '')
            + text
            + '</' + name + '>';
    }

    var Tags = {
        form: function(attrs, subTags, text) { return tag('form', attrs, subTags, text); },
        div: function(attrs, subTags, text) { return tag('div', attrs, subTags, text); },
        script: function(attrs, subTags, text) { return tag('script', attrs, subTags, text); },
        table: function(attrs, subTags, text) { return tag('table', attrs, subTags, text); },
        thead: function(attrs, subTags, text) { return tag('thead', attrs, subTags, text); },
        tbody: function(attrs, subTags, text) { return tag('tbody', attrs, subTags, text); },
        tr: function(attrs, subTags, text) { return tag('tr', attrs, subTags, text); },
        th: function(attrs, subTags, text) { return tag('th', attrs, subTags, text); },
        td: function(attrs, subTags, text) { return tag('td', attrs, subTags, text); },
        option: function(attrs, subTags, text) { return tag('option', attrs, subTags, text); },
        select: function(attrs, subTags, text) { return tag('select', attrs, subTags, text); },
        input: function(attrs, subTags, text) { return tag('input', attrs, subTags, text); },
        button: function(attrs, subTags, text) { return tag('button', attrs, subTags, text); },
        a: function(attrs, subTags, text) { return tag('a', attrs, subTags, text); },
    };

    window.Tags = Tags;
    window.tag = tag;
    window.attr = attr;
})(window);
