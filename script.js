const playlist = [
 {title:"Barasuara - Terbuang Dalam Waktu",src:"music/Barasuara - Terbuang Dalam Waktu (Official Video).mp3"},
 {title:"Beach Bunny - Prom Queen",src:"music/Beach Bunny - Prom Queen (Official Music Video).mp3"},
 {title:"For Revenge X Stereo Wall - Jakarta Hari Ini",src:"music/For Revenge X Stereo Wall - Jakarta Hari Ini (Official Video).mp3"},
 {title:"Gigi Perez - Sailor Song",src:"music/Gigi Perez - Sailor Song (Lyrics).mp3"},
 {title:"Hayya Hayya FIFA 2022",src:"music/Hayya Hayya (Better Together) _ FIFA World Cup 2022™ Official Soundtrack.mp3"},
 {title:"JVKE - her",src:"music/JVKE - her (official lyric video).mp3"},
 {title:"Lana Del Rey - Summertime Sadness",src:"music/Lana Del Rey - Summertime Sadness (Official Music Video).mp3"},
 {title:"Nadin Amizah - Bertaut",src:"music/Nadin Amizah - Bertaut (Official Music Video).mp3"},
 {title:"sombr - back to friends",src:"music/sombr - back to friends (official audio).mp3"},
 {title:"Umay Shahab - perayaan mati rasa",src:"music/Umay Shahab - perayaan mati rasa.mp3"},
 {title:"The Ronettes - Be My Baby",src:"music/The Ronettes - Be My Baby.mp3"},
 {title:"Ravyn Lenae - Love Me Not",src:"music/Ravyn Lenae - Love Me Not.mp3"},
 {title:"Justin Bieber - Peaches ft. Daniel Caesar, Giveon",src:"music/Justin Bieber - Peaches ft. Daniel Caesar, Giveon.mp3"},
 {title:"Idgitaf - Sedia Aku Sebelum Hujan",src:"music/Idgitaf - Sedia Aku Sebelum Hujan.mp3"},
 {title:"She & Him - I Thought I Saw Your Face Today",src:"music/She & Him - I Thought I Saw Your Face Today (Official Lyric Video).mp3"}
];

let index = 0;
let shuffle = false;

const audio = document.getElementById("audio");
const playBtn = document.getElementById("playBtn");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const shuffleBtn = document.getElementById("shuffleBtn");
const progressBar = document.getElementById("progressBar");
const trackTitle = document.getElementById("trackTitle");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");
const volumeSlider = document.getElementById("volumeSlider");
const songTable = document.getElementById("songTable");


function loadTrack(i){
  audio.src = playlist[i].src;
  trackTitle.textContent = playlist[i].title;
}
loadTrack(index);
renderTable();


playBtn.onclick = ()=>{
  if(audio.paused){audio.play();playBtn.textContent="⏸"}
  else{audio.pause();playBtn.textContent="▶"}
}

nextBtn.onclick = ()=> nextTrack();
prevBtn.onclick = ()=>{index=(index-1+playlist.length)%playlist.length;loadTrack(index);audio.play();}
renderTable();
shuffleBtn.onclick = ()=>{shuffle=!shuffle;shuffleBtn.style.color=shuffle?"#1db954":"white"}

audio.onended = nextTrack;

function nextTrack(){
  index = shuffle?Math.floor(Math.random()*playlist.length):(index+1)%playlist.length;
  loadTrack(index);audio.play();
}
renderTable();


audio.ontimeupdate = ()=>{
  progressBar.value = (audio.currentTime/audio.duration)*100||0;
  currentTimeEl.textContent = format(audio.currentTime);
  durationEl.textContent = format(audio.duration);
}
progressBar.oninput = ()=> audio.currentTime = (progressBar.value/100)*audio.duration;
volumeSlider.oninput = ()=> audio.volume = volumeSlider.value;

function format(t){if(isNaN(t))return"0:00";let m=Math.floor(t/60);let s=Math.floor(t%60).toString().padStart(2,"0");return `${m}:${s}`}

// ===== THREE.JS =====
let scene,camera,renderer,controls,model;

init3D();
animate();

function init3D(){
  const container=document.getElementById("viewer-container");

  scene=new THREE.Scene();
  scene.background=new THREE.Color(0x121212);

  camera=new THREE.PerspectiveCamera(60,container.clientWidth/container.clientHeight,0.1,1000);
  camera.position.set(0,1.8,3.5);

  renderer=new THREE.WebGLRenderer({antialias:true});
  renderer.setSize(container.clientWidth,container.clientHeight);
  container.appendChild(renderer.domElement);

  controls=new THREE.OrbitControls(camera,renderer.domElement);
  controls.enableDamping=true;

  scene.add(new THREE.AmbientLight(0xffffff,0.9));
  const dir=new THREE.DirectionalLight(0xffffff,1);
  dir.position.set(5,10,7);
  scene.add(dir);

  const loader=new THREE.GLTFLoader();
  loader.load("headphone.glb",g=>{
    model=g.scene;
    scene.add(model);

    const box=new THREE.Box3().setFromObject(model);
    const center=box.getCenter(new THREE.Vector3());
    model.position.sub(center);

    model.scale.set(6, 6, 6);
  },undefined,e=>console.error(e));

  window.addEventListener("resize",()=>{
    camera.aspect=container.clientWidth/container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth,container.clientHeight);
  });
}

function animate(){
  requestAnimationFrame(animate);
  if(model) model.rotation.y += 0.003;
  controls.update();
  renderer.render(scene,camera);
}

function renderTable(){
  songTable.innerHTML = "";
  playlist.forEach((song,i)=>{
    const row = document.createElement("tr");
    row.innerHTML = `<td>${i+1}</td><td>${song.title}</td>`;

    if(i === index) row.classList.add("playlist-active");

    row.onclick = ()=>{
      index = i;
      loadTrack(index);
      audio.play();
      renderTable();
    };

    songTable.appendChild(row);
  });
}
