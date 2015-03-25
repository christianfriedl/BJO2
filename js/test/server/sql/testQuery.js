var assert = require('assert');
var table = require('../../../server/sql/table.js');
var field = require('../../../server/sql/field.js');
var condition = require('../../../server/sql/condition.js');
var query = require('../../../server/sql/query.js');

function testQuery() {
    var table1 = new table.Table('table1');
    var field1 = new field.Field('field1', field.Type.int);
    table1.field(field1);
    var select = query.select(field1).from(table1);
    assert.strictEqual(1, select._fields.length);
    assert.strictEqual(1, select._fields.length);
    console.log(select);
}
function testQuery2() {
    var cond = condition.condition()
        .field(new field.Field('field1'))
        .op(condition.Op.eq)
        .compareTo('haha');
    console.log(cond);
}


testQuery();
testQuery2();

