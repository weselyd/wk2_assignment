const addTaskBtn = document.getElementById('addTaskBtn');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');

// Saves tasks to localStorage
function saveTasks() {
    const tasks = [];  // Create empty array to hold tasks
    taskList.querySelectorAll('li .task-content').forEach(span => {  // For each task in the list, get the text content
        tasks.push(span.textContent);  // Push the text content to the tasks array
    });
    localStorage.setItem('todo-tasks', JSON.stringify(tasks));  // Convert tasks array to JSON and save to localStorage
}

// Loads tasks from localStorage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('todo-tasks') || '[]');  // Attempts to load todo-tasks from localStorage, uses '[]' as fall back if not found
    tasks.forEach(taskText => {  // Rebuilds the task list from the todo-tasks
        const li = createTaskItem(taskText);
        taskList.appendChild(li);
    });
}

// Adds task to bottom of list when "Add Task" button is clicked.  Does 
// nothing if the input is empty.
addTaskBtn.addEventListener('click', function() {
    const taskText = taskInput.value.trim();
    if (taskText !== "") {
        const li = createTaskItem(taskText);
        taskList.appendChild(li);
        taskInput.value = "";  // Resets task.Input to empty string
        saveTasks();  // Saves list of tasks to localStorage
    }
});

// Simulates 'click' when user presses "Enter" when entering new task
taskInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        addTaskBtn.click();
    }
});

// Helper function that creates a task item
function createTaskItem(text) {
    const li = document.createElement('li');
    li.setAttribute('draggable', 'true');

    // Drag handle icon
    const taskHandle = document.createElement('span');
    taskHandle.className = 'taskhandle';
    taskHandle.innerHTML = '&#9776;'; // Unicode hamburger icon

    // Task text
    const taskContent = document.createElement('span');
    taskContent.className = 'task-content';
    taskContent.textContent = text;

    // Edit button icon
    const editBtn = document.createElement('button');
    editBtn.className = 'icon-btn';
    editBtn.title = 'Edit task';
    editBtn.innerHTML = '&#9998;'; // Unicode pencil

    editBtn.addEventListener('click', () => {  // Event listener for edit button
        const input = document.createElement('input');
        input.type = 'text';
        input.value = taskContent.textContent;
        input.className = 'edit-input';
        input.style.flex = '1';
        li.replaceChild(input, taskContent);
        input.focus();  // Puts focus on the input field
        input.select();  // Selects all text in the input field

        function saveEdit() {  // Function to save the edited task
            const newValue = input.value.trim();
            if (newValue) {  // Checks if the new value is not empty
                taskContent.textContent = newValue;
            }
            li.replaceChild(taskContent, input);
            saveTasks();  // Saves list of tasks to localStorage
        }

        input.addEventListener('blur', saveEdit);
    });

    // Delete button icon
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'icon-btn';
    deleteBtn.title = 'Delete task';
    deleteBtn.innerHTML = '&#128465;'; // Unicode trash can

    deleteBtn.addEventListener('click', () => {
        li.remove();
        saveTasks();
    });

    // Appends elements to each task item in list
    li.appendChild(taskHandle);
    li.appendChild(taskContent);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);

    // Setup drag and drop event listeners
    li.addEventListener('dragstart', (e) => {
        li.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', '');
        window.draggedItem = li;
    });

    // Completes drag and drop events
    li.addEventListener('dragend', () => {
        li.classList.remove('dragging');
        window.draggedItem = null;
        document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
        saveTasks();  // Saves list of tasks to localStorage
    });

    // Event listener that allows the dragged item to be dropped on other items
    li.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    });

    // Event listener that provides visual feedback to the user when dragging over another item
    li.addEventListener('dragenter', (e) => {
        e.preventDefault();
        if (li !== window.draggedItem) {
            li.classList.add('drag-over');
        }
    });

    // Removes drag-over CSS class when dragged item is no longer over a target item
    li.addEventListener('dragleave', () => {
        li.classList.remove('drag-over');
    });

    // Event listener that drops the dragged item into the target item and clears drag-over CSS class
    li.addEventListener('drop', (e) => {
        e.preventDefault();
        li.classList.remove('drag-over');
        const dragged = window.draggedItem;
        if (dragged && dragged !== li) {
            taskList.insertBefore(dragged, li);
            saveTasks();  // Saves list of tasks to localStorage
        }
    });

    return li;
}

// Attempts to load tasks from localStorage on page load
loadTasks();