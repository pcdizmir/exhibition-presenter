// Fixed text at the bottom right of every screen
window.EVENT = {
  title: "Processing Community Day İzmir 2026",
  subtitle: "Exhibition",
};

// List of works. Edit captions here.
// file:   a file in media/ (produced by prepare.sh). null = file not received yet.
// listed: false = files found in the folder that are not on the open call list
//         (shown separately in the panel, not assigned to any screen by default).
window.WORKS = [
  { id: "cem-sonel",            artist: "Cem Sonel",            title: "",                                  location: "",            file: null },
  { id: "raphael-de-courville", artist: "Raphaël de Courville", title: "",                                  location: "",            file: "media/raphael-de-courville.mp4" },
  { id: "agoston-nagy",         artist: "Agoston Nagy",         title: "Semantic Noise",                    location: "Budapest",    file: "media/agoston-nagy-semantic-noise.mp4" },
  { id: "aluan-wang",           artist: "Aluan Wang",           title: "inkField",                          location: "Taipei",      file: "media/aluan-wang-inkfield.mp4" },
  { id: "anna-carreras",        artist: "Anna Carreras",        title: "Idoni",                             location: "Barcelona",   file: "media/anna-carreras-idoni.mp4" },
  { id: "bedirhan-ugur",        artist: "Bedirhan Uğur",        title: "Altered State of Line",             location: "Bursa",       file: "media/bedirhan-ugur-altered-state-of-line.mp4" },
  { id: "camille-roux",         artist: "Camille Roux",         title: "Résilience — Out of Band #2",       location: "Montpellier", file: "media/camille-roux-resilience.mp4" },
  { id: "gorilla-sun-rd",       artist: "Gorilla Sun",          title: "Reaction Diffusion Explorer",       location: "",            file: "media/gorilla-sun-reaction-diffusion-explorer.mp4" },
  { id: "dist-collective",      artist: "Dist Collective",      title: "Stratum",                           location: "",            file: "media/dist-collective-stratum.jpg" },
  { id: "oguz-tunc-ulgen",      artist: "Oğuz Tunç Ülgen",      title: "Monolith",                          location: "İzmir",       file: "media/oguz-tunc-ulgen-monolith.jpg" },
  { id: "nubplus",              artist: "NubPlus",              title: "Glass shattered, but I still see",  location: "Libertalia",  file: null },
  { id: "sonic-chimes",         artist: "Sonic Chimes",         title: "Nihavend",                          location: "İzmir",       file: "media/sonic-chimes-nihavend.mp4" },
  { id: "rob-scalera",          artist: "Rob Scalera",          title: "Underlayer",                        location: "İstanbul",    file: "media/rob-scalera-underlayer.jpg" },
  { id: "deniz-kucukcan",       artist: "Deniz Küçükcan",       title: "chet",                              location: "İzmir",       file: "media/deniz-kucukcan-chet.mp4" },
  { id: "loackme",              artist: "Loackme",              title: "stranded(ness)",                    location: "Amsterdam",   file: "media/loackme-strandedness.mp4" },
  { id: "gorilla-sun-parts",    artist: "Gorilla Sun",          title: "Some Parts of Me",                  location: "",            file: "media/gorilla-sun-some-parts-of-me.jpg" },
  { id: "pastelhope",           artist: "pastelhope",           title: "I think I'm going blind",           location: "İzmir",       file: "media/pastelhope-i-think-im-going-blind.mp4" },
  { id: "ac-futures",           artist: "AC Futures",           title: "Feelings",                          location: "İzmir",       file: "media/ac-futures-feelings.mp4" },

  // — in the folder but not on the list —
  { id: "x-julien-gachadoat",   artist: "Julien Gachadoat",     title: "Binary Drift",                      location: "", file: "media/x-julien-gachadoat-binary-drift.mp4", listed: false },
  { id: "x-berkin-dundar",      artist: "Berkin Dündar",        title: "Memento Loop",                      location: "", file: "media/x-berkin-dundar-memento-loop.mp4", listed: false },
  { id: "x-gozde-damla-turhan", artist: "Gözde Damla Turhan",   title: "Traces of Intervention",            location: "", file: "media/x-gozde-damla-turhan-traces-of-intervention.mp4", listed: false },
  { id: "x-ruveyda",            artist: "Ruveyda",              title: "Sealed Lips",                       location: "", file: "media/x-ruveyda-sealed-lips.mp4", listed: false },
  { id: "x-ali-osman-bayram",   artist: "Ali Osman Bayram",     title: "",                                  location: "", file: "media/x-ali-osman-bayram.mp4", listed: false },
  { id: "x-murat-atimtay",      artist: "Murat Atimtay",        title: "Metropolis",                        location: "", file: "media/x-murat-atimtay-metropolis.jpg", listed: false },
  { id: "x-sadik-aksu",         artist: "Sadık Aksu",           title: "Moducon",                           location: "", file: "media/x-sadik-aksu-moducon.jpg", listed: false },
  { id: "x-buse",               artist: "Buse",                 title: "",                                  location: "", file: "media/x-buse-poster.jpg", listed: false },
  { id: "x-onat-saygi",         artist: "Onat Saygı",           title: "",                                  location: "", file: "media/x-onat-saygi.jpg", listed: false },
];

// Screens start with this assignment when no settings have been saved
// (total loop lengths and portrait/landscape works roughly balanced).
window.DEFAULT_ASSIGNMENT = {
  1: ["loackme", "agoston-nagy", "dist-collective", "deniz-kucukcan"],
  2: ["raphael-de-courville", "camille-roux", "oguz-tunc-ulgen", "bedirhan-ugur"],
  3: ["sonic-chimes", "ac-futures", "gorilla-sun-rd", "rob-scalera"],
  4: ["pastelhope", "aluan-wang", "anna-carreras", "gorilla-sun-parts"],
};
