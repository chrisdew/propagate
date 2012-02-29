var ev = require('events')
  , util = require('util')
  ;

function Query() {
  
}

util.inherits(Query, ev.EventEmitter);


// these are factory methods which make a new Query whose source is 'this'
Query.prototype.filter = function(fn) {
  
}

Query.prototype.limit = function(fn) {
  
}

Query.prototype.sort = function(fn) {
  
}

exports.Query = Query;