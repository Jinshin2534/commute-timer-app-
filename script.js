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
  const minutes = Math.floor(sec / 60);
  const seconds = sec % 60;
  return `${minutes}分${seconds}秒`;
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
  alert(`到着しました：${formatDuration(diffSec)}かかりました`);
  updateDisplay();
}

function resetAll() {
  if (confirm("すべての記録を削除しますか？")) {
    durations = {};
    saveDurations();
    updateDisplay();
  }
}

function updateDisplay() {
  const app = document.getElementById("app");
  app.innerHTML = "";
  sections.forEach(sec => {
    const div = document.createElement("div");
    div.className = "section";

    const records = durations[sec.id] || [];
    const avg =
      records.length > 0
        ? Math.round(records.reduce((a, b) => a + b, 0) / records.length)
        : null;

    div.innerHTML = `
      <h2>${sec.label}</h2>
      <button onclick="startTimer('${sec.id}')">出発</button>
      <button onclick="stopTimer('${sec.id}')">到着</button>
      <div class="average">
        平均時間: ${avg !== null ? formatDuration(avg) : "--"}
      </div>
      <ul>
        ${records
          .map((s, i) => `<li>${i + 1}回目：${formatDuration(s)}</li>`)
          .join("")}
      </ul>
    `;

    app.appendChild(div);
  });
}

updateDisplay();
