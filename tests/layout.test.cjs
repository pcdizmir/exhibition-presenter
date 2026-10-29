const test = require('node:test');
const assert = require('node:assert/strict');
const {execFileSync} = require('node:child_process');
global.window = {};
require('../works.js');
require('../exhibition.js');
require('../settings.js');
test('all catalog artworks have one screen and unique media files', () => {
  const ids = Object.values(window.SETTINGS.screens).flatMap(c => c.selected);
  assert.equal(new Set(ids).size, ids.length);
  assert.deepEqual([...ids].sort(), window.WORKS.map(w => w.id).sort());
  assert.equal(new Set(window.WORKS.map(w => w.file)).size, window.WORKS.length);
  for (const [n, c] of Object.entries(window.SETTINGS.screens)) {
    assert.deepEqual(c.selected, window.DEFAULT_ASSIGNMENT[n]);
    assert.equal(c.sound, Number(n) === window.SOUND_SCREEN || Number(n) === 1);
  }
});
test('all videos containing audio are on the sound screen', () => {
  for (const w of window.WORKS.filter(w => w.file.endsWith('.mp4'))) {
    const audio = JSON.parse(execFileSync('ffprobe', ['-v','error','-select_streams','a','-show_entries','stream=index','-of','json',w.file]));
    if (audio.streams.length) assert.ok(window.SETTINGS.screens[w.id === 'agoston-nagy' ? 1 : window.SOUND_SCREEN].selected.includes(w.id), w.id);
  }
});
