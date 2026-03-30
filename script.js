// ── PLAYLIST WITH EMOJI ICONS & COLORS ──
const playlist = [
  { title:"Barasuara - Terbuang Dalam Waktu", src:"music/Barasuara - Terbuang Dalam Waktu (Official Video).mp3", emoji:"🌊", color:"#38bdf8" },
  { title:"Beach Bunny - Prom Queen", src:"music/Beach Bunny - Prom Queen (Official Music Video).mp3", emoji:"👑", color:"#f472b6" },
  { title:"For Revenge X Stereo Wall - Jakarta Hari Ini", src:"music/For Revenge X Stereo Wall - Jakarta Hari Ini (Official Video).mp3", emoji:"🌆", color:"#fb923c" },
  { title:"Gigi Perez - Sailor Song", src:"music/Gigi Perez - Sailor Song (Lyrics).mp3", emoji:"⚓", color:"#60a5fa" },
  { title:"FIFA - Hayya Hayya (Better Together)", src:"music/Hayya Hayya (Better Together) _ FIFA World Cup 2022™ Official Soundtrack.mp3", emoji:"⚽", color:"#4ade80" },
  { title:"JVKE - her", src:"music/JVKE - her (official lyric video).mp3", emoji:"💜", color:"#a78bfa" },
  { title:"Lana Del Rey - Summertime Sadness", src:"music/Lana Del Rey - Summertime Sadness (Official Music Video).mp3", emoji:"🌅", color:"#fbbf24" },
  { title:"Nadin Amizah - Bertaut", src:"music/Nadin Amizah - Bertaut (Official Music Video).mp3", emoji:"🌸", color:"#f9a8d4" },
  { title:"sombr - back to friends", src:"music/sombr - back to friends (official audio).mp3", emoji:"🥀", color:"#94a3b8" },
  { title:"Umay Shahab - perayaan mati rasa", src:"music/Umay Shahab - perayaan mati rasa.mp3", emoji:"🎭", color:"#c084fc" },
  { title:"The Ronettes - Be My Baby", src:"music/The Ronettes - Be My Baby.mp3", emoji:"🎀", color:"#fb7185" },
  { title:"Ravyn Lenae - Love Me Not", src:"music/Ravyn Lenae - Love Me Not.mp3", emoji:"🌺", color:"#f472b6" },
  { title:"Justin Bieber - Peaches ft. Daniel Caesar, Giveon", src:"music/Justin Bieber - Peaches ft. Daniel Caesar, Giveon.mp3", emoji:"🍑", color:"#fdba74" },
  { title:"Idgitaf - Sedia Aku Sebelum Hujan", src:"music/Idgitaf - Sedia Aku Sebelum Hujan.mp3", emoji:"🌧️", color:"#7dd3fc" },
  { title:"The Red Army - Glory, Glory, Man. United", src:"music/Glory, Glory, Man. United.mp3", emoji:"🔴", color:"#ef4444" },
  { title:"Hindia - Secukupnya", src:"music/Hindia - Secukupnya.mp3", emoji:"🌿", color:"#86efac" },
  { title:"John Denver - Take Me Home", src:"music/John Denver - Take Me Home.mp3", emoji:"🏡", color:"#a3e635" },
  { title:"Where'd All The Time Go - Dr. Dog", src:"music/Where'd All The Time Go_ - Dr. Dog.mp3", emoji:"⏳", color:"#fde68a" },
  { title:"She & Him - I Thought I Saw Your Face Today", src:"music/She & Him - I Thought I Saw Your Face Today (Official Lyric Video).mp3", emoji:"🌻", color:"#fcd34d" }
];

// ── STATE ──
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
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `${r},${g},${b}`;
}

// ── LOAD TRACK ──
function loadTrack(i) {
  const song = playlist[i];
  const info = splitTitle(song.title);
  const em = song.emoji;
  const col = song.color;

  audio.src = song.src;
  trackTitle.textContent = info.title;
  trackArtist.textContent = info.artist;
  trackEmoji.textContent = em;

  // Badge
  badgeIcon.textContent = em;
  badgeText.textContent = info.title;

  // Download
  downloadBtn.href = song.src;
  downloadBtn.download = song.title + ".mp3";

  // Hero gradient
  heroGradient.style.background =
    `linear-gradient(135deg, rgba(${hexToRgb(col)},0.45), rgba(8,8,16,0.1) 70%)`;

  // Cover glow
  coverGlow.style.background = `radial-gradient(circle at center, ${col}, transparent 70%)`;

  // Like state
  updateLikeBtn();

  // Reset progress
  progressFill.style.width = "0%";
  progressBar.value = 0;
  currentTimeEl.textContent = "0:00";
  durationEl.textContent = "0:00";

  // Emoji spin while playing
  if (isPlaying) trackEmoji.classList.add("playing");
  else trackEmoji.classList.remove("playing");
}

// ── PLAY / PAUSE ──
const PLAY_SVG  = `<path d="M8 5v14l11-7z"/>`;
const PAUSE_SVG = `<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>`;

function setPlaying(val) {
  isPlaying = val;
  playIcon.innerHTML  = val ? PAUSE_SVG : PLAY_SVG;
  playMainIcon.innerHTML = val ? PAUSE_SVG : PLAY_SVG;
  eqBars.classList.toggle("playing", val);
  trackEmoji.classList.toggle("playing", val);
}

playBtn.onclick = () => {
  if (audio.paused) { audio.play(); setPlaying(true); }
  else { audio.pause(); setPlaying(false); }
};
playMainBtn.onclick = () => playBtn.onclick();

// ── NEXT / PREV ──
function nextTrack() {
  if (repeat) { audio.currentTime = 0; audio.play(); return; }
  index = shuffle
    ? Math.floor(Math.random() * playlist.length)
    : (index + 1) % playlist.length;
  loadTrack(index);
  audio.play();
  setPlaying(true);
  renderTable();
}

nextBtn.onclick = () => nextTrack();
prevBtn.onclick = () => {
  index = (index - 1 + playlist.length) % playlist.length;
  loadTrack(index);
  audio.play();
  setPlaying(true);
  renderTable();
};
audio.onended = nextTrack;

// ── SHUFFLE / REPEAT ──
shuffleBtn.onclick = () => {
  shuffle = !shuffle;
  shuffleBtn.classList.toggle("active", shuffle);
};
repeatBtn.onclick = () => {
  repeat = !repeat;
  repeatBtn.classList.toggle("active", repeat);
};

// ── LIKE ──
function updateLikeBtn() {
  const isLiked = liked.has(index);
  likeBtn.classList.toggle("liked", isLiked);
  likeBtn.querySelector("svg").style.fill = isLiked ? "#f472b6" : "none";
}
likeBtn.onclick = () => {
  if (liked.has(index)) liked.delete(index);
  else liked.add(index);
  updateLikeBtn();
  likeBtn.style.transform = "scale(1.3)";
  setTimeout(() => likeBtn.style.transform = "", 200);
};

// ── PROGRESS ──
audio.ontimeupdate = () => {
  const pct = (audio.currentTime / audio.duration) * 100 || 0;
  progressFill.style.width = pct + "%";
  progressBar.value = pct;
  currentTimeEl.textContent = format(audio.currentTime);
  durationEl.textContent = format(audio.duration);
};
progressBar.oninput = () => {
  audio.currentTime = (progressBar.value / 100) * audio.duration;
};

// ── VOLUME ──
volumeSlider.oninput = () => {
  audio.volume = volumeSlider.value;
  volFill.style.width = (volumeSlider.value * 100) + "%";
};

// ── RENDER TABLE ──
function renderTable() {
  songTable.innerHTML = "";
  playlist.forEach((song, i) => {
    const info = splitTitle(song.title);
    const active = i === index;
    const tr = document.createElement("tr");
    if (active) tr.classList.add("playlist-active");

    tr.innerHTML = `
      <td class="num-cell col-num">
        <span class="row-num" style="color:${active ? song.color : ''}">${i + 1}</span>
        <span class="row-play">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
        </span>
      </td>
      <td>
        <div class="row-info">
          <span class="row-emoji">${song.emoji}</span>
          <div>
            <div class="table-title">${info.title}</div>
            <div class="table-artist">${info.artist}</div>
          </div>
        </div>
      </td>
      <td class="col-album" style="font-size:12px">Single</td>
      <td class="col-dur" style="text-align:right;font-size:12px">--:--</td>
    `;

    tr.onclick = () => {
      index = i;
      loadTrack(index);
      audio.play();
      setPlaying(true);
      renderTable();
    };
    songTable.appendChild(tr);
  });
}

// ── THREE.JS 3D VIEWER ──
let scene, camera, renderer, controls, model;
init3D();
animate3D();

function init3D() {
  const container = document.getElementById("viewer-container");
  if (!container) return;

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x080810);

  camera = new THREE.PerspectiveCamera(55, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.set(0, 1.6, 3.2);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.minDistance = 2;
  controls.maxDistance = 8;

  // Lighting
  scene.add(new THREE.AmbientLight(0xffffff, 0.6));
  const dir = new THREE.DirectionalLight(0xa78bfa, 1.2);
  dir.position.set(5, 10, 7);
  scene.add(dir);
  const fill = new THREE.DirectionalLight(0x38bdf8, 0.5);
  fill.position.set(-5, -2, -5);
  scene.add(fill);

  // Load model
  const loader = new THREE.GLTFLoader();
  loader.load(
    "headphone.glb",
    (g) => {
      model = g.scene;
      scene.add(model);
      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      model.position.sub(center);
      model.scale.set(6, 6, 6);
    },
    undefined,
    (e) => console.warn("GLTFLoader:", e)
  );

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

// ── INIT ──
loadTrack(index);
renderTable();
