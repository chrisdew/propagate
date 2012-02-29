// Copyright (c) 2012 Barricane Technology Ltd., All Rights Reserved.
// Released under the MIT open source licence.

// This module contains the database code.
// It specifically eschews serialisation and io concerns.

var uuid = require('node-uuid')
  , st = require('./state')
  , qu = require('./query')
  , util = require('util')
  ;

// The DB constructor represents the database. In almost all circumstances only
// one database will exist per process. More can be used, if needed, but the
// application will become more complex, as it cannot use
// <code>process.db</code> in constructors.
function DB(options) {
  options = options || {};
  this.events = [];
  this.events_by_oid = {};
  this.states = {};
}


util.inherits(DB, qu.Query);

DB.prototype.version = function() {
  return "0.0.1";
}

DB.prototype.applyDelta = function(kv) {
  this.events.push(kv);
  var oid = kv.oid;
  this.events_by_oid[oid] = kv;
  var state = this.states[oid];
  if (!state) {
    state = new st.State();
  }
  this.states[oid] = state.applyDelta(kv);
}

DB.prototype.getState = function(oid) {
  return this.states[oid];
}

// Export the symbols.
exports.DB = DB;
