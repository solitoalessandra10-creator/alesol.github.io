// script.js - versione stabile, un solo file

const modal = document.getElementById("homeworkModal");
const openBtn = document.getElementById("openModal");
const closeBtn = document.querySelector(".close");
const cancelBtn = document.getElementById("cancelBtn");
const form = document.getElementById("homeworkForm");
const container = document.getElementById("homeworkContainer");

// Apri/chiudi modal
openBtn.onclick = () => modal.classList.add("show");
closeBtn.onclick = cancelBtn.onclick = () => modal.classList.remove("show");
window.onclick = (e) => { if(e.target === modal) modal.classList.remove("show"); };

// Crea card
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

  let fileHTML = fileData ? `<a href="${fileData}" download="${fileName}">${fileName}</a>` : "No file";

  content.innerHTML = `
    <div class="hw-row"><strong>Task:</strong> <span class="row-text">${task}</span></div>
    <div class="hw-row"><strong>Created:</strong> <span class="row-text">${date}</span></div>
    <div class="description-row"><strong>Description:</strong> <span class="description-text">${description}</span></div>
    <div class="hw-row"><strong>File:</strong> <span class="row-text">${fileHTML}</span></div>
  `;

  header.onclick = () => content.classList.toggle("open");
  card.appendChild(content);
  container.appendChild(card);
}

// Salvataggio nel localStorage
function saveHomework(hw) {
  let list = JSON.parse(localStorage.getItem("homeworkList")) || [];
  list.push(hw);
  localStorage.setItem("homeworkList", JSON.stringify(list));
  return list.length - 1;
}

function removeHomework(index) {
  let list = JSON.parse(localStorage.getItem("homeworkList")) || [];
  list.splice(index,1);
  localStorage.setItem("homeworkList", JSON.stringify(list));
}

// Ricarica homework salvati
function loadHomework() {
  const list = JSON.parse(localStorage.getItem("homeworkList")) || [];
  list.forEach((item,index) => {
    createCard(item.title, item.task, item.description, item.date, item.fileName, item.fileData, index);
  });
}

function refreshIndexes() {
  const cards = container.querySelectorAll(".homework-card");
  cards.forEach((card,i) => {
    const deleteBtn = card.querySelector(".delete-btn");
    deleteBtn.onclick = (e)=>{
      e.stopPropagation();
      removeHomework(i);
      card.remove();
      refreshIndexes();
    };
  });
}

// Submit form
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
      const fileData = reader.result;
      const index = saveHomework({title, task, description, date, fileName: file.name, fileData});
      createCard(title, task, description, date, file.name, fileData, index);
    };
    reader.readAsDataURL(file);
  } else {
    const index = saveHomework({title, task, description, date, fileName: null, fileData: null});
    createCard(title, task, description, date, null, null, index);
  }

  form.reset();
  modal.classList.remove("show");
};

// Carica al refresh
loadHomework();
