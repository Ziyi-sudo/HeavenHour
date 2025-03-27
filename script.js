let startTime = 0;
let elapsedTime = 0;
let timerInterval = null;

// 显式声明，避免成为隐式全局
let startTimeFormatted = "";
let endTimeFormatted = "";

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

// 保存记录函数，统一使用 ISO 格式日期（"YYYY-MM-DD"）
function saveRecord() {
  endTimeFormatted = new Date().toLocaleTimeString();
  const taskName = document.getElementById("taskName").value || "未命名任务";
  const mode = document.getElementById("modeSelect").value;
  const record = {
    taskName: taskName,
    mode: mode,
    startTime: startTimeFormatted,
    endTime: endTimeFormatted,
    duration: formatTime(elapsedTime),
    date: new Date().toISOString().slice(0, 10)
  };

  let history = JSON.parse(localStorage.getItem("havenRecords")) || [];
  history.push(record);
  localStorage.setItem("havenRecords", JSON.stringify(history));
  console.log("记录已保存:", record);
}

// 开始计时
startBtn.addEventListener("click", () => {
  // 如果已经在计时，就不再重复启动
  if (timerInterval) return;

  const taskInput = document.getElementById("taskName");
  let taskName = taskInput.value.trim();
  if (taskName === "") {
    taskName = "未命名任务";
    taskInput.value = taskName;
  }

  const mode = document.getElementById("modeSelect").value;

  if (mode === "countup") {
    // 正计时模式：记录开始时间
    startTime = Date.now() - elapsedTime;
    startTimeFormatted = new Date().toLocaleTimeString();

    timerInterval = setInterval(() => {
      elapsedTime = Date.now() - startTime;
      timerDisplay.textContent = formatTime(elapsedTime);
    }, 1000);

  } else if (mode === "countdown") {
    // 倒计时模式：获取倒计时分钟数
    let minutes = parseInt(document.getElementById("countdownInput").value);
    if (isNaN(minutes) || minutes <= 0) {
      alert("请输入倒计时分钟数");
      return;
    }

    // 将分钟转换为毫秒，并计算结束时间点
    let countdownTime = minutes * 60 * 1000;
    const endTimePoint = Date.now() + countdownTime;

    // 记录真正的开始时间，重置 elapsedTime
    startTime = Date.now();
    elapsedTime = 0;
    startTimeFormatted = new Date().toLocaleTimeString();

    timerInterval = setInterval(() => {
      let timeLeft = endTimePoint - Date.now();

      // 每秒更新 elapsedTime，确保“暂停”时能记录正确时长
      elapsedTime = Date.now() - startTime;

      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        timerInterval = null;
        timerDisplay.textContent = "00:00:00";
        alert("倒计时结束！");
        
        // 保存记录
        saveRecord();
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
  saveRecord();
});

// 重置
resetBtn.addEventListener("click", () => {
  clearInterval(timerInterval);
  timerInterval = null;
  startTime = 0;
  elapsedTime = 0;
  timerDisplay.textContent = "00:00:00";
});