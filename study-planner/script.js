const taskForm = document.getElementById('taskForm');
const planList = document.getElementById('planList');
const startDateForm = document.getElementById('startDateForm');
const startDateInput = document.getElementById('startDate');

// 初期読み込み
let studyPlan = JSON.parse(localStorage.getItem('studyPlan')) || {};
let completed = JSON.parse(localStorage.getItem('completedTasks')) || {};
let startDate = localStorage.getItem('startDate') || null;

if (startDate) startDateInput.value = startDate;

renderPlan();

// 開始日設定フォーム
startDateForm.addEventListener('submit', function (e) {
  e.preventDefault();
  startDate = startDateInput.value;
  localStorage.setItem('startDate', startDate);
  renderPlan();
});

// タスク追加
taskForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const day = parseInt(document.getElementById('day').value);
  const subject = document.getElementById('subject').value.trim();
  const details = document.getElementById('details').value.trim();

  if (!studyPlan[day]) {
    studyPlan[day] = [];
  }

  studyPlan[day].push({ subject, details });

  saveData();
  renderPlan();
  taskForm.reset();
});

// 計画表示
function renderPlan() {
  planList.innerHTML = "";

  const sortedDays = Object.keys(studyPlan).sort((a, b) => a - b);

  sortedDays.forEach(day => {
    const entries = studyPlan[day];
    const li = document.createElement('li');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';

    // チェック状態の復元
    const taskKey = `day-${day}`;
    checkbox.checked = completed[taskKey] === true;

    checkbox.addEventListener('change', () => {
      completed[taskKey] = checkbox.checked;
      saveData();
      renderPlan();
    });

    const taskText = entries.map(entry => `【${entry.subject}】${entry.details}`).join(" / ");
    const span = document.createElement('span');
    span.innerHTML = `<strong>Day ${day}:</strong> ${taskText}`;

    if (checkbox.checked) {
      li.classList.add('done');
    }

    const dateInfo = document.createElement('span');
    dateInfo.classList.add('date-info');
    dateInfo.textContent = startDate ? getDateLabel(startDate, day) : "";

    const left = document.createElement('div');
    left.appendChild(span);
    left.appendChild(dateInfo);

    li.appendChild(left);
    li.appendChild(checkbox);
    planList.appendChild(li);
  });
}

// 保存処理
function saveData() {
  localStorage.setItem('studyPlan', JSON.stringify(studyPlan));
  localStorage.setItem('completedTasks', JSON.stringify(completed));
  if (startDate) {
    localStorage.setItem('startDate', startDate);
  }
}

// 日付ラベル生成
function getDateLabel(baseDateStr, dayNumber) {
  const base = new Date(baseDateStr);
  base.setDate(base.getDate() + (dayNumber - 1));
  const options = { month: 'short', day: 'numeric', weekday: 'short' };
  return base.toLocaleDateString('ja-JP', options); // 例：8月1日(木)
}
