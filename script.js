// ---------------------------------------------------------
// Ranking SDR — Multiluz Solar
// Edite data.json para atualizar as pontuações diariamente.
// ---------------------------------------------------------

const AVATARS = {
  // baixinha: personagem menor, pé na ponta pra "alcançar" — anima com um pulinho
  baixinha: `
<svg viewBox="0 0 100 100" class="anim-baixinha">
  <circle cx="50" cy="38" r="20" fill="#f3b28c"/>
  <path d="M30 30 Q50 8 70 30 Q70 18 50 14 Q30 18 30 30Z" fill="#3a2317"/>
  <circle cx="42" cy="38" r="2.6" fill="#20140c"/>
  <circle cx="58" cy="38" r="2.6" fill="#20140c"/>
  <path d="M42 48 Q50 53 58 48" stroke="#7a3b2e" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  <rect x="34" y="58" width="32" height="30" rx="10" fill="#ff6b5b"/>
  <rect x="40" y="86" width="8" height="10" rx="3" fill="#f3b28c"/>
  <rect x="52" y="86" width="8" height="10" rx="3" fill="#f3b28c"/>
</svg>`,

  // mamãe: personagem com um chocalho de bebê balançando na mão
  mamae: `
<svg viewBox="0 0 100 100" class="anim-mamae">
  <circle cx="46" cy="36" r="19" fill="#c98b5e"/>
  <path d="M27 32 Q46 6 65 32 Q65 20 46 16 Q27 20 27 32Z" fill="#241512"/>
  <circle cx="40" cy="36" r="2.4" fill="#1c1008"/>
  <circle cx="54" cy="36" r="2.4" fill="#1c1008"/>
  <path d="M39 45 Q46 50 53 45" stroke="#7a3b2e" stroke-width="2.2" fill="none" stroke-linecap="round"/>
  <rect x="30" y="55" width="30" height="28" rx="10" fill="#00d9b5"/>
  <g class="rattle">
    <line x1="63" y1="60" x2="76" y2="48" stroke="#e3a25f" stroke-width="4" stroke-linecap="round"/>
    <circle cx="80" cy="44" r="8" fill="#ffc93c"/>
    <circle cx="80" cy="44" r="3" fill="#7a5b12"/>
  </g>
</svg>`,

  // futebol: personagem chutando, bola voando fora da direção certa
  futebol: `
<svg viewBox="0 0 100 100" class="anim-futebol">
  <circle cx="42" cy="34" r="18" fill="#e0a172"/>
  <path d="M25 28 Q42 6 59 28 Q59 16 42 13 Q25 16 25 28Z" fill="#2b1a10"/>
  <circle cx="36" cy="34" r="2.3" fill="#1c1008"/>
  <circle cx="48" cy="34" r="2.3" fill="#1c1008"/>
  <path d="M35 43 Q42 47 49 43" stroke="#7a3b2e" stroke-width="2" fill="none" stroke-linecap="round"/>
  <rect x="27" y="52" width="30" height="26" rx="9" fill="#2f7ee8"/>
  <path d="M30 78 L20 92" stroke="#e0a172" stroke-width="7" stroke-linecap="round"/>
  <g class="ball">
    <circle cx="74" cy="60" r="9" fill="#f4f7fc"/>
    <path d="M74 53 L79 58 L77 65 L71 65 L69 58Z" fill="#0f2247"/>
  </g>
</svg>`,

  // pescador: chapéu, vara de pescar balançando com peixinho fisgado
  pescador: `
<svg viewBox="0 0 100 100" class="anim-pescador">
  <circle cx="44" cy="40" r="18" fill="#e0a172"/>
  <path d="M22 36 Q30 18 44 18 Q58 18 66 36 Q66 24 44 21 Q22 24 22 36Z" fill="#3a6b3f"/>
  <ellipse cx="44" cy="21" rx="24" ry="4" fill="#3a6b3f"/>
  <circle cx="38" cy="41" r="2.3" fill="#1c1008"/>
  <circle cx="50" cy="41" r="2.3" fill="#1c1008"/>
  <path d="M37 50 Q44 54 51 50" stroke="#7a3b2e" stroke-width="2" fill="none" stroke-linecap="round"/>
  <rect x="29" y="58" width="30" height="26" rx="9" fill="#e3a25f"/>
  <g class="rod-tip">
    <line x1="55" y1="60" x2="82" y2="42" stroke="#8a5a2e" stroke-width="3.4" stroke-linecap="round"/>
    <line x1="82" y1="42" x2="80" y2="66" stroke="#cfd8e6" stroke-width="1.4"/>
    <path d="M75 68 Q80 62 85 68 Q80 74 75 68Z" fill="#35b4f0"/>
  </g>
</svg>`
};

const traitEmoji = {
  baixinha: "📏",
  mamae: "🍼",
  futebol: "⚽",
  pescador: "🎣"
};

async function loadData(){
  const res = await fetch('data.json', { cache: 'no-store' });
  if(!res.ok) throw new Error('Não foi possível carregar data.json');
  return res.json();
}

function animateNumber(el, target, duration = 1100){
  const start = performance.now();
  function tick(now){
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(eased * target);
    if(p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function fireConfetti(canvas){
  const ctx = canvas.getContext('2d');
  const DPR = window.devicePixelRatio || 1;
  function resize(){
    canvas.width = window.innerWidth * DPR;
    canvas.height = window.innerHeight * DPR;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(DPR,0,0,DPR,0,0);
  }
  resize();
  window.addEventListener('resize', resize);

  const colors = ['#ffc93c','#00d9b5','#ff6b5b','#f4f7fc','#2f7ee8'];
  const pieces = Array.from({length: 90}, () => ({
    x: Math.random() * window.innerWidth,
    y: -20 - Math.random() * 200,
    r: 4 + Math.random() * 5,
    vy: 2 + Math.random() * 3,
    vx: -1.5 + Math.random() * 3,
    rot: Math.random() * 360,
    vr: -6 + Math.random() * 12,
    color: colors[Math.floor(Math.random() * colors.length)]
  }));

  let frame = 0;
  const maxFrames = 260;
  function draw(){
    ctx.clearRect(0,0,window.innerWidth, window.innerHeight);
    pieces.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.rot += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot * Math.PI/180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.r/2, -p.r/2, p.r, p.r*0.6);
      ctx.restore();
    });
    frame++;
    if(frame < maxFrames){
      requestAnimationFrame(draw);
    } else {
      ctx.clearRect(0,0,window.innerWidth, window.innerHeight);
    }
  }
  draw();
}

function renderLeader(sdr){
  const el = document.getElementById('leader-spotlight');
  el.innerHTML = `
    <span class="leader-tag">👑 Líder do dia</span>
    <div class="leader-row">
      <div class="leader-avatar-wrap">
        <span class="crown">👑</span>
        ${AVATARS[sdr.avatar]}
      </div>
      <div class="leader-info">
        <h2>${sdr.nome}</h2>
        <span class="trait-chip">${traitEmoji[sdr.avatar] || '✨'} ${sdr.traco}</span>
        <div class="leader-score">
          <span class="num" id="leader-num">0</span>
          <span class="label">agendamentos</span>
        </div>
      </div>
    </div>
  `;
  animateNumber(document.getElementById('leader-num'), sdr.agendamentos, 1300);
}

function renderBoard(sdrs){
  const board = document.getElementById('board');
  const max = sdrs[0].agendamentos;
  board.innerHTML = sdrs.map((sdr, i) => {
    const rank = i + 1;
    const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `${rank}º`;
    return `
      <article class="card rank-${rank}" style="animation-delay:${i * 0.12}s">
        <div class="rank-num">${medal}</div>
        <div class="avatar-wrap">${AVATARS[sdr.avatar]}</div>
        <div class="card-info">
          <h3>${sdr.nome}</h3>
          <span class="trait-chip">${traitEmoji[sdr.avatar] || '✨'} ${sdr.traco}</span>
          <div class="bar-track"><div class="bar-fill" data-target="${(sdr.agendamentos/max*100).toFixed(1)}"></div></div>
        </div>
        <div class="card-score">
          <span class="num" data-score="${sdr.agendamentos}">0</span>
          <span class="label">agend.</span>
        </div>
      </article>
    `;
  }).join('');

  // animate bars + numbers after render
  requestAnimationFrame(() => {
    board.querySelectorAll('.bar-fill').forEach(bar => {
      bar.style.width = bar.dataset.target + '%';
    });
    board.querySelectorAll('.card-score .num').forEach(num => {
      animateNumber(num, parseInt(num.dataset.score, 10));
    });
  });
}

function formatDate(iso){
  try{
    const d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  }catch(e){ return iso; }
}

async function init(){
  try{
    const data = await loadData();
    const sorted = [...data.sdrs].sort((a,b) => b.agendamentos - a.agendamentos);

    document.getElementById('updated-label').textContent =
      `Central de Agendamentos • atualizado em ${formatDate(data.atualizadoEm)}`;

    const total = sorted.reduce((sum, s) => sum + s.agendamentos, 0);
    document.getElementById('round-count').textContent = `${total} agendamentos no total`;

    renderLeader(sorted[0]);
    renderBoard(sorted);

    fireConfetti(document.getElementById('confetti-canvas'));
  }catch(err){
    document.getElementById('board').innerHTML =
      `<p style="color:#ff6b5b">Não foi possível carregar o ranking. Verifique se data.json está no mesmo diretório e é um JSON válido.</p>`;
    console.error(err);
  }
}

init();
