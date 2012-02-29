function State(kv) {
  
}

State.prototype.applyDelta = function(kv) {
  for (var k in kv) {
    var v = kv[k];
    if (v === null) {
      delete this[k];
    } else {
      this[k] = v;
    }
  }
  return this;
}

exports.State = State;