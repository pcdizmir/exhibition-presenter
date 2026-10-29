(() => {
  const STORE = "pcd-exhibition:settings:" + (window.LAYOUT_REVISION || "v1");
  const audioSchedule = window.AudioSchedule;
  const audioScreen = n => n === SOUND_SCREEN || n === audioSchedule.portraitScreen;
  const SOUND_SCREEN = window.SOUND_SCREEN || 2;
  const STORE_SCREEN = "pcd-exhibition:screen";
  const SCREENS = [1, 2, 3, 4];
  const MAX_EVERY = 100;
  const policy = window.PlaybackPolicy;
  const WORKS = window.WORKS || [];
  const byId = Object.fromEntries(WORKS.map(w => [w.id, w]));
  const $ = id => document.getElementById(id);
  const isVideo = w => /\.mp4$/i.test(w.file);

  // ---------- settings ----------
  const screenDefaults = ids => ({ selected: ids || [], imageDuration: 60, shuffle: false, sound: false, caption: true, qr: true, rotation: 0 });

  function defaultSettings() {
    const d = window.DEFAULT_ASSIGNMENT || {};
    return { screens: Object.fromEntries(SCREENS.map(n => [n, { ...screenDefaults(d[n]), sound: audioScreen(n) }])), every: {}, duration: {} };
  }

  function normalize(s) {
    // fill in missing fields, drop ids that no longer exist
    s = s && s.screens ? s : defaultSettings();
    for (const n of SCREENS) {
      const c = Object.assign(screenDefaults(), s.screens[n] || {});
      c.selected = (c.selected || []).filter(id => byId[id]);
      c.sound = audioScreen(n) && !!c.sound;
      s.screens[n] = c;
    }
    // every: { workId: N } — the work plays once every N cycles (shared by all screens)
    s.every = Object.fromEntries(Object.entries(s.every || {})
      .filter(([id, n]) => byId[id] && n >= 1)
      .map(([id, n]) => [id, Math.min(MAX_EVERY, Math.round(n))]));
    s.duration = s.duration || {};
    policy.exclusive(s, SCREENS);
    return s;
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORE);
      if (raw) return { settings: normalize(JSON.parse(raw)), source: "local" };
    } catch (_) {}
    if (window.SETTINGS) return { settings: normalize(structuredClone(window.SETTINGS)), source: "file" };
    return { settings: normalize(null), source: "default" };
  }

  let { settings, source } = load();

  function save() {
    source = "local";
    try { localStorage.setItem(STORE, JSON.stringify(settings)); } catch (_) {}
    renderSourceStatus();
  }

  // ---------- which screen ----------
  const params = new URLSearchParams(location.search);
  let screen = parseInt(params.get("screen"), 10);
  if (!SCREENS.includes(screen)) {
    try { screen = parseInt(localStorage.getItem(STORE_SCREEN), 10); } catch (_) {}
  }
  const screenUnknown = !SCREENS.includes(screen);
  if (screenUnknown) screen = 1;

  function switchScreen(n) {
    screen = n;
    try { localStorage.setItem(STORE_SCREEN, String(n)); } catch (_) {}
    const u = new URL(location.href);
    u.searchParams.set("screen", n);
    history.replaceState(null, "", u);
    showBadge();
    applyView();
    refreshPlaylist(true);
    renderPanel();
  }

  const cfg = () => settings.screens[screen];

  // ---------- player ----------
  const video = $("video"), image = $("image");
  let playlist = [], index = -1, current = null;
  let cycle = 0, offsets = {};
  let token = 0, timer = null;
  let lastProgress = { t: -1, at: 0 };
  const errors = new Set();
  const durations = {};
  let pendingAudio = null;

  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }

  const everyOf = w => policy.frequency(w, settings, durations[w.id]);
  const durationOf = w => policy.duration(w, settings, cfg());

  function buildPlaylist() {
    const sel = new Set(cfg().selected);
    const list = WORKS.filter(w => sel.has(w.id) && w.file && w.id !== audioSchedule.workId);
    // spread works that skip cycles over different cycles, so long videos don't pile up in the same one
    // (computed from list order, so it stays stable when shuffling)
    offsets = {};
    let k = 0;
    for (const w of list) if (everyOf(w) > 1) offsets[w.id] = k++ % everyOf(w);
    return cfg().shuffle ? shuffle(list) : list;
  }

  const playsThisCycle = w => everyOf(w) <= 1 || cycle % everyOf(w) === offsets[w.id];

  // When the list changes, don't interrupt what's playing; if it was removed, move on right away.
  function refreshPlaylist(force) {
    playlist = buildPlaylist();
    $("empty").classList.toggle("active", playlist.length === 0);
    if (!playlist.length) { stop(); return; }
    const i = current ? playlist.findIndex(w => w.id === current.id) : -1;
    if (i >= 0 && !force) {
      index = i;
      video.loop = isVideo(current) && durationOf(current) > 0;
      return;
    }
    index = -1;
    advance(1);
  }

  function stop() {
    token++;
    clearTimeout(timer);
    current = null;
    video.pause(); video.muted = true;
    video.classList.remove("visible"); image.classList.remove("visible");
    $("c-left").classList.add("faded");
    setTimeout(() => { if (!current) { video.removeAttribute("src"); video.load(); } }, 900);
    renderNow();
  }

  function newCycle() {
    cycle++;
    if (cfg().shuffle) {
      // reshuffle after each round, without repeating the same work back to back
      const last = current;
      playlist = buildPlaylist();
      if (playlist.length > 1 && last && playlist[0].id === last.id) playlist.push(playlist.shift());
    }
    index = -1;
  }

  function advance(dir) {
    if (screen === audioSchedule.portraitScreen && audioSchedule.portraitActive()) {
      show(byId[audioSchedule.workId]); return;
    }
    if (!playlist.length) return;
    if (dir < 0) {
      // stepping back manually ignores the every-N-cycles rule
      index = (index - 1 + playlist.length) % playlist.length;
      show(playlist[index]);
      return;
    }
    // step forward, skipping works that sit out this cycle
    for (let step = 0; step <= playlist.length * MAX_EVERY; step++) {
      if (index >= playlist.length - 1) newCycle();
      index++;
      if (playsThisCycle(playlist[index])) { show(playlist[index]); return; }
    }
    show(playlist[index]);
  }

  function show(w) {
    if (w.id === audioSchedule.workId && (screen !== audioSchedule.portraitScreen || !audioSchedule.portraitActive())) return;
    if (screen === SOUND_SCREEN && !audioSchedule.canStart(durationOf(w) || durations[w.id])) {
      pendingAudio = w; stop(); return;
    }
    pendingAudio = null;
    const t = ++token;
    clearTimeout(timer);
    const prevWasVideo = current && isVideo(current);
    video.classList.remove("visible"); image.classList.remove("visible");
    $("c-left").classList.add("faded");
    current = w;
    renderPanel();
    renderNow();

    const fade = (prevWasVideo || image.src) ? 800 : 0;
    setTimeout(() => {
      if (t !== token) return;
      writeCaption(w);
      if (isVideo(w)) playVideo(w, t); else showImage(w, t);
    }, fade);
  }

  function reveal(el) {
    el.classList.add("visible");
    $("c-left").classList.remove("faded");
  }

  function playVideo(w, t) {
    image.removeAttribute("src");
    video.muted = !soundAllowed();
    video.loop = durationOf(w) > 0;
    video.src = w.file;
    lastProgress = { t: -1, at: performance.now() };
    const p = video.play();
    if (p) p.catch(() => {
      // if autoplay with sound is blocked, retry muted
      if (t !== token) return;
      video.muted = true;
      video.play().catch(() => {});
    });
    let started = false;
    video.onplaying = () => {
      if (t !== token) return;
      if (!playbackAllowed()) { stop(); return; }
      video.muted = !soundAllowed();
      reveal(video);
      if (!started && durationOf(w) > 0) {
        started = true;
        timer = setTimeout(() => { if (t === token) advance(1); }, durationOf(w) * 1000);
      }
    };
    video.onloadedmetadata = () => { durations[w.id] = video.duration; buildPlaylist(); };
    video.onended = () => { if (t === token && !video.loop) advance(1); };
    video.onerror = () => {
      if (t !== token) return;
      errors.add(w.id); renderPanel();
      timer = setTimeout(() => { if (t === token) advance(1); }, 1500);
    };
  }

  function showImage(w, t) {
    video.pause(); video.removeAttribute("src"); video.load();
    image.onload = () => {
      if (t !== token) return;
      reveal(image);
      timer = setTimeout(() => { if (t === token) advance(1); }, (durationOf(w) || 60) * 1000);
      preloadNext();
    };
    image.onerror = () => {
      if (t !== token) return;
      errors.add(w.id); renderPanel();
      timer = setTimeout(() => { if (t === token) advance(1); }, 1500);
    };
    image.src = w.file;
  }

  // warm the cache for the next image
  function preloadNext() {
    const n = playlist[(index + 1) % playlist.length];
    if (n && !isVideo(n)) { const i = new Image(); i.src = n.file; }
  }

  // Watchdog: if a video stalls (stops progressing), retry; if that fails, skip
  setInterval(() => {
    if (!current || !isVideo(current) || !video.src) return;
    const now = performance.now();
    if (video.currentTime !== lastProgress.t) { lastProgress = { t: video.currentTime, at: now }; return; }
    const stalled = now - lastProgress.at;
    if (video.paused && !video.ended && stalled > 3000) video.play().catch(() => {});
    if (stalled > 12000) { lastProgress.at = now; advance(1); }
  }, 2000);

  function writeCaption(w) {
    // without a title, the artist name moves up to the large line
    $("c-title").textContent = w.title || w.artist || "";
    $("c-artist").textContent = w.title ? (w.artist || "") : "";
    $("c-location").textContent = w.location || "";
    $("c-artist").style.display = $("c-artist").textContent ? "" : "none";
    $("c-location").style.display = w.location ? "" : "none";
    const qr = $("c-qr");
    if (w.qr && cfg().qr) { qr.src = w.qr; qr.hidden = false; }
    else { qr.removeAttribute("src"); qr.hidden = true; }
  }

  // ---------- view ----------
  function applyView() {
    const c = cfg();
    const root = $("root");
    root.style.setProperty("--rotation", (c.rotation || 0) + "deg");
    root.classList.toggle("portrait", c.rotation == 90 || c.rotation == 270);
    $("caption").classList.toggle("hidden", !c.caption);
    if (current) writeCaption(current);
    video.muted = !soundAllowed();
  }

  let badgeTimer;
  function showBadge() {
    $("badge").textContent = "SCREEN " + screen;
    $("badge").classList.add("show");
    clearTimeout(badgeTimer);
    badgeTimer = setTimeout(() => $("badge").classList.remove("show"), 4000);
  }

  // cursor & settings button only appear while the mouse moves
  let mouseTimer;
  document.addEventListener("mousemove", () => {
    document.body.classList.remove("hide-cursor");
    document.body.classList.add("mouse-active");
    clearTimeout(mouseTimer);
    mouseTimer = setTimeout(() => {
      if (panelOpen()) return;
      document.body.classList.add("hide-cursor");
      document.body.classList.remove("mouse-active");
    }, 2500);
  });

  // ---------- panel ----------
  const panel = $("panel");
  const panelOpen = () => panel.classList.contains("open");
  function openPanel() { panel.classList.add("open"); document.body.classList.remove("hide-cursor"); renderPanel(); measureDurations(); }
  function closePanel() { panel.classList.remove("open"); }

  const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const fmtTime = s => {
    if (!isFinite(s)) return "";
    s = Math.round(s);
    return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
  };
  const thumbOf = w => w.file ? w.file.replace(/^media\//, "media/thumbs/").replace(/\.mp4$/i, ".jpg") : null;
  const estDuration = (w, c) => {
    if (!w.file) return 0;
    return policy.duration(w, settings, c) || durations[w.id] || 60;
  };

  function renderPanel() {
    if (!panelOpen()) return;
    $("screen-picker").innerHTML = SCREENS.map(n => `<button data-screen="${n}" class="${n === screen ? "selected" : ""}">Screen ${n}</button>`).join("");

    $("table-head").innerHTML = `<th></th><th>Work</th><th>Duration (s)</th><th class="every" title="How often the work plays: once every N cycles">Plays</th>` +
      SCREENS.map(n => `<th class="s ${n === screen ? "current" : ""}">S${n}</th>`).join("");

    const row = w => {
      const thumb = thumbOf(w);
      const playing = current && current.id === w.id;
      const tags = (!w.file ? `<span class="tag missing">NO FILE</span>` : "") +
                   (errors.has(w.id) ? `<span class="tag error">FAILED TO PLAY</span>` : "");
      const kind = (!w.file ? "" : isVideo(w) ? ("video " + fmtTime(durations[w.id])) : "image") + (w.qr ? (w.file ? " · " : "") + "QR" : "");
      const boxes = SCREENS.map(n => {
        const on = settings.screens[n].selected.includes(w.id);
        return `<td class="s ${n === screen ? "current" : ""}"><input type="checkbox" data-id="${esc(w.id)}" data-screen="${n}" ${on ? "checked" : ""} ${w.file ? "" : "disabled"}></td>`;
      }).join("");
      const n = settings.every[w.id] || w.every || 0;
      const every = `<td class="every"><select data-every="${esc(w.id)}" ${w.file ? "" : "disabled"}>` +
        Array.from({ length: MAX_EVERY + 1 }, (_, i) => i)
          .map(i => `<option value="${i}" ${i === n ? "selected" : ""}>${i === 0 ? `auto (every ${everyOf(w)})` : i === 1 ? "every cycle" : `every ${i} cycles`}</option>`).join("") +
        `</select></td>`;
      return `<tr class="${w.file ? "" : "disabled"}">
        <td class="thumb">${thumb ? `<img loading="lazy" src="${esc(thumb)}" onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'none'}))">` : `<div class="none"></div>`}</td>
        <td><div class="name">${esc(w.artist)}${playing ? `<span class="playing">● PLAYING</span>` : ""}${tags}</div>
            <div class="sub">${esc(w.title || "—")}${w.location ? " · " + esc(w.location) : ""}</div>
            <div class="meta">${kind}</div></td><td><input aria-label="Display seconds for ${esc(w.artist)} (0 = full video)" type="number" min="0" max="86400" step="1" style="width:75px" data-duration="${esc(w.id)}" value="${policy.duration(w, settings, cfg())}" ${w.file ? "" : "disabled"}></td>${every}${boxes}</tr>`;
    };

    $("table").innerHTML = WORKS.map(row).join("");

    $("table-foot").innerHTML = `<td></td><td>Selected · average cycle length</td><td></td><td></td>` + SCREENS.map(n => {
      const c = settings.screens[n];
      const sel = WORKS.filter(w => c.selected.includes(w.id) && w.file);
      const total = sel.reduce((t, w) => t + estDuration(w, c) / everyOf(w), 0);
      return `<td class="s ${n === screen ? "current" : ""}">${sel.length}<br>${fmtTime(total)}</td>`;
    }).join("");

    const c = cfg();
    $("settings-title").textContent = `Screen ${screen} settings`;
    // don't overwrite a field that's being typed into
    if (document.activeElement !== $("s-image")) $("s-image").value = c.imageDuration;
    $("s-shuffle").checked = !!c.shuffle;
    $("s-sound").checked = audioScreen(screen) && !!c.sound;
    $("s-sound").disabled = !audioScreen(screen);
    $("s-sound").title = `Audio is scheduled between Screens 1 and ${SOUND_SCREEN}`;
    $("s-caption").checked = !!c.caption;
    $("s-qr").checked = !!c.qr;
    $("s-rotation").value = String(c.rotation || 0);
    $("load-file").disabled = !window.SETTINGS;
    renderNow();
    renderSourceStatus();
  }

  function renderNow() {
    const el = $("now-text");
    if (!el) return;
    if (!current) { el.innerHTML = `<small>Nothing playing</small>`; return; }
    el.innerHTML = `<b>${esc(current.artist)}</b> — ${esc(current.title || "")} <small>(${index + 1}/${playlist.length} · cycle ${cycle + 1})</small>`;
  }

  function renderSourceStatus() {
    const t = { local: "Using the layout saved on this device.", file: "Using the layout from settings.js.", default: "Using the default assignment." };
    $("source-status").textContent = t[source] || "";
  }

  // video durations are measured one by one for the panel
  let measuring = false;
  function measureDurations() {
    if (measuring) return;
    const pending = WORKS.filter(w => w.file && isVideo(w) && !(w.id in durations));
    if (!pending.length) return;
    measuring = true;
    const v = document.createElement("video");
    v.preload = "metadata"; v.muted = true;
    let i = 0;
    const next = () => {
      if (i >= pending.length) { measuring = false; v.removeAttribute("src"); v.load(); renderPanel(); return; }
      const w = pending[i++];
      v.onloadedmetadata = () => { durations[w.id] = v.duration; next(); };
      v.onerror = () => { durations[w.id] = NaN; next(); };
      v.src = w.file;
    };
    next();
  }

  // ---------- events ----------
  panel.addEventListener("change", ev => {
    const t = ev.target;
    if (t.matches("input[data-duration]")) {
      settings.duration[t.dataset.duration] = Math.max(0, Math.min(86400, Number(t.value) || 0));
      save(); refreshPlaylist(true); renderPanel(); return;
    }
    if (t.matches("#table select[data-every]")) {
      settings.every[t.dataset.every] = Number(t.value);
      save();
      refreshPlaylist(false);
      renderPanel();
      return;
    }
    if (t.matches("#table input[type=checkbox]")) {
      const n = Number(t.dataset.screen), id = t.dataset.id;
      if (t.checked) for (const other of SCREENS) {
        settings.screens[other].selected = settings.screens[other].selected.filter(x => x !== id);
      }
      const sel = new Set(settings.screens[n].selected);
      t.checked ? sel.add(id) : sel.delete(id);
      settings.screens[n].selected = WORKS.map(w => w.id).filter(x => sel.has(x));
      save();
      refreshPlaylist(false);
      renderPanel();
      return;
    }
    const c = cfg();
    if (t.id === "s-image") c.imageDuration = Math.max(3, Number(t.value) || 60);
    else if (t.id === "s-shuffle") { c.shuffle = t.checked; save(); refreshPlaylist(false); renderPanel(); return; }
    else if (t.id === "s-sound") c.sound = audioScreen(screen) && t.checked;
    else if (t.id === "s-caption") c.caption = t.checked;
    else if (t.id === "s-qr") c.qr = t.checked;
    else if (t.id === "s-rotation") c.rotation = Number(t.value);
    else return;
    save();
    applyView();
    renderPanel();
  });

  panel.addEventListener("click", ev => {
    const b = ev.target.closest("button");
    if (!b) return;
    if (b.dataset.screen) return switchScreen(Number(b.dataset.screen));
    switch (b.id) {
      case "close": return closePanel();
      case "prev": return advance(-1);
      case "next": return advance(1);
      case "fullscreen": return toggleFullscreen();
      case "export": return exportSettings();
      case "load-file":
        if (!window.SETTINGS || !confirm("Discard the changes on this device and load the layout from settings.js?")) return;
        try { localStorage.removeItem(STORE); } catch (_) {}
        settings = normalize(structuredClone(window.SETTINGS)); source = "file";
        applyView(); refreshPlaylist(true); renderPanel(); return;
      case "reset":
        if (!confirm("Reset all screens to the default assignment?")) return;
        settings = defaultSettings(); save();
        applyView(); refreshPlaylist(true); renderPanel(); return;
    }
  });

  function exportSettings() {
    const body = "// Exhibition layout — put this file next to index.html.\n" +
      "// " + new Date().toISOString() + "\n" +
      "window.SETTINGS = " + JSON.stringify(settings, null, 2) + ";\n";
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([body], { type: "text/javascript" }));
    a.download = "settings.js";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  function toggleFullscreen() {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen().catch(() => {});
  }

  $("settings-btn").addEventListener("click", openPanel);
  $("stage").addEventListener("dblclick", () => panelOpen() ? closePanel() : openPanel());

  document.addEventListener("keydown", ev => {
    if (ev.target.matches("input[type=number], select")) return;
    const k = ev.key.toLowerCase();
    if (k === "p" || k === "m") { panelOpen() ? closePanel() : openPanel(); }
    else if (k === "escape") closePanel();
    else if (k === "arrowright") advance(1);
    else if (k === "arrowleft") advance(-1);
    else if (k === "f") toggleFullscreen();
    else if (["1", "2", "3", "4"].includes(k) && panelOpen()) switchScreen(Number(k));
  });

  // Keep settings in sync when two windows on the same device share a browser profile
  window.addEventListener("storage", ev => {
    if (ev.key !== STORE) return;
    const before = JSON.stringify(cfg());
    ({ settings, source } = load());
    applyView();
    if (JSON.stringify(cfg()) !== before) refreshPlaylist(false);
    renderPanel();
  });

  function playbackAllowed() {
    if (current?.id === audioSchedule.workId) return screen === audioSchedule.portraitScreen && audioSchedule.portraitActive();
    return screen !== SOUND_SCREEN || audioSchedule.audioRemaining() > 0;
  }
  function soundAllowed() {
    return !!cfg().sound && playbackAllowed() && (screen === SOUND_SCREEN || current?.id === audioSchedule.workId);
  }
  // Guard intervals allow ordinary timer jitter without overlapping sound sources.
  setInterval(() => {
    if (screen === audioSchedule.portraitScreen) {
      if (audioSchedule.portraitActive()) {
        if (current?.id !== audioSchedule.workId) { stop(); show(byId[audioSchedule.workId]); }
      } else if (current?.id === audioSchedule.workId) { stop(); advance(1); }
    }
    if (screen === SOUND_SCREEN) {
      if (current && !playbackAllowed()) { pendingAudio = current; stop(); }
      if (!current && pendingAudio) show(pendingAudio);
    }
    video.muted = !soundAllowed();
  }, 100);

  // ---------- start ----------
  const event = window.EVENT || {};
  $("c-event").textContent = event.title || "";
  $("c-event-sub").textContent = event.subtitle || "";
  if (event.title) document.title = event.title;
  applyView();
  showBadge();
  measureDurations();
  refreshPlaylist(true);
  if (screenUnknown) openPanel();
})();
