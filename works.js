// List of works. Edit captions here.
// file:   a file in media/ (produced by prepare.sh). null = file not received yet.
// qr:     QR code (qr/*.svg) linking to the work's page on the PCD İzmir site, shown next to the caption.
// every:  (optional) default for the panel's Plays column: play once every N cycles (e.g. every: 3).
// duration: optional display seconds; 0 = full video. Default is the screen duration (60 s).
window.WORKS = [
  { id: "raphael-de-courville", artist: "Raphaël de Courville", title: "Aesthoplasm",                       location: "France/Berlin",            file: "media/raphael-de-courville.mp4", qr: "qr/raphael-de-courville.svg", duration: 0, every: 4 },
  { id: "agoston-nagy",         artist: "Agoston Nagy",         title: "Semantic Noise",                    location: "Budapest",    file: "media/agoston-nagy-semantic-noise.mp4", qr: "qr/semantic-noise.svg" },
  { id: "aluan-wang",           artist: "Aluan Wang",           title: "inkField",                          location: "Taipei",      file: "media/aluan-wang-inkfield.mp4", qr: "qr/inkfield.svg", duration: 0, every: 2 },
  { id: "anna-carreras",        artist: "Anna Carreras",        title: "Idoni",                             location: "Barcelona",   file: "media/anna-carreras-idoni.mp4", qr: "qr/idoni.svg" },
  { id: "bedirhan-ugur",        artist: "Bedirhan Uğur",        title: "Altered State of Line",             location: "Bursa",       file: "media/bedirhan-ugur-altered-state-of-line.mp4", qr: "qr/altered-state-of-line.svg" },
  { id: "camille-roux",         artist: "Camille Roux",         title: "Résilience — Out of Band #2",       location: "Montpellier", file: "media/camille-roux-resilience.mp4", qr: "qr/resilience-out-of-band-2.svg", duration: 0, every: 2 },
  { id: "dist-collective",      artist: "Dist Collective",      title: "Stratum",                           location: "Valencia",    file: "media/dist-collective-stratum.jpg", qr: "qr/stratum.svg" },
  { id: "oguz-tunc-ulgen",      artist: "Oğuz Tunç Ülgen",      title: "Monolith",                          location: "İzmir",       file: "media/oguz-tunc-ulgen-monolith.jpg", qr: "qr/monolith.svg" },
  { id: "nubplus",              artist: "NubPlus",              title: "Glass shattered, but I still see",  location: "Libertalia",  file: "media/x-ali-osman-bayram.mp4", qr: "qr/glass-shattered-but-i-still-see.svg" },
  { id: "sonic-chimes",         artist: "Sonic Chimes",         title: "Nihavend",                          location: "İzmir",       file: "media/sonic-chimes-nihavend.mp4", qr: "qr/nihavend.svg", duration: 0, every: 4 },
  { id: "rob-scalera",          artist: "Rob Scalera",          title: "Underlayer",                        location: "İstanbul",    file: "media/rob-scalera-underlayer.jpg", qr: "qr/underlayer.svg" },
  { id: "deniz-kucukcan",       artist: "Deniz Küçükcan",       title: "chet",                              location: "İzmir",       file: "media/deniz-kucukcan-chet.mp4", qr: "qr/chet.svg" },
  { id: "loackme",              artist: "Loackme",              title: "stranded(ness)",                    location: "Amsterdam",   file: "media/loackme-strandedness.mp4", qr: "qr/stranded-ness.svg", duration: 0, every: 6 },
  { id: "gorilla-sun-parts",    artist: "Gorilla Sun",          title: "Some Parts of Me",                  location: "Düsseldorf",  file: "media/gorilla-sun-some-parts-of-me.jpg", qr: "qr/some-parts-of-me.svg" },
  { id: "pastelhope",           artist: "pastelhope",           title: "I think I'm going blind",           location: "İzmir",       file: "media/pastelhope-i-think-im-going-blind.mp4", qr: "qr/i-think-i-m-going-blind.svg", duration: 0, every: 3 },
  { id: "ac-futures",           artist: "AC Futures",           title: "Feelings",                          location: "İzmir",       file: "media/ac-futures-feelings.mp4", qr: "qr/feelings.svg", duration: 0, every: 2 },
  { id: "project-nom", artist: "Yusuf Samet /Şeyma Gül Aydın", title: "Algorithmic VFX", location: "İstanbul", file: "media/x-project-nom.mp4", qr: "qr/son-of-aladdin.svg", duration: 0, every: 2 },
  { id: "julien-gachadoat",   artist: "Julien Gachadoat",     title: "Binary drift",     location: "Bordeaux", file: "media/x-julien-gachadoat-binary-drift.mp4", qr: "qr/binary-drift.svg" },
  { id: "berkin-dundar",      artist: "Berkin Dündar",        title: "Memento",          location: "İzmir", file: "media/x-berkin-dundar-memento-loop.mp4", qr: "qr/memento.svg" },
  { id: "gozde-damla-turhan", artist: "Gözde Damla Turhan",   title: "Traces of Intervention",     location: "İzmir", file: "media/x-gozde-damla-turhan-traces-of-intervention.mp4", qr: "qr/traces-of-intervention.svg", duration: 0, every: 2 },
  { id: "ruveyda",            artist: "Rüveyda Cengiz",       title: "Sealed Lips, Echo Chamber: Unsaid. Undone",  location: "İzmir", file: "media/x-ruveyda-sealed-lips.jpg", qr: "qr/sealed-lips-echo-chamber-unsaid-undone.svg" },
  { id: "murat-atimtay",      artist: "Murat Atimtay",        title: "Metropolis IX",                        location: "İzmir", file: "media/x-murat-atimtay-metropolis.jpg", qr: "qr/metropolis-ix.svg" },
  { id: "sadik-aksu",         artist: "Sadık Aksu",           title: "Moducon",                           location: "İzmir", file: "media/x-sadik-aksu-moducon.jpg", qr: "qr/moducon.svg" },
  { id: "buse",               artist: "Buse Anıl",             title: "Unravel",                                  location: "İzmir", file: "media/x-buse-unravel.mp4", qr: "qr/unravel.svg", duration: 0, every: 2 },
  { id: "onat-saygi",         artist: "Onat Saygı",           title: "Thyme Flows",                                  location: "İzmir", file: "media/x-onat-saygi-thyme-flows.jpg", qr: "qr/thyme-flows.svg" },
  { id: "pawel-dudko",        artist: "Paweł Dudko",          title: "Noema",                             location: "Poland/Georgia", file: "media/x-pawel-dudko-noema.mp4", qr: "qr/noema.svg" },
];
