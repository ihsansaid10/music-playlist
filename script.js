// ── STATE ──
let playlist = [];
let index = 0;
let shuffle = false;
let repeat = false;
let liked = new Set();
let isPlaying = false;

// ── ELEMENTS ──
const audio         = document.getElementById("audio");
const playBtn       = document.getElementById("playBtn");
const playIcon      = document.getElementById("playIcon");
const playMainBtn   = document.getElementById("playMainBtn");
const playMainIcon  = document.getElementById("playMainIcon");
const nextBtn       = document.getElementById("nextBtn");
const prevBtn       = document.getElementById("prevBtn");
const shuffleBtn    = document.getElementById("shuffleBtn");
const repeatBtn     = document.getElementById("repeatBtn");
const downloadBtn   = document.getElementById("downloadBtn");
const progressBar   = document.getElementById("progressBar");
const progressFill  = document.getElementById("progressFill");
const trackTitle    = document.getElementById("trackTitle");
const trackArtist   = document.getElementById("trackArtist");
const trackEmoji    = document.getElementById("trackEmoji");
const currentTimeEl = document.getElementById("currentTime");
const durationEl    = document.getElementById("duration");
const volumeSlider  = document.getElementById("volumeSlider");
const volFill       = document.getElementById("volFill");
const songTable     = document.getElementById("songTable");
const likeBtn       = document.getElementById("likeBtn");
const badgeIcon     = document.getElementById("badgeIcon");
const badgeText     = document.getElementById("badgeText");
const eqBars        = document.getElementById("eqBars");
const heroGradient  = document.getElementById("heroGradient");
const coverGlow     = document.getElementById("coverGlow");
const statCount     = document.getElementById("statCount");

// ── HELPERS ──
function splitTitle(fullTitle) {
  const dash = fullTitle.indexOf(" - ");
  if (dash !== -1) return { artist: fullTitle.slice(0, dash), title: fullTitle.slice(dash + 3) };
  return { artist: "Unknown Artist", title: fullTitle };
}
function format(t) {
  if (isNaN(t) || t == null) return "0:00";
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}
function hexToRgb(hex) {
  return `${parseInt(hex.slice(1,3),16)},${parseInt(hex.slice(3,5),16)},${parseInt(hex.slice(5,7),16)}`;
}

// ── LOAD playlist.json ──
fetch("playlist.json")
  .then(r => r.json())
  .then(data => {
    playlist = data;
    if (statCount) statCount.textContent = playlist.length;
    const statsEl = document.querySelector(".playlist-stats");
    if (statsEl) statsEl.innerHTML = `<span class="dot-green"></span> Ihsan &nbsp;&middot;&nbsp; ${playlist.length} songs`;
    loadTrack(index);
    renderTable();
    init3D();
    animate3D();
  })
  .catch(() => {
    if (songTable) songTable.innerHTML = `<tr><td colspan="4" style="text-align:center;color:#f87171;padding:32px;font-size:14px">
      ❌ Gagal load <strong>playlist.json</strong><br><small style="color:#94a3b8">Pastikan file ada di folder yang sama dengan index.html</small>
    </td></tr>`;
  });

// ── LOAD TRACK ──
function loadTrack(i) {
  if (!playlist.length) return;
  const song = playlist[i];
  const info = splitTitle(song.title);
  const em   = song.emoji || "🎵";
  const col  = song.color || "#a78bfa";

  audio.src               = song.src;
  trackTitle.textContent  = info.title;
  trackArtist.textContent = info.artist;
  trackEmoji.textContent  = em;
  badgeIcon.textContent   = em;
  badgeText.textContent   = info.title;
  downloadBtn.href        = song.src;
  downloadBtn.download    = song.title + ".mp3";

  heroGradient.style.background = `linear-gradient(135deg, rgba(${hexToRgb(col)},0.45), rgba(8,8,16,0.1) 70%)`;
  coverGlow.style.background    = `radial-gradient(circle at center, ${col}, transparent 70%)`;

  updateLikeBtn();
  progressFill.style.width  = "0%";
  progressBar.value         = 0;
  currentTimeEl.textContent = "0:00";
  durationEl.textContent    = "0:00";
  trackEmoji.classList.toggle("playing", isPlaying);
}

// ── PLAY / PAUSE ──
const PLAY_SVG  = `<path d="M8 5v14l11-7z"/>`;
const PAUSE_SVG = `<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>`;

function setPlaying(val) {
  isPlaying              = val;
  playIcon.innerHTML     = val ? PAUSE_SVG : PLAY_SVG;
  playMainIcon.innerHTML = val ? PAUSE_SVG : PLAY_SVG;
  eqBars.classList.toggle("playing", val);
  trackEmoji.classList.toggle("playing", val);
}

playBtn.onclick     = () => { audio.paused ? (audio.play(), setPlaying(true)) : (audio.pause(), setPlaying(false)); };
playMainBtn.onclick = () => playBtn.onclick();

// ── NEXT / PREV ──
function nextTrack() {
  if (repeat) { audio.currentTime = 0; audio.play(); return; }
  index = shuffle ? Math.floor(Math.random() * playlist.length) : (index + 1) % playlist.length;
  loadTrack(index); audio.play(); setPlaying(true); renderTable();
}
nextBtn.onclick = () => nextTrack();
prevBtn.onclick = () => {
  index = (index - 1 + playlist.length) % playlist.length;
  loadTrack(index); audio.play(); setPlaying(true); renderTable();
};
audio.onended = nextTrack;

// ── SHUFFLE / REPEAT ──
shuffleBtn.onclick = () => { shuffle = !shuffle; shuffleBtn.classList.toggle("active", shuffle); };
repeatBtn.onclick  = () => { repeat  = !repeat;  repeatBtn.classList.toggle("active", repeat); };

// ── LIKE ──
function updateLikeBtn() {
  const isLiked = liked.has(index);
  likeBtn.classList.toggle("liked", isLiked);
  likeBtn.querySelector("svg").style.fill = isLiked ? "#f472b6" : "none";
}
likeBtn.onclick = () => {
  liked.has(index) ? liked.delete(index) : liked.add(index);
  updateLikeBtn();
  likeBtn.style.transform = "scale(1.3)";
  setTimeout(() => likeBtn.style.transform = "", 200);
};

// ── PROGRESS ──
audio.ontimeupdate = () => {
  const pct             = (audio.currentTime / audio.duration) * 100 || 0;
  progressFill.style.width  = pct + "%";
  progressBar.value         = pct;
  currentTimeEl.textContent = format(audio.currentTime);
  durationEl.textContent    = format(audio.duration);
};
progressBar.oninput  = () => { audio.currentTime = (progressBar.value / 100) * audio.duration; };
volumeSlider.oninput = () => { audio.volume = volumeSlider.value; volFill.style.width = (volumeSlider.value * 100) + "%"; };

// ── RENDER TABLE ──
function renderTable() {
  songTable.innerHTML = "";
  playlist.forEach((song, i) => {
    const info   = splitTitle(song.title);
    const active = i === index;
    const tr     = document.createElement("tr");
    if (active) tr.classList.add("playlist-active");
    tr.innerHTML = `
      <td class="num-cell col-num">
        <span class="row-num" style="color:${active ? song.color : ''}">${i + 1}</span>
        <span class="row-play"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></span>
      </td>
      <td><div class="row-info">
        <span class="row-emoji">${song.emoji || "🎵"}</span>
        <div><div class="table-title">${info.title}</div><div class="table-artist">${info.artist}</div></div>
      </div></td>
      <td class="col-album" style="font-size:12px">Single</td>
      <td class="col-dur" style="text-align:right;font-size:12px">--:--</td>`;
    tr.onclick = () => { index = i; loadTrack(index); audio.play(); setPlaying(true); renderTable(); };
    songTable.appendChild(tr);
  });
}

// ── THREE.JS ──
let scene, camera, renderer, controls, model;
function init3D() {
  const container = document.getElementById("viewer-container");
  if (!container || typeof THREE === "undefined") return;
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x080810);
  camera = new THREE.PerspectiveCamera(55, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.set(0, 1.6, 3.2);
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; controls.enablePan = false;
  scene.add(new THREE.AmbientLight(0xffffff, 0.6));
  const dir = new THREE.DirectionalLight(0xa78bfa, 1.2); dir.position.set(5,10,7); scene.add(dir);
  const fill = new THREE.DirectionalLight(0x38bdf8, 0.5); fill.position.set(-5,-2,-5); scene.add(fill);
  new THREE.GLTFLoader().load("headphone.glb", g => {
    model = g.scene; scene.add(model);
    const box = new THREE.Box3().setFromObject(model);
    model.position.sub(box.getCenter(new THREE.Vector3()));
    model.scale.set(6,6,6);
  }, undefined, e => console.warn(e));
  window.addEventListener("resize", () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
}
function animate3D() {
  requestAnimationFrame(animate3D);
  if (model) model.rotation.y += isPlaying ? 0.006 : 0.002;
  if (controls) controls.update();
  if (renderer && scene && camera) renderer.render(scene, camera);
}
