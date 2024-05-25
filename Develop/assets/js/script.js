// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));
let taskModalEl = $(`#formModal`)
let taskTitleEl = $(`#taskTitle`);
let taskDueDateEl = $('#dueDate');
let taskDescriptionEl = $(`#description`);


// Todo: create a function to generate a unique task id
function generateTaskId() {
    let tasks = JSON.parse(localStorage.getItem('tasks'));

    
    if (!tasks) {
      tasks = [];
    }
  
    return 'task_' + dayjs().format('YYYYMMDDHHmmssSSS');
  }
  

  function saveTasksToStorage(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

// Todo: create a function to create a task card
function createTaskCard(task) {
    const taskCard = $('<div>')
    .addClass('card tasks-card draggable my-3')
    .attr('data-tasks-id', tasks.id);
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
    const taskDueDate = dayjs(task.dueDate, 'DD/MM/YYYY');


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
    const tasks = readTasksFromStorage();

    const todoList = $('#todo-cards');
    todoList.empty();

    const inProgressList = $('#in-progress-cards');
    inProgressList.empty();

    const doneList = $('#done-cards');
    doneList.empty();

    for (let task of tasks) {
        if (tasks.status === 'to-do') {
          todoList.append(createtaskCard(task));
        } else if (task.status === 'in-progress') {
          inProgressList.append(createtaskCard(task));
        } else if (task.status === 'done') {
          doneList.append(createTaskCard(task));
        }
      }

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
function handleAddTask(event){
    event.preventDefault();

    // ? Read user input from the form
    const taskName = taskNameInputEl.val().trim();
    const taskDate = taskDateInputEl.val().trim(); 
    const taskType = taskDescriptionInputEl.val(); 
    
  
    const newTask = {
      name: taskName,
      dueDate: taskDate,
      type: taskType,

      status: 'to-do',
    };
  

    const tasks = readTasksFromStorage();
    tasks.push(newTask);
  

    saveTasksToStorage(tasks);
  

    printTaskData();
  

    taskNameInputEl.val('');
    taskDateInputEl.val('');
    taskDescriptionInputEl.val('');
    

}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
    const taskId = $(this).attr('data-task-id');
    const tasks = readTasksFromStorage();
  

    task.forEach((task) => {
      if (task.id === taskId) {
        tasks.splice(tasks.indexOf(task), 1);
      }
    });
  
    saveTasksToStorage(tasks);
  
    printTaskData();
  }

//   taskDisplayEl.on('click', '.btn-delete-task', handleDeleteTask);

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

  const tasks = readTasksFromStorage();


  const taskId = ui.draggable[0].dataset.taskId;


  const newStatus = event.target.id;

  for (let task of tasks) {
    if (task.id === taskId) {
      task.status = newStatus;
    }
  }

  localStorage.setItem('tasks', JSON.stringify(tasks));
  saveTasksToStorage(tasks);
}


// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    $('#addTaskBtn').on('click', handleAddTask);

    $('#taskDueDate').datepicker({
      changeMonth: true,
      changeYear: true,
    });
  
    $('.lane').droppable({
      accept: '.draggable',
      drop: handleDrop,
    });
});
