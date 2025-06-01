import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FiPlus, FiUser, FiCalendar, FiClock } from 'react-icons/fi';
import ProjectsService from '../../services/api/projects';
import './ProjectDashboard.css';

const TASK_STATUS = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  REVIEW: 'Review',
  DONE: 'Done'
};

const ProjectDashboard = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState({
    [TASK_STATUS.TODO]: [],
    [TASK_STATUS.IN_PROGRESS]: [],
    [TASK_STATUS.REVIEW]: [],
    [TASK_STATUS.DONE]: []
  });
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignee: '',
    dueDate: '',
    estimatedHours: ''
  });

  useEffect(() => {
    loadProject();
  }, [projectId]);

  const loadProject = async () => {
    try {
      const projectData = await ProjectsService.getProjectById(projectId);
      setProject(projectData);
      
      // Organize tasks by status
      const organizedTasks = {
        [TASK_STATUS.TODO]: [],
        [TASK_STATUS.IN_PROGRESS]: [],
        [TASK_STATUS.REVIEW]: [],
        [TASK_STATUS.DONE]: []
      };
      
      projectData.tasks?.forEach(task => {
        if (organizedTasks[task.status]) {
          organizedTasks[task.status].push(task);
        }
      });
      
      setTasks(organizedTasks);
    } catch (error) {
      console.error('Error loading project:', error);
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    
    if (source.droppableId === destination.droppableId) {
      // Reorder within the same column
      const column = tasks[source.droppableId];
      const newColumn = Array.from(column);
      const [removed] = newColumn.splice(source.index, 1);
      newColumn.splice(destination.index, 0, removed);
      
      setTasks({
        ...tasks,
        [source.droppableId]: newColumn
      });
    } else {
      // Move between columns
      const sourceColumn = tasks[source.droppableId];
      const destColumn = tasks[destination.droppableId];
      const newSourceColumn = Array.from(sourceColumn);
      const newDestColumn = Array.from(destColumn);
      const [moved] = newSourceColumn.splice(source.index, 1);
      
      // Update task status
      moved.status = destination.droppableId;
      newDestColumn.splice(destination.index, 0, moved);
      
      setTasks({
        ...tasks,
        [source.droppableId]: newSourceColumn,
        [destination.droppableId]: newDestColumn
      });

      // Update in database
      try {
        const updatedTasks = [
          ...newSourceColumn,
          ...newDestColumn,
          ...Object.values(tasks)
            .flat()
            .filter(t => 
              t.status !== source.droppableId && 
              t.status !== destination.droppableId
            )
        ];

        await ProjectsService.updateProject(projectId, {
          tasks: updatedTasks,
          completedTasks: updatedTasks.filter(t => t.status === TASK_STATUS.DONE).length,
          totalTasks: updatedTasks.length
        });
      } catch (error) {
        console.error('Error updating task status:', error);
      }
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    
    try {
      const newTaskData = {
        ...newTask,
        id: Date.now().toString(),
        status: TASK_STATUS.TODO,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const updatedTasks = {
        ...tasks,
        [TASK_STATUS.TODO]: [...tasks[TASK_STATUS.TODO], newTaskData]
      };

      const allTasks = Object.values(updatedTasks).flat();

      await ProjectsService.updateProject(projectId, {
        tasks: allTasks,
        totalTasks: allTasks.length,
        completedTasks: allTasks.filter(t => t.status === TASK_STATUS.DONE).length
      });

      setTasks(updatedTasks);
      setShowNewTaskModal(false);
      setNewTask({
        title: '',
        description: '',
        assignee: '',
        dueDate: '',
        estimatedHours: ''
      });
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  if (!project) {
    return <div className="loading">Loading project...</div>;
  }

  return (
    <div className="project-dashboard">
      <header className="project-dashboard__header">
        <h1>{project.title}</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowNewTaskModal(true)}
        >
          <FiPlus /> Add Task
        </button>
      </header>

      <div className="project-dashboard__stats">
        <div className="stat-card">
          <div className="stat-icon">
            <FiUser />
          </div>
          <div className="stat-info">
            <h3>{project.currentVolunteers}/{project.maxVolunteers}</h3>
            <p>Volunteers</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FiCalendar />
          </div>
          <div className="stat-info">
            <h3>{tasks[TASK_STATUS.DONE].length}/{Object.values(tasks).flat().length}</h3>
            <p>Tasks Completed</p>
          </div>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="project-dashboard__board">
          {Object.keys(tasks).map(status => (
            <div key={status} className="board-column">
              <h2 className="board-column__title">
                {status}
                <span className="board-column__count">
                  {tasks[status].length}
                </span>
              </h2>
              <Droppable droppableId={status}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="board-column__content"
                  >
                    {tasks[status].map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="task-card"
                          >
                            <h3 className="task-card__title">{task.title}</h3>
                            <p className="task-card__description">
                              {task.description}
                            </p>
                            <div className="task-card__meta">
                              {task.assignee && (
                                <div className="task-card__assignee">
                                  <FiUser />
                                  {task.assignee}
                                </div>
                              )}
                              {task.dueDate && (
                                <div className="task-card__due-date">
                                  <FiCalendar />
                                  {new Date(task.dueDate).toLocaleDateString()}
                                </div>
                              )}
                              {task.estimatedHours && (
                                <div className="task-card__hours">
                                  <FiClock />
                                  {task.estimatedHours}h
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      {showNewTaskModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Create New Task</h2>
            <form onSubmit={handleCreateTask}>
              <div className="form-group">
                <label htmlFor="title">Title *</label>
                <input
                  type="text"
                  id="title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="assignee">Assignee</label>
                  <input
                    type="text"
                    id="assignee"
                    value={newTask.assignee}
                    onChange={(e) => setNewTask({...newTask, assignee: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="dueDate">Due Date</label>
                  <input
                    type="date"
                    id="dueDate"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="estimatedHours">Estimated Hours</label>
                  <input
                    type="number"
                    id="estimatedHours"
                    value={newTask.estimatedHours}
                    onChange={(e) => setNewTask({...newTask, estimatedHours: e.target.value})}
                  />
                </div>
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowNewTaskModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDashboard; 