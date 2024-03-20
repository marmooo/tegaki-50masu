const countPanel = document.getElementById("countPanel");
const infoPanel = document.getElementById("infoPanel");
const scorePanel = document.getElementById("scorePanel");
const canvases = [
  ...document.getElementById("canvases")
    .getElementsByTagName("canvas"),
];
const canvasCache = document.createElement("canvas").getContext("2d", {
  alpha: false,
  willReadFrequently: true,
});
const pads = initSignaturePads(canvases);
const audioContext = new globalThis.AudioContext();
const audioBufferCache = {};
loadAudio("end", "mp3/end.mp3");
loadAudio("correct", "mp3/correct3.mp3");
let correctCount = 0;
loadConfig();

function loadConfig() {
  if (localStorage.getItem("darkMode") == 1) {
    document.documentElement.setAttribute("data-bs-theme", "dark");
  }
}

function toggleDarkMode() {
  if (localStorage.getItem("darkMode") == 1) {
    localStorage.setItem("darkMode", 0);
    document.documentElement.setAttribute("data-bs-theme", "light");
  } else {
    localStorage.setItem("darkMode", 1);
    document.documentElement.setAttribute("data-bs-theme", "dark");
  }
}

async function playAudio(name, volume) {
  const audioBuffer = await loadAudio(name, audioBufferCache[name]);
  const sourceNode = audioContext.createBufferSource();
  sourceNode.buffer = audioBuffer;
  if (volume) {
    const gainNode = audioContext.createGain();
    gainNode.gain.value = volume;
    gainNode.connect(audioContext.destination);
    sourceNode.connect(gainNode);
    sourceNode.start();
  } else {
    sourceNode.connect(audioContext.destination);
    sourceNode.start();
  }
}

async function loadAudio(name, url) {
  if (audioBufferCache[name]) return audioBufferCache[name];
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  audioBufferCache[name] = audioBuffer;
  return audioBuffer;
}

function unlockAudio() {
  audioContext.resume();
}

// +-*/のテストデータ生成範囲を返却
function getNumRange(grade) {
  switch (grade) {
    case 1:
      return [[9, 1], [[10, 5], [5, 1]], [9, 1], [[9, 1], [5, 1]]];
    case 2:
      return [[14, 2], [[20, 11], [10, 1]], [9, 1], [[19, 1], [5, 1]]];
    case 3:
      return [[19, 4], [[26, 16], [15, 6]], [9, 1], [[99, 10], [9, 1]]];
    case 4:
      return [[24, 8], [[99, 50], [50, 11]], [9, 1], [[99, 20], [19, 11]]];
    default:
      return [[49, 11], [[99, 50], [50, 11]], [9, 1], [[99, 20], [19, 11]]];
  }
}

let startTime;
let gameTimer;
function startGameTimer() {
  correctCount = 0;
  clearInterval(gameTimer);
  const timeNode = document.getElementById("time");
  startTime = Date.now();
  gameTimer = setInterval(() => {
    timeNode.textContent = (Date.now() - startTime) / 1000;
  }, 200);
}

let countdownTimer;
function countdown() {
  initTable();
  clearTimeout(countdownTimer);
  countPanel.classList.remove("d-none");
  infoPanel.classList.add("d-none");
  scorePanel.classList.add("d-none");
  const counter = document.getElementById("counter");
  counter.textContent = 3;
  countdownTimer = setInterval(() => {
    const colors = ["skyblue", "greenyellow", "violet", "tomato"];
    if (parseInt(counter.textContent) > 1) {
      const t = parseInt(counter.textContent) - 1;
      counter.style.backgroundColor = colors[t];
      counter.textContent = t;
    } else {
      clearTimeout(countdownTimer);
      countPanel.classList.add("d-none");
      infoPanel.classList.remove("d-none");
      document.getElementById("score").textContent = 0;
      startGameTimer();
    }
  }, 1000);
}

function initTableFontSize() {
  const table = document.getElementById("table");
  const width = table.offsetWidth;
  table.style.fontSize = width / 11 * 0.6 + "px";
}

function shuffle(array) {
  for (let i = array.length; 1 < i; i--) {
    const k = Math.floor(Math.random() * i);
    [array[k], array[i - 1]] = [array[i - 1], array[k]];
  }
  return array;
}

function initTable() {
  initTableHeader();
  initTableAnswers();
  [...document.getElementById("table").querySelectorAll("td.table-danger")]
    .forEach((td) => {
      td.className = "";
    });
  document.getElementById("table").getElementsByTagName("tr")[1].children[1]
    .className = "table-danger";
}

function initTableAnswers() {
  const course = document.getElementById("courseOption").selectedIndex;
  const trs = document.getElementById("table").getElementsByTagName("tr");
  const ths = trs[0].children;
  for (let i = 1; i < trs.length; i++) {
    const tds = trs[i].children;
    for (let j = 1; j < tds.length; j++) {
      let answer;
      const a = parseInt(ths[j].textContent);
      const b = parseInt(tds[0].textContent);
      if (course == 0) {
        answer = a + b;
      } else if (course == 1) {
        answer = a - b;
      } else if (course == 2) {
        answer = a * b;
      } else {
        answer = Math.floor(a / b);
      }
      tds[j].dataset.answer = answer;
      tds[j].textContent = "";
    }
  }
}

function initTableHeader() {
  const table = document.getElementById("table");
  const ths = table.getElementsByTagName("th");
  const grade = document.getElementById("gradeOption").selectedIndex + 1;
  const course = document.getElementById("courseOption").selectedIndex;
  if (course == 1 || course == 3) {
    let [to, from] = getNumRange(grade)[course][0];
    let range = Array.from(new Array(to - from + 1)).map((_v, i) => i + from);
    let arr = shuffle(range.slice());
    arr = arr.concat(shuffle(range.slice()));
    for (let i = 1; i <= 10; i++) {
      ths[i].textContent = arr[i];
    }
    [to, from] = getNumRange(grade)[course][1];
    range = Array.from(new Array(to - from + 1)).map((_v, i) => i + from);
    arr = shuffle(range.slice());
    arr = arr.concat(shuffle(range.slice()));
    for (let i = 11; i <= 15; i++) {
      ths[i].textContent = arr[i - 11];
    }
  } else {
    const [to, from] = getNumRange(grade)[course];
    const range = Array.from(new Array(to - from + 1)).map((_v, i) => i + from);
    let arr = shuffle(range);
    arr = arr.concat(shuffle(range.slice())).concat(shuffle(range.slice()));
    for (let i = 1; i <= 15; i++) {
      ths[i].textContent = arr[i];
    }
  }
}

function moveCursorNext(obj) {
  const objY = obj.parentNode;
  const trs = [...document.getElementById("table").getElementsByTagName("tr")];
  const tds = [...obj.parentNode.children];
  const x = tds.indexOf(obj);
  const y = trs.indexOf(objY);
  let newObj;
  if (y == 5) {
    if (x == 10) {
      newObj = obj;
    } else {
      newObj = trs[1].children[x + 1];
    }
  } else {
    newObj = trs[y + 1].children[x];
  }
  obj.className = "";
  newObj.className = "table-danger";
}

function initSignaturePads(canvases) {
  const pads = [];
  for (let i = 0; i < canvases.length; i++) {
    const canvas = canvases[i];
    const pad = new SignaturePad(canvas, {
      minWidth: 5,
      maxWidth: 5,
      penColor: "black",
      backgroundColor: "white",
      throttle: 0,
    });
    pad.addEventListener("endStroke", () => {
      const data = pad.toData();
      let count = 0;
      for (let i = 0; i < data.length; i++) {
        count += data[i].points.length;
      }
      if (5 < count && count < 100) {
        const pos = canvases.indexOf(pad.canvas);
        predict(pad.canvas, pos, data.length, count);
      }
    });
    const eraser = canvas.nextElementSibling;
    eraser.onclick = () => {
      pad.clear();
      canvas.dataset.predict = "";
      const reply = new Array(2).fill("");
      for (let j = 0; j < canvases.length; j++) {
        reply[j] = canvases[j].dataset.predict;
      }
      const cursor = document.getElementById("table")
        .querySelector("td.table-danger");
      cursor.textContent = reply.join("");
    };
    pads.push(pad);
  }
  return pads;
}

function getImageData(drawElement) {
  const inputWidth = 28;
  const inputHeight = 28;
  // resize
  canvasCache.drawImage(drawElement, 0, 0, inputWidth, inputHeight);
  // invert color
  const imageData = canvasCache.getImageData(0, 0, inputWidth, inputHeight);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    data[i] = 255 - data[i];
    data[i + 1] = 255 - data[i + 1];
    data[i + 2] = 255 - data[i + 2];
  }
  return imageData;
}

const kakusus = [1, 1, 1, 1, 2, 2, 1, 2, 1, 1]; // japanese style
function getReplies(predicted) {
  const canvas = canvases[predicted.pos];
  const predicts = new Array(2).fill(" ");
  for (let i = 0; i < canvases.length; i++) {
    predicts[i] = canvases[i].dataset.predict;
  }
  if (predicted.klass != 1 && predicted.count < 15) {
    predicted.klass = "";
  } else if (predicted.kaku < kakusus[predicted.klass]) { // 画数が足りないものは不正解とする
    predicted.klass = "";
  }
  canvas.dataset.predict = predicted.klass;
  const pos = parseInt(canvas.getAttribute("id").slice(-1));
  predicts[pos] = predicted.klass.toString();
  return predicts;
}

function predict(canvas, pos, kaku, count) {
  const imageData = getImageData(canvas);
  worker.postMessage({
    pos: pos,
    imageData: imageData,
    kaku: kaku,
    count: count,
  });
}

initTable();
initTableFontSize();

const worker = new Worker("worker.js");
worker.addEventListener("message", (e) => {
  const reply = getReplies(e.data).join("");
  const cursor = document.getElementById("table")
    .querySelector("td.table-danger");
  cursor.textContent = reply;
  if (cursor.dataset.answer == reply) {
    playAudio("correct", 0.3);
    correctCount += 1;
    moveCursorNext(cursor);
    pads.forEach((pad) => {
      pad.clear();
    });
    canvases.forEach((canvas) => {
      canvas.dataset.predict = "";
    });
    if (correctCount == 50) {
      playAudio("end");
      clearInterval(gameTimer);
      infoPanel.classList.add("d-none");
      scorePanel.classList.remove("d-none");
      const time = (Date.now() - startTime) / 1000;
      document.getElementById("score").textContent = time;
    }
  }
});

document.getElementById("toggleDarkMode").onclick = toggleDarkMode;
document.getElementById("startButton").onclick = countdown;
document.getElementById("restartButton").onclick = countdown;
document.getElementById("courseOption").onchange = (event) => {
  const obj = event.target;
  const text = obj.options[obj.selectedIndex].textContent;
  document.getElementById("courseText").innerHTML = text;
  initTable();
};
document.getElementById("gradeOption").onchange = initTable;
globalThis.onresize = initTableFontSize;
document.addEventListener("click", unlockAudio, {
  once: true,
  useCapture: true,
});
