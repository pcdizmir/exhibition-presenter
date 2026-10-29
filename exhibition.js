// Fixed text at the bottom right of every screen
window.EVENT = {
  title: "Processing Community Day İzmir 2026",
  subtitle: "Exhibition",
};

// Main audio screen; Semantic Noise has a reserved audio window on portrait Screen 1.
window.SOUND_SCREEN = 2;
// A new layout revision starts fresh instead of loading obsolete browser assignments.
window.LAYOUT_REVISION = "portrait-semantic-reserved-audio-v4";
// Every artwork has exactly one owner across the four screens.
window.DEFAULT_ASSIGNMENT = {
  "1": [
    "camille-roux",
    "dist-collective",
    "oguz-tunc-ulgen",
    "deniz-kucukcan",
    "julien-gachadoat",
    "ruveyda",
    "agoston-nagy"
  ],
  "2": [
    "aluan-wang",
    "sonic-chimes",
    "pastelhope",
    "ac-futures",
    "project-nom",
    "buse"
  ],
  "3": [
    "loackme",
    "rob-scalera",
    "gorilla-sun-parts",
    "murat-atimtay",
    "pawel-dudko",
    "bedirhan-ugur"
  ],
  "4": [
    "raphael-de-courville",
    "anna-carreras",
    "nubplus",
    "berkin-dundar",
    "gozde-damla-turhan",
    "onat-saygi",
    "sadik-aksu"
  ]
};
// Physical orientation; configure portrait in the OS, or use panel rotation if needed.
window.SCREEN_ORIENTATIONS = { 1: "portrait", 2: "landscape", 3: "portrait", 4: "landscape" };
