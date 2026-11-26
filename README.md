# cartoon3d-render-test

Uji render paralel GitHub Actions untuk skill `cartoon-3d-short`
(github.com/mromidev/claude-animated-shorts, MIT): komposisi Remotion
three.js "BridgeShort" 720x1280, 2.025 frame, dipecah 10 segmen ke
10 runner serentak (cabang `seg-0` s.d. `seg-9`, satu berkas mp4 per cabang).

Render lokal di VM Muse terukur 0,055 fps (±10 jam penuh); repo ini
menguji jalur render paralel sebagai pembanding.
