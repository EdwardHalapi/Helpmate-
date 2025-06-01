import "./VolunteerDashboard.css";
import "../../styles/variables.css";
import "../../styles/globals.css";
import "../../styles/typography.css";
import "../../styles/components.css";
import { volunteerService } from "../../services/api/volunteers.js";
import projectsService from "../../services/api/projects.js";
import { tasksService } from "../../services/api/tasks.js";
import Header from "../../components/layout/Header/Header.jsx";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { ArrowRight, ChevronRight, Calendar, MapPin, Users, Heart, Clock, CheckCircle2, Edit2 } from "lucide-react";
import { toast } from 'react-hot-toast';

const formatDate = (date) => {
  if (!date) return 'Data nedefinită';
  try {
    if (typeof date === 'string') {
      return new Date(date).toLocaleDateString('ro-RO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    if (date instanceof Date) {
      return date.toLocaleDateString('ro-RO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    return 'Data nedefinită';
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Data nedefinită';
  }
};

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();
  
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Activ":
        return "badge-success";
      case "Planificat":
        return "badge-warning";
      case "Finalizat":
        return "badge-info";
      default:
        return "badge-warning";
    }
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case "Ridicată":
        return "badge-danger";
      case "Medie":
        return "badge-warning";
      case "Scăzută":
        return "badge-info";
      default:
        return "badge-warning";
    }
  };

  return (
    <div className="project-card" onClick={() => navigate(`/proiecte/${project.id}`)}>
      <div className="project-header">
        <div className="project-title-section">
          <h3>{project.title}</h3>
          <div className="badge-container">
            <span className={`badge ${getStatusBadgeClass(project.status)}`}>
              {project.status}
            </span>
            <span className={`badge ${getPriorityBadgeClass(project.priority)}`}>
              {project.priority}
            </span>
          </div>
        </div>
        <ChevronRight />
      </div>
      <p className="project-desc">{project.description}</p>
      <div className="project-meta">
        <span className="meta-item">
          <MapPin size={16} />
          {project.location}
        </span>
        <span className="meta-item">
          <Calendar size={16} />
          {formatDate(project.startDate)}
        </span>
        <span className="meta-item">
          <Users size={16} />
          {project.currentVolunteers}/{project.maxVolunteers} voluntari
        </span>
      </div>
    </div>
  );
};

const ApplicationItem = ({ project }) => {
  const navigate = useNavigate();
  
  return (
    <div 
      className="application-item" 
      onClick={() => navigate(`/proiecte/${project.id}`)}
    >
      <div className="application-info">
        <span className="application-title">{project.title}</span>
        <span className="application-meta">
          <MapPin size={14} /> {project.location} • 
          <Calendar size={14} /> {formatDate(project.startDate)}
        </span>
      </div>
      <span className="application-status">În așteptare</span>
    </div>
  );
};

const TaskCard = ({ task, onStatusChange, onLogHours }) => {
  const [isLoggingHours, setIsLoggingHours] = useState(false);
  const [newHours, setNewHours] = useState('');
  
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Nou":
        return "badge-info";
      case "În Progres":
        return "badge-warning";
      case "Finalizat":
        return "badge-success";
      case "Blocat":
        return "badge-danger";
      default:
        return "badge-info";
    }
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case "Ridicată":
        return "badge-danger";
      case "Medie":
        return "badge-warning";
      case "Scăzută":
        return "badge-info";
      default:
        return "badge-warning";
    }
  };

  const handleHoursSubmit = (e) => {
    e.preventDefault();
    if (newHours && !isNaN(newHours)) {
      onLogHours(task.id, Number(newHours));
      setIsLoggingHours(false);
      setNewHours('');
    }
  };

  return (
    <div className="task-list-item">
      <div className="task-main-info">
        <div className="task-header">
          <h3>{task.title}</h3>
          <div className="badge-container">
            <span className={`badge ${getStatusBadgeClass(task.status)}`}>
              {task.status}
            </span>
            <span className={`badge ${getPriorityBadgeClass(task.priority)}`}>
              {task.priority}
            </span>
          </div>
        </div>
        <p className="task-desc">{task.description}</p>
      </div>

      <div className="task-meta">
        <div className="task-stats">
          <span className="meta-item">
            <Clock size={16} />
            Estimat: {task.estimatedHours}h
          </span>
          <span className="meta-item">
            <CheckCircle2 size={16} />
            Lucrat: {task.actualHours}h
          </span>
          <span className="meta-item">
            <Calendar size={16} />
            {formatDate(task.dueDate)}
          </span>
        </div>

        <div className="task-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ 
                width: `${Math.min(100, (task.actualHours / task.estimatedHours) * 100)}%` 
              }}
            ></div>
          </div>
        </div>

        <div className="task-actions">
          {isLoggingHours ? (
            <form onSubmit={handleHoursSubmit} className="log-hours-form">
              <input
                type="number"
                min="0"
                step="0.5"
                value={newHours}
                onChange={(e) => setNewHours(e.target.value)}
                placeholder="Ore lucrate"
                className="hours-input"
              />
              <button type="submit" className="btn btn-primary btn-sm">
                Salvează
              </button>
              <button 
                type="button" 
                className="btn btn-secondary btn-sm"
                onClick={() => setIsLoggingHours(false)}
              >
                Anulează
              </button>
            </form>
          ) : (
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => setIsLoggingHours(true)}
            >
              <Edit2 size={14} />
              Loghează Ore
            </button>
          )}

          <select
            className="status-select"
            value={task.status}
            onChange={(e) => onStatusChange(task.id, e.target.value)}
          >
            <option value="Nou">De făcut</option>
            <option value="În Progres">În progres</option>
            <option value="Finalizat">Finalizat</option>
            <option value="Blocat">Blocat</option>
          </select>
        </div>
      </div>
    </div>
  );
};

const EmptyState = ({ message }) => (
  <div className="empty-state">
    <p className="text-lg text-secondary">{message}</p>
    <Link to="/proiecte" className="btn btn-primary">
      Explorează Proiecte
      <ArrowRight size={18} />
    </Link>
  </div>
);

const VolunteerDashboard = () => {
  const [activeTab, setActiveTab] = useState("tasks");
  const [userProjects, setUserProjects] = useState([]);
  const [pendingProjects, setPendingProjects] = useState([]);
  const [userTasks, setUserTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: authUser } = useAuth();
  const navigate = useNavigate();

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const task = userTasks.find(t => t.id === taskId);
      if (!task) return;

      await tasksService.updateTaskStatus(taskId, newStatus);
      
      // Update local state
      setUserTasks(tasks => 
        tasks.map(t => 
          t.id === taskId ? { ...t, status: newStatus } : t
        )
      );

      // Update project progress if task is completed
      if (task.projectId && (newStatus === 'Finalizat' || task.status === 'Finalizat')) {
        const projectTasks = userTasks.filter(t => t.projectId === task.projectId);
        const completedTasks = projectTasks.filter(t => t.status === 'Finalizat').length;
        await projectsService.updateProjectProgress(task.projectId, completedTasks);
      }

      toast.success("Status actualizat cu succes!");
    } catch (error) {
      console.error("Error updating task status:", error);
      toast.error("Nu s-a putut actualiza statusul");
    }
  };

  const handleLogHours = async (taskId, hours) => {
    try {
      const task = userTasks.find(t => t.id === taskId);
      if (!task) return;

      await tasksService.logHours(taskId, hours);
      
      // Update local state
      setUserTasks(tasks => 
        tasks.map(t => 
          t.id === taskId ? { ...t, actualHours: hours } : t
        )
      );

      // Update project total hours
      if (task.projectId) {
        const hoursDiff = hours - (task.actualHours || 0);
        await projectsService.addHoursToProject(task.projectId, hoursDiff);
      }

      toast.success("Ore înregistrate cu succes!");
    } catch (error) {
      console.error("Error logging hours:", error);
      toast.error("Nu s-au putut înregistra orele");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      if (!authUser) {
        navigate('/');
        return;
      }

      try {
        setLoading(true);
        const [volunteer, tasks] = await Promise.all([
          volunteerService.getById(authUser.uid),
          tasksService.getTasksByVolunteerId(authUser.uid)
        ]);
        
        setUserTasks(tasks);
        
        if (volunteer?.projects?.length) {
          const projectsData = await Promise.all(
            volunteer.projects.map(projectId => 
              projectsService.getProjectById(projectId)
            )
          );
          setUserProjects(projectsData.filter(p => p !== null));
        }

        if (volunteer?.pending?.length) {
          const pendingData = await Promise.all(
            volunteer.pending.map(projectId => 
              projectsService.getProjectById(projectId)
            )
          );
          setPendingProjects(pendingData.filter(p => p !== null));
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Nu s-au putut încărca datele");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [authUser, navigate]);

  if (loading) {
    return (
      <div className="dashboard-container">
        <Header />
        <div className="dashboard-content">
          <div className="loading">
            <div className="spinner"></div>
            <p>Se încarcă datele...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Header />
      <div className="dashboard-content">
        <div className="tabs">
          <button 
            className={`tab ${activeTab === "tasks" ? "active" : ""}`}
            onClick={() => setActiveTab("tasks")}
          >
            Task-urile Mele
          </button>
          <button 
            className={`tab ${activeTab === "projects" ? "active" : ""}`}
            onClick={() => setActiveTab("projects")}
          >
            Proiectele Mele
          </button>
          <button 
            className={`tab ${activeTab === "applications" ? "active" : ""}`}
            onClick={() => setActiveTab("applications")}
          >
            Aplicații în Așteptare
          </button>
        </div>

        <div className="tab-content">
          {activeTab === "tasks" && (
            <section className="section">
              {userTasks.length > 0 ? (
                <div className="tasks-list">
                  {userTasks.map(task => (
                    <TaskCard 
                      key={task.id} 
                      task={task}
                      onStatusChange={handleStatusChange}
                      onLogHours={handleLogHours}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState message="Nu ai niciun task momentan" />
              )}
            </section>
          )}

          {activeTab === "projects" && (
            <section className="section">
              {userProjects.length > 0 ? (
                <div className="projects-grid">
                  {userProjects.map(project => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              ) : (
                <EmptyState message="Nu ai niciun proiect activ momentan" />
              )}
            </section>
          )}

          {activeTab === "applications" && (
            <section className="section">
              {pendingProjects.length > 0 ? (
                <div className="applications-list">
                  {pendingProjects.map(project => (
                    <ApplicationItem key={project.id} project={project} />
                  ))}
                </div>
              ) : (
                <EmptyState message="Nu ai nicio aplicație în așteptare" />
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default VolunteerDashboard;
