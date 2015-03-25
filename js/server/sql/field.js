var bjoo = require('../../BJOObject.js');

var Type = { int: 'int', string: 'string' }

function Field(name, type) {
    this._className = 'sql.Field';
    this._name = name;
    this._type = type;
    this._value = null;
}

Field.prototype = new bjoo.BJOObject();

Field.prototype.table = function(table) {
	if ( typeof(table) !== 'undefined' ) {	
	    this._table = table;
        return this;
    }
    return this._table;
};

Field.prototype.name = function(name) {
	if ( typeof(name) !== 'undefined' ) {	
	    this._name = name;
        return this;
    }
    return this._name;
};

Field.prototype.type = function(type) {
	if ( typeof(type) !== 'undefined' ) {	
	    this._type = type;
        return this;
    }
    return this._type;
};

Field.prototype.value = function(value) {
	if ( typeof(value) !== 'undefined' ) {	
	    this._value = value;
        return this;
    }
    return this._value;
};


exports.Field = Field;
exports.Type = Type;
