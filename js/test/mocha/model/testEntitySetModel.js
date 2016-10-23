/*
 * Copyright (C) 2015,2016 Christian Friedl <Mag.Christian.Friedl@gmail.com>
 *
 * This file is part of SteerGlance.
 *
 * SteerGlance is free software; you can redistribute it and/or modify
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

var assert = require('assert');
var model_EntityModel = require('model/EntityModel.js');
var model_EntitySetModel = require('model/EntitySetModel.js');
const sql_DB = require('sql/DB.js');
const sql_Table = require('sql/Table.js');
const sql_Field = require('sql/Field.js');

describe('model_EntitySetModel', function() {
    var db1;
    beforeEach(function(done) {
        db1 = sql_DB.db(':memory:').open(':memory:');
        db1.runSql('CREATE TABLE table1 (id int, field1 int)', [])
            .then(function() { 
                return db1.runSql('INSERT INTO table1 (id, field1) VALUES(1, 1)');
            }).done(function() { done(); });
    });
    afterEach(function() {
        db1.close();
    });
    it('should find an entity', function(done) {
        var table1 = sql_Table.create('table1');
        var id1 = sql_Field.create('id', sql_Field.DataType.int);
        table1.addField(id1);
        var field1 = sql_Field.create('field1', sql_Field.DataType.int);
        table1.addField(field1);

        const set = model_EntitySetModel.create(db1, table1, model_EntityModel.create);
        set.findEntityById(1).then( function(em) {
            assert.strictEqual(em.getTable().getField('id').getValue(), 1);
            assert.strictEqual(em.getTable().getField('field1').getValue(), 1);
            done();
        }).catch(function(err) {
            done(err);
        });
    });
    it('should not find a nonexisting entity', function(done) {
        var table1 = sql_Table.create('table1');
        var id1 = sql_Field.create('id', sql_Field.DataType.int);
        table1.addField(id1);
        var field1 = sql_Field.create('field1', sql_Field.DataType.int);
        table1.addField(field1);

        const set = model_EntitySetModel.create(db1, table1, model_EntityModel.create);
        set.findEntityById(257).then( function(em) {
            assert.strictEqual(em, null);
            done();
        }).catch(function(err) {
            done(err);
        });
    });
    it('should load an entity', function(done) {
        var table1 = sql_Table.create('table1');
        var id1 = sql_Field.create('id', sql_Field.DataType.int);
        table1.addField(id1);
        var field1 = sql_Field.create('field1', sql_Field.DataType.int);
        table1.addField(field1);

        const set = model_EntitySetModel.create(db1, table1, model_EntityModel.create);
        set.loadEntityById(1).then( function(em) {
            assert.strictEqual(em.getTable().getField('id').getValue(), 1);
            assert.strictEqual(em.getTable().getField('field1').getValue(), 1);
            done();
        }).catch(function(err) {
            done(err);
        });
    });
    it('should throw on a nonexisting entity', function(done) {
        var table1 = sql_Table.create('table1');
        var id1 = sql_Field.create('id', sql_Field.DataType.int);
        table1.addField(id1);
        var field1 = sql_Field.create('field1', sql_Field.DataType.int);
        table1.addField(field1);

        const set = model_EntitySetModel.create(db1, table1, model_EntityModel.create);
        return set.loadEntityById(257).then(function() { done(); }).catch(function(e) { console.log(e); done(); }).done();
    });
});
