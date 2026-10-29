// Shared wall-clock timetable. All playback computers must use synchronized clocks.
(function (root) {
  const schedule = {
    portraitScreen: 1,
    workId: 'agoston-nagy',
    period: 600,
    // Guard gaps separate the two sound sources.
    start: 3,
    end: 63,
    audioStart: 66,
    audioEnd: 597,
    phase(now = Date.now()) { return (now / 1000) % this.period; },
    portraitActive(now = Date.now()) {
      const p = this.phase(now);
      return p >= this.start && p < this.end;
    },
    audioRemaining(now = Date.now()) {
      const p = this.phase(now);
      return p >= this.audioStart && p < this.audioEnd ? this.audioEnd - p : 0;
    },
    canStart(seconds, now = Date.now()) {
      return Number.isFinite(seconds) && seconds > 0 && this.audioRemaining(now) >= seconds + 2;
    }
  };
  root.AudioSchedule = schedule;
  if (typeof module !== 'undefined') module.exports = schedule;
})(typeof window === 'undefined' ? globalThis : window);
