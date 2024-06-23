// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;


// Todo: create a function to generate a unique task id
// received from chatgpt 
  function generateTaskId() {
    return 'task_' + nextId++;
}

function saveTasksToStorage(tasks) {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Todo: create a function to create a task card
function createTaskCard(task) {
  const taskCard = $('<div>')
      .addClass('card tasks-card draggable my-3')
      .attr('data-task-id', task.id);
  
  const cardHeader = $('<div>').addClass('card-header h4').text(task.name);
  const cardBody = $('<div>').addClass('card-body');
  const cardDueDate = $('<p>').addClass('card-text').text(task.dueDate);
  const cardDescription = $('<p>').addClass('card-text').text(task.description);
  const cardDeleteBtn = $('<button>')
      .addClass('btn btn-danger delete')
      .text('Delete')
      .attr('data-task-id', task.id);
  
  cardDeleteBtn.on('click', handleDeleteTask);
  
  if (task.dueDate && task.status !== 'done') {
      const now = dayjs();
      const taskDueDate = dayjs(task.dueDate, 'YYYY-MM-DD');
  
      if (now.isSame(taskDueDate, 'day')) {
          taskCard.addClass('bg-warning text-white');
      } else if (now.isAfter(taskDueDate)) {
          taskCard.addClass('bg-danger text-white');
          cardDeleteBtn.addClass('border-light');
      }
  }
  
  cardBody.append(cardDueDate, cardDescription, cardDeleteBtn);
  taskCard.append(cardHeader, cardBody);
  
  return taskCard;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
  const todoList = $('#todo-cards');
  const inProgressList = $('#in-progress-cards');
  const doneList = $('#done-cards');
  
  todoList.empty();
  inProgressList.empty();
  doneList.empty();
  
  taskList.forEach(task => {
      const taskCard = createTaskCard(task);
      if (task.status === 'to-do') {
          todoList.append(taskCard);
      } else if (task.status === 'in-progress') {
          inProgressList.append(taskCard);
      } else if (task.status === 'done') {
          doneList.append(taskCard);
      }
  });
  
  $('.draggable').draggable({
      opacity: 0.7,
      zIndex: 100,
      helper: function (e) {
          const original = $(e.target).hasClass('ui-draggable')
              ? $(e.target)
              : $(e.target).closest('.ui-draggable');
          return original.clone().css({
              width: original.outerWidth(),
          });
      },
  });
}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
  event.preventDefault();

  const newTask = {
      id: generateTaskId(),
      name: $('#taskTitle').val().trim(),
      dueDate: $('#dueDate').val().trim(),
      description: $('#description').val().trim(),
      status: 'to-do',
  };

  taskList.push(newTask);
  saveTasksToStorage(taskList);
  renderTaskList();
  $('#formModal').modal('hide');
  $('#taskTitle').val('');
  $('#dueDate').val('');
  $('#description').val('');
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
  const taskId = $(this).attr('data-task-id');
  taskList = taskList.filter(task => task.id !== taskId);
  saveTasksToStorage(taskList);
  renderTaskList();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
  const taskId = ui.draggable.attr('data-task-id');
  const newStatus = event.target.id;
  
  taskList.forEach(task => {
      if (task.id === taskId) {
          task.status = newStatus;
      }
  });
  
  saveTasksToStorage(taskList);
  renderTaskList();
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker

$(document).ready(function () {
  renderTaskList();
  
  $('#saveTaskBtn').on('click', handleAddTask);
  
  $('.lane').droppable({
      accept: '.draggable',
      drop: handleDrop,
  });
  
  $('#dueDate').datepicker({
      dateFormat: 'yy-mm-dd'
  });
});