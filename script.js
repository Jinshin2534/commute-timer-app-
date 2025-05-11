const sections = [
  { id: "morningGo", label: "朝の行き" },
  { id: "noonBack", label: "昼の帰り" },
  { id: "noonGo", label: "昼の行き" },
  { id: "eveningBack", label: "授業後の帰り" }
];

let timers = {};
let durations = JSON.parse(localStorage.getItem("durations")) || {};

function saveDurations() {
  localStorage.setItem("durations", JSON.stringify(durations));
}

function formatDuration(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}分${s}秒`;
}

function startTimer(id) {
  timers[id] = new Date();
  alert(`${sections.find(s => s.id === id).label}：出発を記録しました`);
}

function stopTimer(id) {
  if (!timers[id]) {
    alert("出発していません！");
    return;
  }

  const end = new Date();
  const diffSec = Math.round((end - timers[id]) / 1000);
  timers[id] = null;

  if (!durations[id]) durations[id] = [];
  durations[id].push(diffSec);
  saveDurations();
  alert(`到着しました：${formatDuration(diffSec)}`);
  updateDisplay();
}

function resetAll() {
  if (confirm("記録をすべて削除しますか？")) {
    durations = {};
    saveDurations();
    updateDisplay();
  }
}

function updateDisplay() {
  const slider = document.getElementById("slider");
  slider.innerHTML = "";
  sections.forEach(sec => {
    const records = durations[sec.id] || [];
    const avg = records.length > 0
      ? Math.round(records.reduce((a, b) => a + b, 0) / records.length)
      : null;

    const slide = document.createElement("div");
    slide.className = "slide";
    slide.innerHTML = `
      <div class="section">
        <h2>${sec.label}</h2>
        <button onclick="startTimer('${sec.id}')">出発</button>
        <button onclick="stopTimer('${sec.id}')">到着</button>
        <div class="average">平均時間: ${avg !== null ? formatDuration(avg) : "--"}</div>
        <ul>
          ${records.map((r, i) => `<li>${i + 1}回目: ${formatDuration(r)}</li>`).join("")}
        </ul>
      </div>
    `;
    slider.appendChild(slide);
  });
}

// スワイプ処理
let startX = 0;
let currentIndex = 0;

const slider = document.getElementById("sliderContainer");
slider.addEventListener("touchstart", e => {
  startX = e.touches[0].clientX;
});

slider.addEventListener("touchend", e => {
  const endX = e.changedTouches[0].clientX;
  const diff = endX - startX;
  if (Math.abs(diff) > 50) {
    if (diff < 0 && currentIndex < sections.length - 1) {
      currentIndex++;
    } else if (diff > 0 && currentIndex > 0) {
      currentIndex--;
    }
    document.getElementById("slider").style.transform = `translateX(-${currentIndex * 100}%)`;
  }
});

updateDisplay();
