const CHARS = ' .\'`^",:;Il!i><~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$';
const vid   = document.getElementById('vid');
const cnv   = document.getElementById('cnv');
const out   = document.getElementById('asciiOut');
const hint  = document.getElementById('pauseHint');
const ctx   = cnv.getContext('2d', { willReadFrequently: true });
let animId  = null;

function startRender() {
  cancelAnimationFrame(animId);
  function loop() {
    if (!vid.paused && !vid.ended) {
      const cols   = Math.floor(window.innerWidth / 5.5);
      const aspect = vid.videoHeight / vid.videoWidth;
      const rows   = Math.floor(cols * aspect * 0.42);
      cnv.width = cols; cnv.height = rows;
      ctx.drawImage(vid, 0, 0, cols, rows);
      const data = ctx.getImageData(0, 0, cols, rows).data;
      let txt = '';
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i  = (y * cols + x) * 4;
          const br = (0.299*data[i] + 0.587*data[i+1] + 0.114*data[i+2]) / 255;
          txt += CHARS[Math.floor(br * (CHARS.length - 1))] || ' ';
        }
        txt += '\n';
      }
      out.textContent = txt;
    }
    animId = requestAnimationFrame(loop);
  }
  loop();
}

function loadSrc(src) {
  vid.src = src;
  vid.volume = 0.04;
  vid.load();
  vid.oncanplay = () => { vid.play(); startRender(); };
}

loadSrc('https://file.garden/abFLf7yYMGYIwx9m/bad-apple.mp4');

document.addEventListener('click', () => {
  if (vid.paused) {
    vid.play();
    hint.classList.remove('show');
  } else {
    vid.pause();
    hint.classList.add('show');
  }
});

document.addEventListener('dragenter', e => { e.preventDefault(); document.body.classList.add('dragging'); });
document.addEventListener('dragover',  e => { e.preventDefault(); });
document.addEventListener('dragleave', e => { if (!e.relatedTarget) document.body.classList.remove('dragging'); });
document.addEventListener('drop', e => {
  e.preventDefault();
  document.body.classList.remove('dragging');
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('video/')) loadSrc(URL.createObjectURL(file));
});
