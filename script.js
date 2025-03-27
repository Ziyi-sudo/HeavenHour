let startTime = 0;
let elapsedTime = 0;
let timerInterval = null;

const timerDisplay = document.getElementById("timer");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");

// 时间格式化函数
function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

// 开始计时
startBtn.addEventListener("click", () => {
  if (timerInterval) return;

  const taskInput = document.getElementById("taskName");
  let taskName = taskInput.value.trim();
  if (taskName === "") {
    taskName = "未命名任务";
    taskInput.value = taskName;
  }

  const mode = document.getElementById("modeSelect").value;

  if (mode === "countup") {
    startTime = Date.now() - elapsedTime;
    startTimeFormatted = new Date().toLocaleTimeString();

    timerInterval = setInterval(() => {
      elapsedTime = Date.now() - startTime;
      timerDisplay.textContent = formatTime(elapsedTime);
    }, 1000);

  } else if (mode === "countdown") {
    let minutes = parseInt(document.getElementById("countdownInput").value);
    if (isNaN(minutes) || minutes <= 0) {
      alert("请输入倒计时分钟数");
      return;
    }

    let countdownTime = minutes * 60 * 1000; // 转成毫秒
    const endTime = Date.now() + countdownTime;

    startTimeFormatted = new Date().toLocaleTimeString();

    timerInterval = setInterval(() => {
      let timeLeft = endTime - Date.now();
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        timerInterval = null;
        timerDisplay.textContent = "00:00:00";
        alert("倒计时结束！");
        return;
      }
      timerDisplay.textContent = formatTime(timeLeft);
    }, 1000);
  }
});

// 暂停
pauseBtn.addEventListener("click", () => {
  clearInterval(timerInterval);
  timerInterval = null;

  const taskName = document.getElementById("taskName").value;
  endTimeFormatted = new Date().toLocaleTimeString();
  const mode = document.getElementById("modeSelect").value;

  const record = {
    taskName: taskName || "未命名任务",
    mode: mode,
    startTime: startTimeFormatted,
    endTime: endTimeFormatted,
    duration: formatTime(elapsedTime),
    date: new Date().toLocaleDateString()
  };

  let history = JSON.parse(localStorage.getItem("havenRecords")) || [];
  history.push(record);
  localStorage.setItem("havenRecords", JSON.stringify(history));

  console.log("✅ 已记录任务：", record);
});

// 重置
resetBtn.addEventListener("click", () => {
  clearInterval(timerInterval);
  timerInterval = null;
  startTime = 0;
  elapsedTime = 0;
  timerDisplay.textContent = "00:00:00";
});