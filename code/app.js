const API_FIRE_URL = 'https://api-g46udunzma-uc.a.run.app/api/tasks'; // URL API en Firebase
//const API_URL = 'http://localhost:3000/api/tasks'; // URL de nuestra API backend

const taskForm = document.getElementById('task-form');
const taskTitleInput = document.getElementById('task-title');
const taskList = document.getElementById('task-list');

// Función para obtener y mostrar las tareas
const getTasks = async () => {
    const response = await fetch(API_FIRE_URL);
    const tasks = await response.json();
    
    taskList.innerHTML = ''; // Limpiar la lista
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `list-group-item d-flex justify-content-between align-items-center ${task.completed ? 'task-completed' : ''}`;
        
        li.innerHTML = `
            <span class="${task.completed ? 'completed' : ''}">${task.title}</span>
            <div>
                <button class="btn btn-warning btn-sm" onclick="editTask(${task.id}, '${task.title}')">
                    Editar
                </button>
                <button class="btn btn-success btn-sm" onclick="toggleComplete(${task.id}, ${!task.completed})">
                    ${task.completed ? 'Deshacer' : 'Completar'}
                </button>
                <button class="btn btn-danger btn-sm" onclick="deleteTask(${task.id})">Eliminar</button>
            </div>
        `;
        taskList.appendChild(li);
    });
};

// Función para crear una nueva tarea (POST)
taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = taskTitleInput.value;

    if (!title) return;

    await fetch(API_FIRE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title })
    });

    taskTitleInput.value = '';
    getTasks(); // Recargar la lista de tareas
});

// Función para editar el título de la tarea (PUT)
const editTask = async (id, currentTitle) => {
    const newTitle = prompt("Edita tu tarea:", currentTitle);

    // Si el usuario presiona "Cancelar", newTitle será null. Si no escribe nada, será "".
    if (newTitle === null || newTitle.trim() === '') {
        return; // No hacer nada si el usuario cancela o deja el campo vacío.
    }

    await fetch(`${API_FIRE_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle }) // Enviamos solo el título para actualizar
    });
    getTasks(); // Recargar la lista para mostrar el cambio
};


// Función para cambiar el estado de completado (PUT)
const toggleComplete = async (id, completed) => {
    await fetch(`${API_FIRE_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed })
    });
    getTasks();
};

// Función para eliminar una tarea (DELETE)
const deleteTask = async (id) => {
    await fetch(`${API_FIRE_URL}/${id}`, {
        method: 'DELETE'
    });
    getTasks();
};

// Cargar las tareas al iniciar la aplicación
document.addEventListener('DOMContentLoaded', getTasks);