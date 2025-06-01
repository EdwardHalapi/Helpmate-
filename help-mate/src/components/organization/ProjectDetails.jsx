import React, { useState } from 'react';
import { 
  Users, Star, MessageSquare, ClipboardList, UserPlus, 
  CheckCircle, XCircle, ChevronRight, Plus, Edit2, X, ClockIcon, CheckSquare
} from 'lucide-react';
import './ProjectDetails.css';

const RatingModal = ({ isOpen, onClose, volunteer, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content rating-modal">
        <div className="modal-header">
          <h2>Evaluează Voluntar</h2>
          <button className="close-button" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        <div className="modal-body">
          <p>Evaluează activitatea lui {volunteer.name}</p>
          <div className="rating-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={32}
                className={`star ${star <= (hover || rating) ? 'filled' : ''}`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(rating)}
              />
            ))}
          </div>
        </div>
        <div className="form-actions">
          <button className="btn-cancel" onClick={onClose}>
            Anulează
          </button>
          <button 
            className="btn-submit"
            onClick={() => {
              onSubmit(rating);
              onClose();
            }}
            disabled={!rating}
          >
            Salvează Evaluarea
          </button>
        </div>
      </div>
    </div>
  );
};

const FeedbackModal = ({ isOpen, onClose, volunteer, onSubmit }) => {
  const [feedback, setFeedback] = useState('');

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content feedback-modal">
        <div className="modal-header">
          <h2>Oferă Feedback</h2>
          <button className="close-button" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        <div className="modal-body">
          <p>Oferă feedback pentru {volunteer.name}</p>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Scrie feedback-ul tău aici..."
            rows={4}
            className="feedback-textarea"
          />
        </div>
        <div className="form-actions">
          <button className="btn-cancel" onClick={onClose}>
            Anulează
          </button>
          <button 
            className="btn-submit"
            onClick={() => {
              onSubmit(feedback);
              onClose();
            }}
            disabled={!feedback.trim()}
          >
            Trimite Feedback
          </button>
        </div>
      </div>
    </div>
  );
};

const AddTaskModal = ({ isOpen, onClose, onSubmit }) => {
  const [taskData, setTaskData] = useState({
    title: '',
    assignedTo: '',
    dueDate: '',
    description: ''
  });

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Adaugă Task Nou</h2>
          <button className="close-button" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label htmlFor="title">Titlu*</label>
            <input
              type="text"
              id="title"
              value={taskData.title}
              onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
              placeholder="Introdu titlul task-ului"
            />
          </div>
          <div className="form-group">
            <label htmlFor="assignedTo">Asignat*</label>
            <input
              type="text"
              id="assignedTo"
              value={taskData.assignedTo}
              onChange={(e) => setTaskData({ ...taskData, assignedTo: e.target.value })}
              placeholder="Numele voluntarului"
            />
          </div>
          <div className="form-group">
            <label htmlFor="dueDate">Termen limită*</label>
            <input
              type="date"
              id="dueDate"
              value={taskData.dueDate}
              onChange={(e) => setTaskData({ ...taskData, dueDate: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Descriere</label>
            <textarea
              id="description"
              value={taskData.description}
              onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
              placeholder="Descriere detaliată a task-ului..."
              rows={4}
            />
          </div>
        </div>
        <div className="form-actions">
          <button className="btn-cancel" onClick={onClose}>
            Anulează
          </button>
          <button 
            className="btn-submit"
            onClick={() => {
              if (taskData.title && taskData.assignedTo && taskData.dueDate) {
                onSubmit(taskData);
                onClose();
              }
            }}
            disabled={!taskData.title || !taskData.assignedTo || !taskData.dueDate}
          >
            Adaugă Task
          </button>
        </div>
      </div>
    </div>
  );
};

const EditTaskModal = ({ isOpen, onClose, task, onSubmit }) => {
  const [taskData, setTaskData] = useState(task || {
    title: '',
    assignedTo: '',
    dueDate: '',
    description: '',
    status: 'În progres'
  });

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Editează Task</h2>
          <button className="close-button" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label htmlFor="title">Titlu*</label>
            <input
              type="text"
              id="title"
              value={taskData.title}
              onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="assignedTo">Asignat*</label>
            <input
              type="text"
              id="assignedTo"
              value={taskData.assignedTo}
              onChange={(e) => setTaskData({ ...taskData, assignedTo: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="dueDate">Termen limită*</label>
            <input
              type="date"
              id="dueDate"
              value={taskData.dueDate}
              onChange={(e) => setTaskData({ ...taskData, dueDate: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              value={taskData.status}
              onChange={(e) => setTaskData({ ...taskData, status: e.target.value })}
            >
              <option value="În progres">În progres</option>
              <option value="Finalizat">Finalizat</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="description">Descriere</label>
            <textarea
              id="description"
              value={taskData.description}
              onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
              rows={4}
            />
          </div>
        </div>
        <div className="form-actions">
          <button className="btn-cancel" onClick={onClose}>
            Anulează
          </button>
          <button 
            className="btn-submit"
            onClick={() => {
              if (taskData.title && taskData.assignedTo && taskData.dueDate) {
                onSubmit(taskData);
                onClose();
              }
            }}
            disabled={!taskData.title || !taskData.assignedTo || !taskData.dueDate}
          >
            Salvează Modificările
          </button>
        </div>
      </div>
    </div>
  );
};

const ProjectDetails = ({ project, onClose }) => {
  const [activeTab, setActiveTab] = useState('volunteers');
  const [showAddTask, setShowAddTask] = useState(false);
  const [showEditTask, setShowEditTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  
  const [volunteers, setVolunteers] = useState([
    {
      id: 1,
      name: "Maria Popescu",
      role: "Coordonator",
      rating: 4.8,
      hours: 24,
      tasks: 5,
      avatar: "MP"
    },
    {
      id: 2,
      name: "Ion Ionescu",
      role: "Voluntar",
      rating: 4.5,
      hours: 12,
      tasks: 3,
      avatar: "II"
    }
  ]);

  const [pendingRequests, setPendingRequests] = useState([
    {
      id: 1,
      name: "Ana Marinescu",
      message: "Aș dori să mă implic în acest proiect deoarece...",
      experience: "2 ani experiență în proiecte similare",
      avatar: "AM"
    }
  ]);

  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Organizare echipe de lucru",
      assignedTo: "Maria Popescu",
      status: "În progres",
      dueDate: "2024-03-20",
      description: "Organizarea și împărțirea echipelor pentru diferite zone de lucru."
    },
    {
      id: 2,
      title: "Pregătire materiale",
      assignedTo: "Ion Ionescu",
      status: "Finalizat",
      dueDate: "2024-03-15",
      description: "Pregătirea materialelor necesare pentru activitate."
    }
  ]);

  const handleUpdateVolunteerRole = (volunteerId, newRole) => {
    setVolunteers(volunteers.map(volunteer =>
      volunteer.id === volunteerId
        ? { ...volunteer, role: newRole }
        : volunteer
    ));
  };

  const handleRateVolunteer = (volunteerId, rating) => {
    setVolunteers(volunteers.map(volunteer =>
      volunteer.id === volunteerId
        ? { ...volunteer, rating }
        : volunteer
    ));
  };

  const handleAddFeedback = (volunteerId, feedback) => {
    console.log(`Feedback pentru voluntarul ${volunteerId}:`, feedback);
  };

  const handleAcceptRequest = (requestId) => {
    const request = pendingRequests.find(r => r.id === requestId);
    if (request) {
      setVolunteers([...volunteers, {
        id: volunteers.length + 1,
        name: request.name,
        role: "Voluntar",
        rating: 0,
        hours: 0,
        tasks: 0,
        avatar: request.avatar
      }]);
      
      setPendingRequests(pendingRequests.filter(r => r.id !== requestId));
    }
  };

  const handleRejectRequest = (requestId) => {
    setPendingRequests(pendingRequests.filter(r => r.id !== requestId));
  };

  const handleAddTask = (taskData) => {
    const newTask = {
      id: tasks.length + 1,
      ...taskData,
      status: "În progres"
    };
    setTasks([...tasks, newTask]);
  };

  const handleEditTask = (taskData) => {
    setTasks(tasks.map(task =>
      task.id === taskData.id ? taskData : task
    ));
  };

  return (
    <div className="project-details-container">
      <div className="project-details-header">
        <div className="project-details-title">
          <h2>{project.title}</h2>
          <span className={`status-badge ${project.status[0].toLowerCase()}`}>
            {project.status[0]}
          </span>
        </div>
        <button className="close-button" onClick={onClose}>
          <X size={24} />
        </button>
      </div>

      <div className="project-details-tabs">
        <button 
          className={`tab-button ${activeTab === 'volunteers' ? 'active' : ''}`}
          onClick={() => setActiveTab('volunteers')}
        >
          <Users size={20} />
          Voluntari ({volunteers.length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('requests')}
        >
          <UserPlus size={20} />
          Cereri ({pendingRequests.length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'tasks' ? 'active' : ''}`}
          onClick={() => setActiveTab('tasks')}
        >
          <ClipboardList size={20} />
          Task-uri ({tasks.length})
        </button>
      </div>

      <div className="project-details-content">
        {activeTab === 'volunteers' && (
          <div className="volunteers-section">
            {volunteers.map(volunteer => (
              <div key={volunteer.id} className="volunteer-card">
                <div className="volunteer-info">
                  <div className="volunteer-avatar">{volunteer.avatar}</div>
                  <div className="volunteer-details">
                    <h3>{volunteer.name}</h3>
                    <div className="volunteer-meta">
                      <select
                        value={volunteer.role}
                        onChange={(e) => handleUpdateVolunteerRole(volunteer.id, e.target.value)}
                        className="role-select"
                      >
                        <option value="Coordonator">Coordonator</option>
                        <option value="Voluntar">Voluntar</option>
                        <option value="Mentor">Mentor</option>
                      </select>
                      <span className="volunteer-stats rating">
                        <Star size={16} /> {volunteer.rating.toFixed(1)}
                      </span>
                      <span className="volunteer-stats hours">
                        <ClockIcon size={16} /> {volunteer.hours} ore
                      </span>
                      <span className="volunteer-stats tasks">
                        <CheckSquare size={16} /> {volunteer.tasks} task-uri
                      </span>
                    </div>
                  </div>
                </div>
                <div className="volunteer-actions">
                  <button 
                    className="action-button" 
                    onClick={() => {
                      setSelectedVolunteer(volunteer);
                      setShowRatingModal(true);
                    }}
                  >
                    <Star size={16} />
                    Evaluează
                  </button>
                  <button 
                    className="action-button"
                    onClick={() => {
                      setSelectedVolunteer(volunteer);
                      setShowFeedbackModal(true);
                    }}
                  >
                    <MessageSquare size={16} />
                    Feedback
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="requests-section">
            {pendingRequests.map(request => (
              <div key={request.id} className="request-card">
                <div className="request-info">
                  <div className="request-avatar">{request.avatar}</div>
                  <div className="request-details">
                    <h3>{request.name}</h3>
                    <p>{request.message}</p>
                    <span className="experience-tag">{request.experience}</span>
                  </div>
                </div>
                <div className="request-actions">
                  <button 
                    className="action-button accept"
                    onClick={() => handleAcceptRequest(request.id)}
                  >
                    <CheckCircle size={16} />
                    Acceptă
                  </button>
                  <button 
                    className="action-button reject"
                    onClick={() => handleRejectRequest(request.id)}
                  >
                    <XCircle size={16} />
                    Respinge
                  </button>
                </div>
              </div>
            ))}
            {pendingRequests.length === 0 && (
              <div className="empty-state">
                <p>Nu există cereri de participare în așteptare.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="tasks-section">
            <div className="tasks-header">
              <h3>Task-uri</h3>
              <button 
                className="add-task-button"
                onClick={() => setShowAddTask(true)}
              >
                <Plus size={16} />
                Adaugă Task
              </button>
            </div>
            <div className="tasks-list">
              {tasks.map(task => (
                <div key={task.id} className="task-card">
                  <div className="task-info">
                    <h4>{task.title}</h4>
                    <div className="task-meta">
                      <span>Asignat: {task.assignedTo}</span>
                      <span>Termen: {task.dueDate}</span>
                      <span className={`task-status ${task.status.toLowerCase().replace(' ', '-')}`}>
                        {task.status}
                      </span>
                    </div>
                  </div>
                  <button 
                    className="edit-task-button"
                    onClick={() => {
                      setSelectedTask(task);
                      setShowEditTask(true);
                    }}
                  >
                    <Edit2 size={16} />
                  </button>
                </div>
              ))}
              {tasks.length === 0 && (
                <div className="empty-state">
                  <p>Nu există task-uri create încă.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {showRatingModal && selectedVolunteer && (
        <RatingModal
          isOpen={showRatingModal}
          onClose={() => {
            setShowRatingModal(false);
            setSelectedVolunteer(null);
          }}
          volunteer={selectedVolunteer}
          onSubmit={(rating) => handleRateVolunteer(selectedVolunteer.id, rating)}
        />
      )}

      {showFeedbackModal && selectedVolunteer && (
        <FeedbackModal
          isOpen={showFeedbackModal}
          onClose={() => {
            setShowFeedbackModal(false);
            setSelectedVolunteer(null);
          }}
          volunteer={selectedVolunteer}
          onSubmit={(feedback) => handleAddFeedback(selectedVolunteer.id, feedback)}
        />
      )}

      {showAddTask && (
        <AddTaskModal
          isOpen={showAddTask}
          onClose={() => setShowAddTask(false)}
          onSubmit={handleAddTask}
        />
      )}

      {showEditTask && selectedTask && (
        <EditTaskModal
          isOpen={showEditTask}
          onClose={() => {
            setShowEditTask(false);
            setSelectedTask(null);
          }}
          task={selectedTask}
          onSubmit={handleEditTask}
        />
      )}
    </div>
  );
};

export default ProjectDetails; 