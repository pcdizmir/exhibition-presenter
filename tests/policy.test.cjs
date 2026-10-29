const test = require('node:test');
const assert = require('node:assert/strict');
const p = require('../js/policy.js');
test('minute defaults and explicit full video / custom durations', () => {
  assert.equal(p.duration({id:'a'}, {}, {}), 60);
  assert.equal(p.duration({id:'a'}, {duration:{a:0}}, {}), 0);
  assert.equal(p.duration({id:'a', duration:90}, {duration:{a:45}}, {}), 45);
});
test('long videos skip cycles, explicit frequency wins', () => {
  for (const [seconds, n] of [[30,1],[60,1],[61,2],[360,6]])
    assert.equal(p.frequency({id:'a'}, {}, seconds), n);
  assert.equal(p.frequency({id:'a'}, {every:{a:1}}, 360), 1);
  assert.equal(p.frequency({id:'a'}, {}, NaN), 1);
});
test('legacy duplicate assignments have exactly one deterministic owner', () => {
  const s = {screens:{1:{selected:['a','a']},2:{selected:['a','b']},3:{selected:['b']}}};
  p.exclusive(s,[1,2,3]);
  assert.deepEqual(Object.values(s.screens).map(s=>s.selected), [['a'],['b'],[]]);
});
