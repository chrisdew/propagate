var vows = require('vows')
  , assert = require('assert')
  , prop = require('propagate')
  ;
  
var suite = vows.describe('basic').addBatch(
  { "db"
  : { topic: function() {
        return new prop.DB();
      }
    , "sum": function(topic) {
        assert.equal(topic.version(), "0.0.1");
        /*
        topic.applyDelta({ oid: "1", table: "baz", foo: 3, bar: 4 });
        topic.applyDelta({ oid: "2", table: "baz", foo: 1 });
        topic.applyDelta({ oid: "3", table: "quux", foo: 2 });
        topic.applyDelta({ oid: "4", table: "baz", foo: 0 });
        topic.applyDelta({ oid: "2", foo: { from: 1, to: 7 }});
        // equivalent to: topic.applyDelta({ oid: "2", foo: 7, _precon: function(db, row) { return row.foo === 1 });
        topic.applyDelta({ oid: "1", bar: 5 });
        topic.applyDelta({ oid: "1", foo: 2, _precon: function(db, row) { return row.bar === 5 }});
        assert.deepEqual(topic.getState("1"), { oid: "1", foo: 3, bar: 4 });
        var query = topic
                   .filter(function(a) { a.table === "baz" })
                   .order(function(a, b) { return cmp(a.foo, b.foo) })
                   .limit(2);
        assert.deepEqual(query.getCurrentResults());
        query.on('delta', function() {
        }
        */
      }
    }
  , "1 + 1 = 3"
  : { topic: 3
    , "sum": function(topic) {
        assert.equal(topic, 1 + 1);
      }
    }
  }
);

suite.export(module);