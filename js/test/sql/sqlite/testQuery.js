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

"use strict";

var m_TestSuite = require('TestSuite.js');
var _ = require('underscore');
var assert = require('assert');
var async = require('async');
var table = require('sql/table.js');
var m_sql_field = require('sql/field.js');
var m_sql_calcField = require('sql/calcField.js');
var m_sql_fieldLink = require('sql/fieldLink.js');
var index = require('sql/index.js');
var filter = require('sql/filter.js');
var m_sql_filter = require('sql/filter.js');
var aggregate = require('sql/aggregate.js');
var query = require('sql/query.js');
var ddl = require('sql/ddl.js');
var sqlDb = require('sql/db.js');
var m_sql_sqlite_query = require('sql/sqlite/query.js');


/*
 * test cases:
 *
 * SELECT t1.f1, t1.f2 FROM table1 AS t1
 * SELECT t1.f1, t1.f2 FROM table1 AS t1 WHERE tf1.cf1 = 'a'
 * SELECT t1.f1, t2.f2 FROM table1 AS t1, table2 AS t2
 * SELECT t1.f1, t2.f2 FROM table1 AS t1, table2 AS t2 WHERE t1.cf1 = t2.cf2
 * SELECT t1.f1, t2.f2 FROM table1 AS t1 LEFT JOIN t2 ON (t1.cf1 = t2.cf2)
 * SELECT SUM(t1.f1) FROM table1 AS t1
 * SELECT SUM(t1.f1) FROM table1 AS t1 WHERE t1.cf1 = 'a'
 * SELECT SUM(t2.f2) FROM table1 AS t1, table2 AS t2 WHERE t1.cf1 = 'a' AND t1.cf2 = t2.cf3
 * SELECT COUNT(t1.f1) FROM table1 AS t1 WHERE t1.cf1 = 'a'
 * SELECT COUNT(*) FROM table1 AS t1 WHERE t1.cf1 = 'a'
 *
 *
 *
 */

var tests = {
    testBasicQuery: function() {
        var table1 = table.table('table1');
        var field1 = m_sql_field.field('field1', m_sql_field.DataType.int);
        table1.field(field1);
        var select = query.select(field1).from(table1);
        assert.strictEqual(1, select._fields.length);
        assert.strictEqual(1, select._fields.length);
        var sqliteQQ = m_sql_sqlite_query.query(select);
        assert.strictEqual('SELECT table1.field1 FROM table1', sqliteQQ.queryString());
        assert.strictEqual(0, sqliteQQ.params().length);

    },

    testQueryWithCondition: function() {
        var table1 = table.table('table1');
        var field1 = m_sql_field.field('field1', m_sql_field.DataType.int);
        table1.field(field1);
        var cond = m_sql_filter.filter()
            .field(new m_sql_field.field('field1', m_sql_field.DataType.int))
            .op(m_sql_filter.Op.eq)
            .compareTo('haha');
        var select = query.select(field1).from(table1).where(cond);
        var sqliteQQ = m_sql_sqlite_query.query(select);
        assert.strictEqual('SELECT table1.field1 FROM table1 WHERE field1 = ?', sqliteQQ.queryString());
        assert.strictEqual(1, sqliteQQ.params().length);
        assert.strictEqual('haha', sqliteQQ.params()[0]);
    },

    testQueryWithJoin: function() {
        var table1 = table.table('table1');
        var table2 = table.table('table2');
        var id1 = m_sql_field.field('id1', m_sql_field.DataType.int);
        table1.field(id1);
        var name1 = m_sql_field.field('name1', m_sql_field.DataType.string);
        table1.field(name1);
        var id2 = m_sql_field.field('id2', m_sql_field.DataType.int);
        table2.field(id2);
        var s = query.select(id1, name1, id2)
                .from(table1, table2)
                .where(m_sql_filter.filter(id1, m_sql_filter.Op.eq, id2));
        var sqliteQQ = m_sql_sqlite_query.query(s);
        var ss = sqliteQQ.queryString(s);
        assert.strictEqual('SELECT table1.id1, table1.name1, table2.id2 FROM table1, table2 WHERE table1.id1 = table2.id2', sqliteQQ.queryString());
        assert.strictEqual(0, sqliteQQ.params().length);
    },

    testAggregateQuery: function() {
        var table1 = table.table('table1');
        var table2 = table.table('table2');
        var sumField = m_sql_field.field('sumField', m_sql_field.DataType.int);
        table2.field(sumField);
        var id1 = m_sql_field.field('id1', m_sql_field.DataType.int);
        table1.field(id1);
        var id2 = m_sql_field.field('id2', m_sql_field.DataType.int);
        table2.field(id2);
        var s = query.select(aggregate.aggregate(aggregate.Type.sum, sumField))
                .from(table1, table2)
                .where(m_sql_filter.filter(id1, m_sql_filter.Op.eq, id2));
        var sqliteQQ = m_sql_sqlite_query.query(s);
        var ss = sqliteQQ.queryString(s);
        assert.strictEqual('SELECT SUM(table2.sumField) AS sumField FROM table1, table2 WHERE table1.id1 = table2.id2', sqliteQQ.queryString());
        assert.strictEqual(0, sqliteQQ.params().length);
    },

    testInsertQuery: function() {
        var table1 = table.table('table1');
        var id1 = m_sql_field.field('id1', m_sql_field.DataType.int).value(1);
        table1.field(id1);
        var name1 = m_sql_field.field('name1', m_sql_field.DataType.string).value('name');
        table1.field(name1);
        var s = query.insert()
                .into(table1); // all fields
        var sqliteQQ = m_sql_sqlite_query.query(s);
        var ss = sqliteQQ.queryString(s);
        assert.strictEqual('INSERT INTO table1 (id1, name1) VALUES (?, ?)', sqliteQQ.queryString());
        assert.strictEqual(2, sqliteQQ.params().length);
        assert.strictEqual(1, sqliteQQ.params()[0]);
        assert.strictEqual('name', sqliteQQ.params()[1]);
    },

    testUpdateQuery: function() {
        var table1 = table.table('table1');
        var id1 = m_sql_field.field('id1', m_sql_field.DataType.int).value(1);
        table1.field(id1);
        var name1 = m_sql_field.field('name1', m_sql_field.DataType.string).value('name');
        table1.field(name1);
        var s = query.update()
                .table(table1)
                .where(m_sql_filter.filter(id1, m_sql_filter.Op.eq, 1)); // all fields
        var sqliteQQ = m_sql_sqlite_query.query(s);
        var ss = sqliteQQ.queryString(s);
        assert.strictEqual('UPDATE table1 SET id1 = ?, name1 = ? WHERE table1.id1 = ?', sqliteQQ.queryString()); // TODO there should really be aliases everywhere
        assert.strictEqual(3, sqliteQQ.params().length);
        assert.strictEqual(1, sqliteQQ.params()[0]);
        assert.strictEqual('name', sqliteQQ.params()[1]);
        assert.strictEqual(1, sqliteQQ.params()[2]);
    },

    DEACTIVATEDtestDeleteQuery: function() {
        var table1 = table.table('table1');
        var id1 = m_sql_field.field('id1', m_sql_field.DataType.int).value(1);
        table1.field(id1);
        var s = query.delete()
                .table(table1)
                .where(m_sql_filter.filter(id1, m_sql_filter.Op.eq, 1)); // all fields
        var sqliteQQ = m_sql_sqlite_query.query(s);
        var ss = sqliteQQ.queryString();
        assert.strictEqual('DELETE FROM table1 WHERE id1 = ?', sqliteQQ.queryString());
        assert.strictEqual(1, sqliteQQ.params().length);
        assert.strictEqual(1, sqliteQQ.params()[0]);
    },

    testCreateQuery: function() {
        var table1 = table.table('table1');
        var id1 = m_sql_field.field('id1', m_sql_field.DataType.int);
        var name1 = m_sql_field.field('name1', m_sql_field.DataType.string);
        table1.field(id1).field(name1);
        var s = ddl.create(table1);
        var sqliteQQ = m_sql_sqlite_query.query(s);
        var ss = sqliteQQ.queryString();
    },

    testIndex: function() {
        var id1 = m_sql_field.field('id1', m_sql_field.DataType.int);
        var i1 = index.index('idx_id1').field(id1);
        assert.strictEqual('idx_id1', i1.name());
        assert.strictEqual(1, _.keys(i1.fields()).length);
        assert.strictEqual(id1, i1.field('id1'));
    },

    testCalcField: function() {
        var table1 = table.table('table1'); // where we want the sum via the calcField
        var table2 = table.table('table2'); // where the sum is aggregated // SELECT SUM(table2.sumField) FROM table1, table2 WHERE table1.id1 = table2.id2 [AND table1.id1=<constant>]
        var id1 = m_sql_field.field('id1', m_sql_field.DataType.int);
        var id2 = m_sql_field.field('id2', m_sql_field.DataType.int);
        var sumField = m_sql_field.field('sumField', m_sql_field.DataType.int, m_sql_calcField.CalcType.sum, { label: 'Sum1' });
        var calcField = m_sql_calcField.calcField('calcField', m_sql_field.DataType.int, 'Label', m_sql_calcField.CalcType.sum, sumField, id1);
        table1.field(id1);
        table2.field(id2);
        table1.field(calcField);
        table2.field(sumField);
        var link = m_sql_fieldLink.fieldLink(id1, id2, m_sql_fieldLink.Type.manyToOne);
        id1.link(link);

        id1.value(1);

        calcField.filters([m_sql_filter.filter(id1, m_sql_filter.Op.eq, 1)]);
        var q = calcField.query();
        var qq = m_sql_sqlite_query.query(q);
        assert.strictEqual('SELECT SUM(table2.sumField) AS calcField FROM table1, table2 WHERE table1.id1 = table2.id2 AND table1.id1 = ?', qq.queryString());
        assert.equal(1, qq.params()[0]);

    }

};

function runTests(testNames) {
    m_TestSuite.TestSuite.call(tests);
    m_TestSuite.TestSuite.prototype.runTests.call(tests, testNames);
}

exports.runTests = runTests;
