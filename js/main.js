// Relógio real (São Paulo) — pequeno detalhe editorial, mas de verdade, não estático
function updateClock() {
  const el = document.getElementById('nav-time');
  if (!el) return;
  const now = new Date().toLocaleTimeString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    hour: '2-digit',
    minute: '2-digit',
  });
  el.textContent = now;
}
updateClock();
setInterval(updateClock, 1000 * 30);
