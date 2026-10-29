// Pure playback rules, shared by the player and panel. No browser dependencies.
(function (root) {
  const policy = {
    duration(work, settings, screen) {
      const value = settings.duration?.[work.id] ?? work.duration ?? screen.imageDuration ?? 60;
      const seconds = Number(value);
      return Number.isFinite(seconds) && seconds >= 0 ? Math.min(86400, seconds) : 60;
    },
    frequency(work, settings, mediaDuration) {
      const explicit = Number(settings.every?.[work.id] || work.every);
      if (Number.isFinite(explicit) && explicit >= 1) return Math.min(100, Math.round(explicit));
      return Number.isFinite(mediaDuration) ? Math.max(1, Math.min(100, Math.ceil(mediaDuration / 60))) : 1;
    },
    exclusive(settings, screens) {
      const owned = new Set();
      for (const screen of screens) {
        settings.screens[screen].selected = settings.screens[screen].selected.filter(id => {
          if (owned.has(id)) return false;
          owned.add(id);
          return true;
        });
      }
      return settings;
    }
  };
  root.PlaybackPolicy = policy;
  if (typeof module !== 'undefined') module.exports = policy;
})(typeof window === 'undefined' ? globalThis : window);
