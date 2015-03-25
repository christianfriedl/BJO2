var Op = { eq: 'eq', gt: 'gt', lt: 'lt', gte: 'gte', lte: 'lte', ne: 'ne', like: 'like' };

function Condition(field, op, compareTo) {
    this._className = 'sql.Condition';
    this._field = field;
    this._op = op;
    this._compareTo = compareTo;
}

Condition.prototype.field = function(field) {
    if ( typeof(field) !== 'undefined' ) {
        this._field = field;
        return this;
    }
    return this._field;
};

Condition.prototype.op = function(op) {
    if ( typeof(op) !== 'undefined' ) {
        this._op = op;
        return this;
    }
    return this._op;
};

Condition.prototype.compareTo = function(compareTo) {
    if ( typeof(compareTo) !== 'undefined' ) {
        this._compareTo = compareTo;
        return this;
    }
    return this._compareTo;
};

function condition(field, op, compareTo) { return new Condition(field, op, compareTo); }

exports.condition = condition;
exports.Op = Op;
