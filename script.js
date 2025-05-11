const sections = [
  { id: "morningGo", label: "朝の行き", color: "rgba(54, 162, 235, 0.6)" },
  { id: "noonBack", label: "昼の帰り", color: "rgba(255, 159, 64, 0.6)" },
  { id: "noonGo", label: "昼の行き", color: "rgba(75, 192, 192, 0.6)" },
  { id: "eveningBack", label: "授業後の帰り", color: "rgba(255, 99, 132, 0.6)" }
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
  sections.forEach((sec, idx) => {
    const records = durations[sec.id] || [];
    const avg = records.length > 0 ? Math.round(records.reduce((a, b) => a + b, 0) / records.length) : null;

    const item = document.createElement("div");
    item.className = `carousel-item${idx === 0 ? ' active' : ''}`;

    item.innerHTML = `
      <div class="section">
        <h2>${sec.label}</h2>
        <button class="btn btn-primary me-2" onclick="startTimer('${sec.id}')">出発</button>
        <button class="btn btn-success" onclick="stopTimer('${sec.id}')">到着</button>
        <div class="mt-3 fw-bold">平均時間: ${avg !== null ? formatDuration(avg) : "--"}</div>
        <ul class="mt-2">
          ${records.map((r, i) => `<li>${i + 1}回目: ${formatDuration(r)}</li>`).join("")}
        </ul>
      </div>
    `;
    slider.appendChild(item);
  });

  drawCombinedChart();
}

let combinedChartInstance = null;

function drawCombinedChart() {
  const ctx = document.getElementById("combinedChart").getContext("2d");

  const datasets = sections.map(sec => {
    const data = durations[sec.id] || [];
    return {
      label: sec.label,
      data: data,
      fill: false,
      borderColor: sec.color,
      tension: 0.2
    };
  });

  if (combinedChartInstance) combinedChartInstance.destroy();

  combinedChartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: Array.from({ length: Math.max(...datasets.map(d => d.data.length)) }, (_, i) => `${i + 1}回目`),
      datasets: datasets
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: "すべての記録比較グラフ"
        }
      },
      scales: {
        y: {
          title: {
            display: true,
            text: "所要時間（秒）"
          }
        }
      }
    }
  });
}

updateDisplay();
