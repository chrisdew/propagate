// Copyright (c) 2010 Barricane Technology Ltd., All Rights Reserved.
// Released under the MIT open source licence.

var vows = require('vows')
  , assert = require('assert')
  , lev = require('../lib/levenshtein')
  , resultdelta = require('../lib/resultdelta')
  ;

var suite = vows.describe('resultdelta').addBatch(
  { "maths"
  : { topic
    : (1 + 1)
    , "one plus one"
    : function(topic) { assert.equal(topic, 2); }
    }
  , "lev - no actions"
  : { topic
    : resultdelta([], [])
    , "check delta"
    : function(topic) { assert.deepEqual(topic, []); } // empty delta
    }
  , "lev - simple add"
  : { topic
    : resultdelta([], [{id: 0, foo: 'hello'}])
    , "check delta"
    : function(topic) { assert.deepEqual(topic, [{ op: 'insert', pos: 0, val: { id: 0, foo: 'hello' } }]); }
    }
  , "lev - delete"
  : { topic
    : resultdelta([{id: 0, foo: 'hello'}, {id: 42, foo: 'world'}], [{id: 0, foo: 'hello'}])
    , "check delta"
    : function(topic) { assert.deepEqual(topic, [{ op: 'delete', pos: 1, val: { id: 42, foo: 'world' } }]); }
    }
  , "lev - update"
  : { topic
    : resultdelta([{id: 0, foo: 'hello'}], [{id: 0, foo: 'world'}])
    , "check delta"
    : function(topic) { assert.deepEqual(topic, [{ op: 'update', pos: 0, val: { id: 0, foo: 'world' } }]); }
    }
  , "lev - complex"
  : { topic
    : resultdelta([{id: 0, foo: 'zero'},
                   {id: 1, foo: 'one'},
                   {id: 2, foo: 'two'},
                   {id: 3, foo: 'three'},
                   {id: 42, foo: 'forty-two'},
                   {id: 43, foo: 'forty-three'},
                   {id: 44, foo: 'forty-three'},
               ], [{id: 1, foo: 'one'},
                   {id: 2, foo: 'two'},
                   {id: 3, foo: 'crowd'},
                   {id: 4, foo: 'four'},
                   {id: 42, foo: 'meaning of life'},
                   {id: 100, foo: 'one hundred'},
                   {id: 44, foo: 'forty-three'},
               ])
    , "check delta"
    : function(topic) { assert.deepEqual(topic, [{ op: 'delete', pos: 0, val: { id: 0, foo: 'zero' } },
                                                 { op: 'insert', pos: 3, val: { id: 4, foo: 'four' } },
                                                 { op: 'replace', pos: 5, val: { id: 100, foo: 'one hundred' } },
                                                 { op: 'update', pos: 2, val: { id: 3, foo: 'crowd' } },
                                                 { op: 'update', pos: 4, val: { id: 42, foo: 'meaning of life' } }
                                                 ]); }
    }
  , "lev - complex 2"
  : { topic
    : resultdelta([{id: 0, foo: 'zero'},
                   {id: 1, foo: 'one'},
                   {id: 2, foo: 'two'},
                   {id: 3, foo: 'three'},
                   {id: 42, foo: 'forty-two'},
                   {id: 43, foo: 'forty-three'},
                   {id: 44, foo: 'forty-three'},
               ], [{id: 1, foo: 'one'},
                   {id: 2, foo: 'two'},
                   {id: 100, foo: 'one hundred'},
                   {id: 44, foo: 'forty-three'},
                   {id: 3, foo: 'crowd'},
                   {id: 4, foo: 'four'},
                   {id: 42, foo: 'meaning of life'},
               ])
    , "check delta"
    : function(topic) { assert.deepEqual(topic, [{ op: 'delete', pos: 0, val: { id: 0, foo: 'zero' } },
                                                 { op: 'insert', pos: 2, val: { id: 100, foo: 'one hundred' } },
                                                 { op: 'replace', pos: 3, val: { id: 44, foo: 'forty-three' } },
                                                 { op: 'replace', pos: 4, val: { id: 3, foo: 'crowd' } },
                                                 { op: 'replace', pos: 5, val: { id: 4, foo: 'four' } },
                                                 { op: 'replace', pos: 6, val: { id: 42, foo: 'meaning of life' } },
                                                 ]); }
    }
  , "lev - complex 3"
  : { topic
    : resultdelta([{ id: 13, foo: 5, bar: 'updated description 13' },
                   { id: 6, foo: 5, bar: 'updated description 14' },
                   { id: 5, foo: 6, bar: 'description 5' },
                   { id: 1, foo: 6, bar: 'description 1' },
                   { id: 8, foo: 7, bar: 'updated description 5' },
                   { id: 9, foo: 0, bar: 'description 9' },
                   { id: 2, foo: 8, bar: 'updated description 9' },
                   { id: 15, foo: 9, bar: 'updated description 16' },
                   { id: 12, foo: 11, bar: 'updated description 15' },
                   { id: 7, foo: 12, bar: 'updated description 7' },
                   { id: 11, foo: 12, bar: 'updated description 8' }
               ], [{ id: 9, foo: 0, bar: 'description 9' },
                   { id: 13, foo: 5, bar: 'updated description 13' },
                   { id: 6, foo: 5, bar: 'updated description 14' },
                   { id: 5, foo: 6, bar: 'description 5' },
                   { id: 1, foo: 6, bar: 'description 1' },
                   { id: 8, foo: 7, bar: 'updated description 5' },
                   { id: 2, foo: 8, bar: 'updated description 9' },
                   { id: 15, foo: 9, bar: 'updated description 16' },
                   { id: 12, foo: 11, bar: 'updated description 15' },
                   { id: 11, foo: 12, bar: 'updated description 8' }
               ])
    , "check delta"
    : function(topic) { assert.deepEqual(topic, [{ op: 'delete', pos: 9, val: { id: 7, foo: 12, bar: 'updated description 7' } },
                                                 { op: 'delete', pos: 5, val: { id: 9, foo: 0, bar: 'description 9' } },
                                                 { op: 'insert', pos: 0, val: { id: 9, foo: 0, bar: 'description 9' } },
                                                 ]); }
    }
  }
)

//TODO test unserialisation

suite.export(module);
