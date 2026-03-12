// script.js funzionante

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

// Funzione per creare la card
function createCard(title, task, description, date, filesArray, index) {
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
  deleteBtn.setAttribute("aria-label","Delete homework");

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
  if (filesArray && filesArray.length > 0) {
    fileHTML = filesArray.map(f => `<a href="${f.data}" download="${f.name}">${f.name}</a>`).join("<br>");
  }

  content.innerHTML = `
    <div class="hw-row"><strong>Task:</strong> <span class="row-text">${task}</span></div>
    <div class="hw-row"><strong>Created:</strong> <span class="row-text">${date}</span></div>
    <div class="description-row"><strong>Description:</strong> <span class="description-text">${description}</span></div>
    <div class="hw-row"><strong>Files:</strong><br> <span class="row-text">${fileHTML}</span></div>
  `;

  header.onclick = () => content.classList.toggle("open");
  card.appendChild(content);
  container.appendChild(card);
}

// Funzioni localStorage
function saveHomework(hw) {
  let list = JSON.parse(localStorage.getItem("homeworkList")) || [];
  list.push(hw);
  localStorage.setItem("homeworkList", JSON.stringify(list));
  return list.length - 1; // indice corretto
}

function removeHomework(index) {
  let list = JSON.parse(localStorage.getItem("homeworkList")) || [];
  list.splice(index,1);
  localStorage.setItem("homeworkList", JSON.stringify(list));
}

// Ricarica homework
function loadHomework() {
  const list = JSON.parse(localStorage.getItem("homeworkList")) || [];
  list.forEach((item,index) => {
    createCard(item.title, item.task, item.description, item.date, item.filesArray, index);
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
form.onsubmit = async (e) => {
  e.preventDefault();

  const title = document.getElementById("weekTitle").value;
  const task = document.getElementById("task").value;
  const description = document.getElementById("description").value;
  const files = document.getElementById("fileInput").files;
  const date = new Date().toLocaleDateString();

  // Legge tutti i file in maniera asincrona usando Promise
  const filesArray = [];
  if (files.length > 0) {
    const filePromises = Array.from(files).map(file => new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = () => resolve({name: file.name, data: reader.result});
      reader.readAsDataURL(file);
    }));

    const results = await Promise.all(filePromises);
    results.forEach(f => filesArray.push(f));
  }

  // Salva e crea card
  const index = saveHomework({title, task, description, date, filesArray});
  createCard(title, task, description, date, filesArray, index);

  form.reset();
  modal.classList.remove("show");
};

// Carica all’avvio
loadHomework();
