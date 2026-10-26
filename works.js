// Fixed text at the bottom right of every screen
window.EVENT = {
  title: "Processing Community Day İzmir 2026",
  subtitle: "Exhibition",
};

// List of works. Edit captions here.
// file:   a file in media/ (produced by prepare.sh). null = file not received yet.
// qr:     QR code (qr/*.svg) linking to the work's page on the PCD İzmir site, shown next to the caption.
// every:  (optional) default for the panel's Plays column: play once every N cycles (e.g. every: 3).
// listed: false = files found in the folder that are not on the open call list
//         (shown separately in the panel, not assigned to any screen by default).
window.WORKS = [
  { id: "cem-sonel",            artist: "Cem Sonel",            title: "",                                  location: "",            file: null },
  { id: "raphael-de-courville", artist: "Raphaël de Courville", title: "",                                  location: "",            file: "media/raphael-de-courville.mp4", qr: "qr/raphael-de-courville.svg" },
  { id: "agoston-nagy",         artist: "Agoston Nagy",         title: "Semantic Noise",                    location: "Budapest",    file: "media/agoston-nagy-semantic-noise.mp4", qr: "qr/semantic-noise.svg" },
  { id: "aluan-wang",           artist: "Aluan Wang",           title: "inkField",                          location: "Taipei",      file: "media/aluan-wang-inkfield.mp4", qr: "qr/inkfield.svg" },
  { id: "anna-carreras",        artist: "Anna Carreras",        title: "Idoni",                             location: "Barcelona",   file: "media/anna-carreras-idoni.mp4", qr: "qr/idoni.svg" },
  { id: "bedirhan-ugur",        artist: "Bedirhan Uğur",        title: "Altered State of Line",             location: "Bursa",       file: "media/bedirhan-ugur-altered-state-of-line.mp4", qr: "qr/altered-state-of-line.svg" },
  { id: "camille-roux",         artist: "Camille Roux",         title: "Résilience — Out of Band #2",       location: "Montpellier", file: "media/camille-roux-resilience.mp4", qr: "qr/resilience-out-of-band-2.svg" },
  { id: "gorilla-sun-rd",       artist: "Gorilla Sun",          title: "Reaction Diffusion Explorer",       location: "",            file: null },
  { id: "dist-collective",      artist: "Dist Collective",      title: "Stratum",                           location: "",            file: "media/dist-collective-stratum.jpg", qr: "qr/stratum.svg" },
  { id: "oguz-tunc-ulgen",      artist: "Oğuz Tunç Ülgen",      title: "Monolith",                          location: "İzmir",       file: "media/oguz-tunc-ulgen-monolith.jpg", qr: "qr/monolith.svg" },
  { id: "nubplus",              artist: "NubPlus",              title: "Glass shattered, but I still see",  location: "Libertalia",  file: null, qr: "qr/glass-shattered-but-i-still-see.svg" },
  { id: "sonic-chimes",         artist: "Sonic Chimes",         title: "Nihavend",                          location: "İzmir",       file: "media/sonic-chimes-nihavend.mp4", qr: "qr/nihavend.svg" },
  { id: "rob-scalera",          artist: "Rob Scalera",          title: "Underlayer",                        location: "İstanbul",    file: "media/rob-scalera-underlayer.jpg", qr: "qr/underlayer.svg" },
  { id: "deniz-kucukcan",       artist: "Deniz Küçükcan",       title: "chet",                              location: "İzmir",       file: "media/deniz-kucukcan-chet.mp4", qr: "qr/chet.svg" },
  { id: "loackme",              artist: "Loackme",              title: "stranded(ness)",                    location: "Amsterdam",   file: "media/loackme-strandedness.mp4", qr: "qr/stranded-ness.svg" },
  { id: "gorilla-sun-parts",    artist: "Gorilla Sun",          title: "Some Parts of Me",                  location: "",            file: "media/gorilla-sun-some-parts-of-me.jpg", qr: "qr/some-parts-of-me.svg" },
  { id: "pastelhope",           artist: "pastelhope",           title: "I think I'm going blind",           location: "İzmir",       file: "media/pastelhope-i-think-im-going-blind.mp4", qr: "qr/i-think-i-m-going-blind.svg" },
  { id: "ac-futures",           artist: "AC Futures",           title: "Feelings",                          location: "İzmir",       file: "media/ac-futures-feelings.mp4", qr: "qr/feelings.svg" },

  // — in the folder but not on the list —
  { id: "x-julien-gachadoat",   artist: "Julien Gachadoat",     title: "Binary drift",                      location: "", file: "media/x-julien-gachadoat-binary-drift.mp4", qr: "qr/binary-drift.svg", listed: false },
  { id: "x-berkin-dundar",      artist: "Berkin Dündar",        title: "Memento",                      location: "", file: "media/x-berkin-dundar-memento-loop.mp4", qr: "qr/memento.svg", listed: false },
  { id: "x-gozde-damla-turhan", artist: "Gözde Damla Turhan",   title: "Traces of Intervention",            location: "", file: "media/x-gozde-damla-turhan-traces-of-intervention.mp4", qr: "qr/traces-of-intervention.svg", listed: false },
  { id: "x-ruveyda",            artist: "Rüveyda Cengiz",       title: "Sealed Lips, Echo Chamber: Unsaid. Undone",                       location: "", file: "media/x-ruveyda-sealed-lips.jpg", qr: "qr/sealed-lips-echo-chamber-unsaid-undone.svg", listed: false },
  { id: "x-ali-osman-bayram",   artist: "Ali Osman Bayram",     title: "",                                  location: "", file: "media/x-ali-osman-bayram.mp4", listed: false },
  { id: "x-murat-atimtay",      artist: "Murat Atimtay",        title: "Metropolis IX",                        location: "", file: "media/x-murat-atimtay-metropolis.jpg", qr: "qr/metropolis-ix.svg", listed: false },
  { id: "x-sadik-aksu",         artist: "Sadık Aksu",           title: "Moducon",                           location: "", file: "media/x-sadik-aksu-moducon.jpg", qr: "qr/moducon.svg", listed: false },
  { id: "x-buse",               artist: "Buse Anıl",             title: "Unravel",                                  location: "", file: "media/x-buse-unravel.mp4", qr: "qr/unravel.svg", listed: false },
  { id: "x-onat-saygi",         artist: "Onat Saygı",           title: "Thyme Flows",                                  location: "", file: "media/x-onat-saygi-thyme-flows.jpg", qr: "qr/thyme-flows.svg", listed: false },
  { id: "x-pawel-dudko",        artist: "Paweł Dudko",          title: "Noema",                             location: "", file: "media/x-pawel-dudko-noema.mp4", qr: "qr/noema.svg", listed: false },
];

// Screens start with this assignment when no settings have been saved
// (total loop lengths and portrait/landscape works roughly balanced).
window.DEFAULT_ASSIGNMENT = {
  1: ["loackme", "agoston-nagy", "dist-collective", "deniz-kucukcan"],
  2: ["raphael-de-courville", "camille-roux", "oguz-tunc-ulgen", "bedirhan-ugur"],
  3: ["sonic-chimes", "ac-futures", "rob-scalera"],
  4: ["pastelhope", "aluan-wang", "anna-carreras", "gorilla-sun-parts"],
};
