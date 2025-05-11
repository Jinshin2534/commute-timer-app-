let startTime = null;
let durations = JSON.parse(localStorage.getItem("durations") || "[]");

function startTimer() {
  startTime = new Date();
  alert("出発時間を記録しました: " + startTime.toLocaleTimeString());
}

function stopTimer() {
  if (!startTime) {
    alert("先に『家を出発』ボタンを押してください。");
    return;
  }

  const endTime = new Date();
  const diffMs = endTime - startTime;
  const diffMin = Math.round(diffMs / 60000); // 分単位
  durations.push(diffMin);
  localStorage.setItem("durations", JSON.stringify(durations));
  startTime = null;

  alert("到着時間を記録しました: " + endTime.toLocaleTimeString() + "\n所要時間: " + diffMin + " 分");
  updateDisplay();
}

function updateDisplay() {
  const recordList = document.getElementById("recordList");
  recordList.innerHTML = "";
  durations.forEach((min, i) => {
    const li = document.createElement("li");
    li.textContent = `${i + 1}回目: ${min} 分`;
    recordList.appendChild(li);
  });

  const total = durations.reduce((a, b) => a + b, 0);
  const average = durations.length > 0 ? (total / durations.length).toFixed(1) : "--";
  document.getElementById("average").textContent = `${average} 分`;
}

// 初期表示
updateDisplay();
