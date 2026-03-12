const modal = document.getElementById("homeworkModal");
const openBtn = document.getElementById("openModal");
const closeBtn = document.querySelector(".close");
const cancelBtn = document.getElementById("cancelBtn");
const form = document.getElementById("homeworkForm");
const container = document.getElementById("homeworkContainer");

// Open/close modal with smooth transition
openBtn.onclick = () => modal.classList.add("show");
closeBtn.onclick = cancelBtn.onclick = () => modal.classList.remove("show");
window.onclick = (e) => { if (e.target === modal) modal.classList.remove("show"); };

// Create a homework card
function createCard(title, task, description, date, fileName, fileData, index) {
  const card = document.createElement("div");
  card.className = "homework-card";

  const header = document.createElement("div");
  header.className = "card-header";

  const titleSpan = document.createElement("span");
  titleSpan.textContent = title;
  titleSpan.className = "card-title";

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "❌";
  deleteBtn.className = "delete-btn";
  deleteBtn.setAttribute("aria-label", "Delete homework");

  deleteBtn.onclick = (e) => {
    e.stopPropagation();
    removeHomework(index);
    card.remove();
    refreshIndexes();
  };

  header.appendChild(titleSpan);
  header.appendChild(deleteBtn);
  card.appendChild(header);

  const content = document.createElement("div");
  content.className = "card-content";

  let fileHTML = "No file";
  if (fileData) fileHTML = `<a href="${fileData}" download="${fileName}">${fileName}</a>`;

  content.innerHTML = `
    <div class="hw-row"><span class="label">Task</span><span>${task}</span></div>
    <div class="hw-row"><span class="label">Description</span><span>${description}</span></div>
    <div class="hw-row"><span class="label">Created</span><span>${date}</span></div>
    <div class="hw-row"><span class="label">File</span><span>${fileHTML}</span></div>
  `;

  // Toggle content open/close with smooth max-height animation
  header.onclick = () => content.classList.toggle("open");

  card.appendChild(content);
  container.appendChild(card);
}

// Save homework to localStorage
function saveHomework(hw) {
  const list = JSON.parse(localStorage.getItem("homeworkList")) || [];
  list.push(hw);
  localStorage.setItem("homeworkList", JSON.stringify(list));
}

// Remove homework from localStorage
function removeHomework(index) {
  const list = JSON.parse(localStorage.getItem("homeworkList")) || [];
  list.splice(index, 1);
  localStorage.setItem("homeworkList", JSON.stringify(list));
}

// Load all homework from localStorage
function loadHomework() {
  const list = JSON.parse(localStorage.getItem("homeworkList")) || [];
  list.forEach((item, index) => {
    createCard(item.title, item.task, item.description, item.date, item.fileName, item.fileData, index);
  });
}

// Refresh delete buttons indices
function refreshIndexes() {
  const cards = container.querySelectorAll(".homework-card");
  cards.forEach((card, i) => {
    const deleteBtn = card.querySelector(".delete-btn");
    deleteBtn.onclick = (e) => {
      e.stopPropagation();
      removeHomework(i);
      card.remove();
      refreshIndexes();
    };
  });
}

// Handle form submit
form.onsubmit = (e) => {
  e.preventDefault();
  const title = document.getElementById("weekTitle").value;
  const task = document.getElementById("task").value;
  const description = document.getElementById("description").value;
  const file = document.getElementById("fileInput").files[0];
  const date = new Date().toLocaleDateString();

  if (file) {
    const reader = new FileReader();
    reader.onload = function() {
      const hw = { title, task, description, date, fileName: file.name, fileData: reader.result };
      createCard(title, task, description, date, file.name, reader.result,
        JSON.parse(localStorage.getItem("homeworkList") || "[]").length);
      saveHomework(hw);
    };
    reader.readAsDataURL(file);
  } else {
    const hw = { title, task, description, date, fileName: null, fileData: null };
    createCard(title, task, description, date, null, null,
      JSON.parse(localStorage.getItem("homeworkList") || "[]").length);
    saveHomework(hw);
  }

  form.reset();
  modal.classList.remove("show");
};

// Load homework on page load
loadHomework();
