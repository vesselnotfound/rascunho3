/* -----------------------
  Sons (URLs públicos)
  ----------------------- */
const CLICK_SOUND = "https://cdn.pixabay.com/download/audio/2022/03/15/audio_4e1fa53237.mp3?filename=button-16-114189.mp3";
const SUCCESS_SOUND = "https://cdn.pixabay.com/download/audio/2022/03/15/audio_f3b0d4f2bc.mp3?filename=success-1-110820.mp3";

/* UTIL: tocar som */
function playSound(url, vol=0.15){
  const s = new Audio(url);
  s.volume = vol;
  s.play().catch(()=>{});
}

/* LOADER: esconder após init */
window.addEventListener("load",()=>{
  // anima loader e some
  setTimeout(()=> {
    const loader = document.getElementById("loader");
    if(loader) loader.style.display = "none";
  }, 1800);
});

/* LOGIN FAKE */
function tryLogin(){
  const pw = document.getElementById("pw").value.trim();
  // senha demo: h4ck3r
  if(pw === "h4ck3r"){
    // anima Acesso Permitido
    playSound(SUCCESS_SOUND, 0.35);
    const login = document.getElementById("login");
    login.querySelector("h2").innerText = "Acesso Permitido";
    setTimeout(()=> {
      login.style.display = "none";
      document.body.style.overflow = "auto";
      document.getElementById("status").innerText = "online";
    }, 700);
  } else {
    // som e tremer
    playSound(CLICK_SOUND, 0.2);
    shakeLogin();
  }
}
function fillDemo(){ document.getElementById("pw").value = "h4ck3r"; }

/* SIDEBAR */
function toggleSide(){
  const sb = document.getElementById("sidebar");
  sb.classList.toggle("active");
  playSound(CLICK_SOUND, 0.12);
}

/* THEME TOGGLE */
const themeBtn = document.getElementById("themeBtn");
themeBtn.addEventListener("click", ()=>{
  document.body.classList.toggle("theme-purple");
  playSound(CLICK_SOUND, 0.12);
});

/* QUICK ACTION BUTTONS que digitam no terminal */
document.querySelectorAll(".action").forEach(btn=>{
  btn.addEventListener("click", (e)=>{
    const text = e.currentTarget.dataset.snippet || "";
    injectToTerminal(text);
    playSound(CLICK_SOUND, 0.12);
    highlightStatus("typing");
  });
});

/* TYPING BUTTONS nos cards */
document.querySelectorAll(".type-btn").forEach(b=>{
  b.addEventListener("click", (e)=>{
    const txt = e.currentTarget.dataset.text || "";
    typeIntoTerminal(txt);
    playSound(CLICK_SOUND, 0.12);
  });
});

/* Download helper */
function downloadText(filename, content){
  const blob = new Blob([content], {type: "text/plain"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  playSound(SUCCESS_SOUND, 0.18);
}

/* Terminal functions (simulado) */
const term = document.getElementById("term");
if(term){
  term.innerText = "> "; // prompt
  term.addEventListener("keydown",(e)=>{
    if(e.key==="Enter"){
      e.preventDefault();
      const lines = term.innerText.split("\n");
      const last = lines[lines.length-1].replace("> ","").trim();
      handleCmd(last);
    }
  });
}

function handleCmd(cmd){
  if(!cmd) return;
  appendToTerm("\n");
  const parts = cmd.split(" ");
  const base = parts[0].toLowerCase();

  switch(base){
    case "help":
      appendToTerm("Comandos: help, about, clear, echo, time, theme\n> ");
      break;
    case "about":
      appendToTerm("Hacker Zone — terminal simulado (demo). Não executa comandos reais.\n> ");
      break;
    case "clear":
      term.innerText = "> ";
      break;
    case "echo":
      appendToTerm(parts.slice(1).join(" ") + "\n> ");
      break;
    case "time":
      appendToTerm(new Date().toString() + "\n> ");
      break;
    case "theme":
      document.body.classList.toggle("theme-purple");
      appendToTerm("Tema trocado.\n> ");
      break;
    default:
      appendToTerm(`Comando \"${cmd}\" não reconhecido. Digite help.\n> `);
  }
  playSound(CLICK_SOUND, 0.08);
}

/* Helpers para terminal */
function appendToTerm(text){
  term.innerText += text;
  term.scrollTop = term.scrollHeight;
}
function injectToTerminal(text){
  // coloca no prompt atual
  const cur = term.innerText;
  const lines = cur.split("\n");
  lines[lines.length-1] = "> " + text;
  term.innerText = lines.join("\n");
  term.focus();
}
function termRun(){ // simula executar o que está no prompt
  const cur = term.innerText;
  const lines = cur.split("\n");
  const last = lines[lines.length-1].replace("> ","").trim();
  handleCmd(last);
}
function termClear(){ term.innerText = "> "; }
function termHelp(){ handleCmd("help"); }

/* Simula typing (digitar efeito) */
function typeIntoTerminal(text, speed = 30){
  const cur = term.innerText.replace("> ","");
  let idx = 0;
  const base = term.innerText.split("\n");
  base[base.length-1] = "> ";
  term.innerText = base.join("\n");
  const interval = setInterval(()=>{
    const char = text.charAt(idx);
    if(char) {
      term.innerText += char;
      idx++;
      term.scrollTop = term.scrollHeight;
    } else {
      clearInterval(interval);
      playSound(SUCCESS_SOUND, 0.06);
    }
  }, speed);
}

/* Abrir ferramentas simuladas */
function openTool(name){
  if(name === "headers"){
    alert("Analisador de Headers (simulado). Exemplo:\nServer: nginx\nCache-Control: no-cache");
  } else if(name === "terminal-sim"){
    // ativa aba terminal
    activateTab("terminalTab");
  }
  playSound(CLICK_SOUND, 0.09);
}

/* Tabs */
document.querySelectorAll(".tab").forEach(t=>{
  t.addEventListener("click",(e)=>{
    const target = e.currentTarget.dataset.tab;
    activateTab(target);
    playSound(CLICK_SOUND, 0.1);
  });
});
function activateTab(id){
  document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));
  document.querySelectorAll(".panel").forEach(p=>p.classList.remove("active"));
  document.querySelector(`.tab[data-tab="${id}"]`).classList.add("active");
  document.getElementById(id).classList.add("active");
}

/* status flash */
function highlightStatus(txt){
  const s = document.getElementById("status");
  s.innerText = txt;
  setTimeout(()=> s.innerText = "online", 900);
}

/* shake animation for bad login */
function shakeLogin(){
  const card = document.querySelector(".login-card");
  card.animate([{transform:'translateX(0)'},{transform:'translateX(-8px)'},{transform:'translateX(8px)'},{transform:'translateX(0)'}],{duration:360});
}

/* MATRIX CANVAS (responsivo) */
const canvas = document.getElementById("matrix");
const ctx = canvas.getContext("2d");
function resizeCanvas(){ canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
resizeCanvas(); window.addEventListener("resize", resizeCanvas);

const letters = "01";
const fontSize = 14;
let columns = Math.floor(canvas.width / fontSize);
let drops = Array(columns).fill(1);

function matrixDraw(){
  ctx.fillStyle = "rgba(0,0,0,0.06)";
  ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--neon') || "#00ff9d";
  ctx.font = fontSize + "px monospace";

  for(let i=0;i<drops.length;i++){
    const text = letters.charAt(Math.floor(Math.random()*letters.length));
    ctx.fillText(text, i*fontSize, drops[i]*fontSize);
    if(drops[i]*fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
    drops[i]++;
  }
}
setInterval(matrixDraw, 45);

/* ensure drops match width after resize */
window.addEventListener("resize", ()=> {
  columns = Math.floor(canvas.width / fontSize);
  drops = Array(columns).fill(1);
});

/* Download whole bundle (zip simulation) -> just downloads index.html as single file */
function downloadBundle(){
  const content = document.documentElement.outerHTML;
  downloadText("site_demo.html", content);
}
