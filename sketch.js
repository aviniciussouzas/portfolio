
// ─────────────────────────────────────────────
// TYPO CANVAS — sincronizado com _globalPx
// ─────────────────────────────────────────────
(function () {
  const TEXT = "talvez a vantagem humana passe a ser justamente criar ideias um pouco estranhas, imperfeitas ou culturalmente específicas demais para um modelo prever.";
  const BLUE  = '#1818ff';
  const WHITE = '#ffffff';

  const canvas = document.getElementById('typo-canvas');
  const ctx    = canvas.getContext('2d');

  // Off-screen canvas: texto crisp a resolução nativa
  const off  = document.createElement('canvas');
  const octx = off.getContext('2d');

  let lines  = [];
  let offW   = 0, offH = 0;
  let fs     = 0, lh   = 0;
  const PAD  = () => Math.round(window.innerWidth * 0.055);

  function measure() {
    fs = Math.round(window.innerWidth * 0.048);
    lh = Math.round(fs * 1.35);
    const pad   = PAD();
    const maxW  = window.innerWidth - pad * 2;

    octx.font = `700 ${fs}px "Courier New", monospace`;

    const words = TEXT.split(' ');
    lines = [];
    let cur = '';
    for (const w of words) {
      const test = cur ? cur + ' ' + w : w;
      if (octx.measureText(test).width > maxW && cur) {
        lines.push(cur);
        cur = w;
      } else {
        cur = test;
      }
    }
    if (cur) lines.push(cur);
  }

  function buildOff() {
    measure();
    const pad  = PAD();
    offW = window.innerWidth;
    offH = lines.length * lh + pad * 2;

    off.width  = offW;
    off.height = offH;

    // Blue bg
    octx.fillStyle = BLUE;
    octx.fillRect(0, 0, offW, offH);

    // White text
    octx.font         = `700 ${fs}px "Courier New", monospace`;
    octx.fillStyle    = WHITE;
    octx.textBaseline = 'top';
    lines.forEach((line, i) => {
      octx.fillText(line, pad, pad + i * lh);
    });

    // Size display canvas
    canvas.width  = offW;
    canvas.height = offH;
    canvas.style.width  = offW + 'px';
    canvas.style.height = offH + 'px';
  }

  function draw() {
    requestAnimationFrame(draw);
    if (!offW || !offH) return;

    const rawPx = window._globalPx || 1;
    const ps    = Math.max(1, Math.round(rawPx));

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (ps <= 1) {
      // Full res — direto
      ctx.drawImage(off, 0, 0);
      return;
    }

    // Pixelated — mesma lógica da imagem
    const idata = octx.getImageData(0, 0, offW, offH);
    const d     = idata.data;

    const cols = Math.ceil(offW / ps);
    const rows = Math.ceil(offH / ps);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const sx = Math.min(Math.floor(c * ps + ps * 0.5), offW - 1);
        const sy = Math.min(Math.floor(r * ps + ps * 0.5), offH - 1);
        const i  = (sy * offW + sx) * 4;
        ctx.fillStyle = `rgba(${d[i]},${d[i+1]},${d[i+2]},${d[i+3]/255})`;
        ctx.fillRect(c * ps, r * ps, ps, ps);
      }
    }
  }

  buildOff();
  draw();
  window.addEventListener('resize', buildOff);
})();
</script>
</body>
</html>