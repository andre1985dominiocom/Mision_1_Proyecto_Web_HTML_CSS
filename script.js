class TaskManager {
    constructor() {
        this.tasks = [];
        this.currentId = 0;
        this.loadFromLocalStorage();
        this.initializeEventListeners();
    }

    // Initialize event listeners
    initializeEventListeners() {
        // Add task form submission
        const form = document.getElementById('taskForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addTask();
            });
        }

        // Clear completed tasks button
        const clearBtn = document.getElementById('clearCompleted');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearCompletedTasks());
        }
    }

    // Add new task
    addTask() {
        const taskInput = document.getElementById('taskInput');
        const taskText = taskInput.value.trim();

        if (this.validateInput(taskText)) {
            const task = {
                id: this.currentId++,
                text: taskText,
                completed: false,
                createdAt: new Date().toISOString()
            };

            this.tasks.push(task);
            this.saveToLocalStorage();
            this.renderTasks();
            this.showNotification('Tarea añadida exitosamente', 'success');
            taskInput.value = '';
        } else {
            this.showNotification('Por favor ingrese una tarea válida', 'error');
        }
    }

    // Edit task
    editTask(id, newText) {
        const task = this.tasks.find(t => t.id === id);
        if (task && this.validateInput(newText)) {
            task.text = newText;
            this.saveToLocalStorage();
            this.renderTasks();
            this.showNotification('Tarea actualizada', 'success');
        }
    }

    // Toggle task completion
    toggleTaskCompletion(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveToLocalStorage();
            this.renderTasks();
        }
    }

    // Delete task
    deleteTask(id) {
        this.tasks = this.tasks.filter(t => t.id !== id);
        this.saveToLocalStorage();
        this.renderTasks();
        this.showNotification('Tarea eliminada', 'success');
    }

    // Clear completed tasks
    clearCompletedTasks() {
        this.tasks = this.tasks.filter(t => !t.completed);
        this.saveToLocalStorage();
        this.renderTasks();
        this.showNotification('Tareas completadas eliminadas', 'success');
    }

    // Validate input
    validateInput(text) {
        return text.length >= 3 && text.length <= 100;
    }

    // Save to localStorage
    saveToLocalStorage() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
        localStorage.setItem('currentId', this.currentId.toString());
    }

    // Load from localStorage
    loadFromLocalStorage() {
        const savedTasks = localStorage.getItem('tasks');
        const savedId = localStorage.getItem('currentId');
        
        if (savedTasks) {
            this.tasks = JSON.parse(savedTasks);
        }
        
        if (savedId) {
            this.currentId = parseInt(savedId);
        }
    }

    // Render tasks
    renderTasks() {
        const taskList = document.getElementById('taskList');
        if (!taskList) return;

        taskList.innerHTML = '';

        this.tasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.className = `task-item ${task.completed ? 'completed' : ''}`;
            
            taskElement.innerHTML = `
                <input type="checkbox" ${task.completed ? 'checked' : ''}>
                <span class="task-text">${task.text}</span>
                <div class="task-actions">
                    <button class="edit-btn">Editar</button>
                    <button class="delete-btn">Eliminar</button>
                </div>
            `;

            // Add event listeners
            const checkbox = taskElement.querySelector('input[type="checkbox"]');
            checkbox.addEventListener('change', () => this.toggleTaskCompletion(task.id));

            const editBtn = taskElement.querySelector('.edit-btn');
            editBtn.addEventListener('click', () => {
                const newText = prompt('Editar tarea:', task.text);
                if (newText !== null) {
                    this.editTask(task.id, newText);
                }
            });

            const deleteBtn = taskElement.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => {
                if (confirm('¿Está seguro de que desea eliminar esta tarea?')) {
                    this.deleteTask(task.id);
                }
            });

            taskList.appendChild(taskElement);
        });
    }

    // Show notification
    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialize Task Manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const taskManager = new TaskManager();
    taskManager.renderTasks();
});