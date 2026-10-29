const test = require('node:test');
const assert = require('node:assert/strict');
const s = require('../js/audio-schedule.js');
test('portrait and landscape audio windows never intersect, including period boundaries', () => {
  for (let ms = 0; ms < 1200000; ms += 100) {
    assert.ok(!(s.portraitActive(ms) && s.audioRemaining(ms) > 0));
  }
});
test('full videos wait if they would run into the reserved window', () => {
  assert.equal(s.canStart(187, 66000), true);
  assert.equal(s.canStart(187, 500000), false);
  assert.equal(s.canStart(60, 30000), false);
  assert.equal(s.canStart(undefined, 100000), false);
});
