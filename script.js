const addTaskBtn = document.getElementById("addTaskBtn");
const taskInput = document.getElementById("taskInput");
const taskTable = document.getElementById("taskTable");
const taskTableBody = document.querySelector("#taskTable tbody");

let taskList = JSON.parse(localStorage.getItem("tasks")) || [];

renderTable();

addTaskBtn.addEventListener("click", addTask);
taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addTask();
  }
});

function addTask() {
  const taskName = taskInput.value.trim();

  if (taskName === "") {
    alert("Please enter a task!");
    return;
  }
  taskList.push({ name: taskName, completed: false });
  taskInput.value = "";
  saveTasks();
  renderTable();
}


function renderTable() {
  taskTableBody.innerHTML = "";

  if (taskList.length > 0) {
    taskTable.classList.remove("hidden");
  } else {
    taskTable.classList.add("hidden");
  }

  taskList.forEach((task, index) => {
    const row = document.createElement("tr");
    row.className = "text-center text-sm";

    // Sr. No
    const srNoCell = document.createElement("td");
    srNoCell.className = "px-3 py-2 border-b border-gray-200";
    srNoCell.innerText = index + 1;
    row.appendChild(srNoCell);

    // Status Checkbox
    const statusCell = document.createElement("td");
    statusCell.className = "px-3 py-2 border-b border-gray-200";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => {
      task.completed = checkbox.checked;
      saveTasks();
    });
    statusCell.appendChild(checkbox);
    row.appendChild(statusCell);

    // Task Name
    const taskCell = document.createElement("td");
    taskCell.className = "px-3 py-2 border-b border-gray-200 text-left break-words sm:max-w-[250px] max-w-[90px] ";
    taskCell.setAttribute("draggable","true");
    taskCell.innerText = task.name;
    row.appendChild(taskCell);

    // Edit Button
    const editCell = document.createElement("td");
    editCell.className = "px-3 py-2 border-b border-gray-200";
    const editBtn = document.createElement("button");
    editBtn.className = "bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-2 sm:px-3 rounded text-xs";
    editBtn.innerText = "Edit";
    editBtn.addEventListener("click", () => {
      const newTaskName = prompt("Edit your task:", task.name);
      if (newTaskName !== null && newTaskName.trim() !== "") {
        task.name = newTaskName.trim();
        saveTasks();
        renderTable();
      }
    });
    editCell.appendChild(editBtn);
    row.appendChild(editCell);

    // Remove Button
    const removeCell = document.createElement("td");
    removeCell.className = "px-3 py-2 border-b border-gray-200";
    const removeBtn = document.createElement("button");
    removeBtn.className = "bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-1 rounded text-xs sm:px-3";
    removeBtn.innerText = "Remove";
    removeBtn.addEventListener("click", () => {
      taskList.splice(index, 1);
      saveTasks();
      renderTable();
    });
    removeCell.appendChild(removeBtn);
    row.appendChild(removeCell);

    taskTableBody.appendChild(row);
  });
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(taskList));
}


//drag and drop function ->

const tbody = document.querySelector("#taskTable tbody");

 let draggedrow = null;

 tbody.addEventListener("dragstart",(e)=>{
  draggedrow = e.target.closest('tr');
  draggedrow.classList.add('dragging');
 })

 tbody.addEventListener("dragend",(e)=>{
  draggedrow.classList.remove('dragging');
  draggedrow = null;
  UpdateSerialNo();
 })

 tbody.addEventListener("dragover",(e)=>{
  e.preventDefault();
  const rowAfterDrag = getDragAfterElement(tbody,e.clientY);
  if(rowAfterDrag == null){
    tbody.append(draggedrow);
  } else{
    tbody.insertBefore(draggedrow,rowAfterDrag);
  }
 })

 function getDragAfterElement(container, y){
  const nonDraggedElement = [...container.querySelectorAll("tr:not(.dragging)")];

  return nonDraggedElement.reduce((closest,child)=>{
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height/2;
    if(offset < 0 && offset > closest.offset ){
      return {offset: offset, element:child};
    }else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;

 }

 function UpdateSerialNo(){
  const allrow = document.querySelectorAll("#taskTable tbody tr:not(.dragging)");
  allrow.forEach((row,index)=>{
    row.cells[0].innerText = index+1;
  })
 }
