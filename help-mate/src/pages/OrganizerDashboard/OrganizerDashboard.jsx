import "./OrganizerDashboard.css";
import "../../styles/variables.css";
import "../../styles/globals.css";
import "../../styles/typography.css";
import "../../styles/components.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { organizationsService } from "../../services/api/organizations";
import projectsService from "../../services/api/projects";
import { tasksService } from "../../services/api/tasks.js";
import { volunteerService } from "../../services/api/volunteers";
import Header from "../../components/layout/Header/Header.jsx";
import OrganizerProjectCard from "../../components/OrganizerProjectCard/OrganizerProjectCard";
import { toast } from "react-hot-toast";
import {
  Plus,
  Search,
  Users,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  BarChart2,
  Filter
} from "lucide-react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../services/firebase/config";

const ProjectForm = ({ onSubmit, onCancel, initialData = null }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "Planificat",
    priority: "Medie",
    startDate: "",
    endDate: "",
    maxVolunteers: 1,
    location: "",
    requiredSkills: [],
    coordinates: { lat: null, lng: null },
    ...initialData
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Titlul este obligatoriu";
    if (!formData.description.trim()) newErrors.description = "Descrierea este obligatorie";
    if (!formData.startDate) newErrors.startDate = "Data de început este obligatorie";
    if (!formData.endDate) newErrors.endDate = "Data de sfârșit este obligatorie";
    if (formData.maxVolunteers < 1) newErrors.maxVolunteers = "Numărul de voluntari trebuie să fie cel puțin 1";
    if (!formData.location.trim()) newErrors.location = "Locația este obligatorie";
    
    // Check if end date is after start date
    if (formData.startDate && formData.endDate && new Date(formData.endDate) <= new Date(formData.startDate)) {
      newErrors.endDate = "Data de sfârșit trebuie să fie după data de început";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleSkillsChange = (e) => {
    const skills = e.target.value.split(",").map(skill => skill.trim()).filter(Boolean);
    setFormData({ ...formData, requiredSkills: skills });
  };

  return (
    <form onSubmit={handleSubmit} className="project-form">
      <div className="form-group">
        <label htmlFor="title">Titlu Proiect *</label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className={errors.title ? "error" : ""}
        />
        {errors.title && <span className="error-message">{errors.title}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="description">Descriere *</label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className={errors.description ? "error" : ""}
          rows={4}
        />
        {errors.description && <span className="error-message">{errors.description}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          >
            <option value="Planificat">Planificat</option>
            <option value="Activ">Activ</option>
            <option value="Finalizat">Finalizat</option>
            <option value="Anulat">Anulat</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="priority">Prioritate</label>
          <select
            id="priority"
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
          >
            <option value="Scăzută">Scăzută</option>
            <option value="Medie">Medie</option>
            <option value="Ridicată">Ridicată</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="startDate">Data Început *</label>
          <input
            type="date"
            id="startDate"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            className={errors.startDate ? "error" : ""}
          />
          {errors.startDate && <span className="error-message">{errors.startDate}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="endDate">Data Sfârșit *</label>
          <input
            type="date"
            id="endDate"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            className={errors.endDate ? "error" : ""}
          />
          {errors.endDate && <span className="error-message">{errors.endDate}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="maxVolunteers">Număr Maxim Voluntari *</label>
          <input
            type="number"
            id="maxVolunteers"
            min="1"
            value={formData.maxVolunteers}
            onChange={(e) => setFormData({ ...formData, maxVolunteers: parseInt(e.target.value) })}
            className={errors.maxVolunteers ? "error" : ""}
          />
          {errors.maxVolunteers && <span className="error-message">{errors.maxVolunteers}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="location">Locație *</label>
          <input
            type="text"
            id="location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className={errors.location ? "error" : ""}
          />
          {errors.location && <span className="error-message">{errors.location}</span>}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="skills">Abilități Necesare (separate prin virgulă)</label>
        <input
          type="text"
          id="skills"
          value={formData.requiredSkills.join(", ")}
          onChange={handleSkillsChange}
          placeholder="Ex: Comunicare, Leadership, Social Media"
        />
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Anulează
        </button>
        <button type="submit" className="btn btn-primary">
          {initialData ? "Actualizează" : "Creează"} Proiect
        </button>
      </div>
    </form>
  );
};

const TaskForm = ({ onSubmit, onCancel, volunteers, initialData = null }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "De făcut",
    priority: "Medie",
    assignedVolunteerId: "",
    estimatedHours: 1,
    dueDate: "",
    ...initialData
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Titlul este obligatoriu";
    if (!formData.description.trim()) newErrors.description = "Descrierea este obligatorie";
    if (!formData.dueDate) newErrors.dueDate = "Data limită este obligatorie";
    if (formData.estimatedHours < 1) newErrors.estimatedHours = "Numărul de ore estimate trebuie să fie cel puțin 1";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <div className="form-group">
        <label htmlFor="title">Titlu Task *</label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className={errors.title ? "error" : ""}
        />
        {errors.title && <span className="error-message">{errors.title}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="description">Descriere *</label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className={errors.description ? "error" : ""}
          rows={4}
        />
        {errors.description && <span className="error-message">{errors.description}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          >
            <option value="De făcut">De făcut</option>
            <option value="În progres">În progres</option>
            <option value="Finalizat">Finalizat</option>
            <option value="Blocat">Blocat</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="priority">Prioritate</label>
          <select
            id="priority"
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
          >
            <option value="Scăzută">Scăzută</option>
            <option value="Medie">Medie</option>
            <option value="Ridicată">Ridicată</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="assignedVolunteerId">Asignează Voluntar</label>
          <select
            id="assignedVolunteerId"
            value={formData.assignedVolunteerId}
            onChange={(e) => setFormData({ ...formData, assignedVolunteerId: e.target.value })}
          >
            <option value="">Selectează voluntar</option>
            {volunteers.map(volunteer => (
              <option key={volunteer.id} value={volunteer.id}>
                {volunteer.firstName} {volunteer.lastName}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="estimatedHours">Ore Estimate *</label>
          <input
            type="number"
            id="estimatedHours"
            min="1"
            value={formData.estimatedHours}
            onChange={(e) => setFormData({ ...formData, estimatedHours: parseInt(e.target.value) })}
            className={errors.estimatedHours ? "error" : ""}
          />
          {errors.estimatedHours && <span className="error-message">{errors.estimatedHours}</span>}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="dueDate">Data Limită *</label>
        <input
          type="date"
          id="dueDate"
          value={formData.dueDate}
          onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          className={errors.dueDate ? "error" : ""}
        />
        {errors.dueDate && <span className="error-message">{errors.dueDate}</span>}
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Anulează
        </button>
        <button type="submit" className="btn btn-primary">
          {initialData ? "Actualizează" : "Creează"} Task
        </button>
      </div>
    </form>
  );
};

const OrganizerDashboard = () => {
  const [organization, setOrganization] = useState(null);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { user: authUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      if (!authUser) {
        navigate('/');
        return;
      }

      try {
        setLoading(true);
        
        // Load organization
        const org = await organizationsService.getByOrganizerId(authUser.uid);
        if (!org) {
          // Create organization if it doesn't exist
          await organizationsService.create({
            name: "My Organization",
            description: "Organization description",
            organizerId: authUser.uid,
            email: authUser.email
          });
          const newOrg = await organizationsService.getByOrganizerId(authUser.uid);
          setOrganization(newOrg);
        } else {
          setOrganization(org);
        }

        // Load projects
        const projectsList = await projectsService.getProjectsByOrganizerId(authUser.uid);
        setProjects(projectsList);

        // Load tasks for all projects
        const allTasks = [];
        for (const project of projectsList) {
          const projectTasks = await tasksService.getTasksByProjectId(project.id);
          allTasks.push(...projectTasks);
        }
        setTasks(allTasks);

        // Load volunteers
        const volunteersList = await volunteerService.getAll();
        setVolunteers(volunteersList);

      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Nu s-au putut încărca datele");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [authUser, navigate]);

  const handleCreateProject = async (projectData) => {
    try {
      // Create project data object
      const newProject = {
        title: projectData.title,
        description: projectData.description,
        organizerId: authUser.uid,
        managerId: authUser.uid,
        status: projectData.status || "Planificat",
        priority: projectData.priority || "Medie",
        startDate: new Date(projectData.startDate).toISOString(),
        endDate: new Date(projectData.endDate).toISOString(),
        maxVolunteers: parseInt(projectData.maxVolunteers),
        location: projectData.location,
        requiredSkills: projectData.requiredSkills || [],
        currentVolunteers: 0,
        totalHours: 0,
        completedTasks: 0,
        totalTasks: 0,
        pendingVolunteers: [],
        tasks: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      console.log('Creating project with data:', newProject);

      // Create project in Firestore
      const projectId = await projectsService.createProject(newProject);
      console.log('Created project with ID:', projectId);

      // Update organization's projects count
      if (organization?.id) {
        await organizationsService.incrementProjectCount(organization.id);
      }
      
      // Get the created project with its ID
      const createdProject = await projectsService.getProjectById(projectId);
      console.log('Fetched created project:', createdProject);
      
      // Update local state
      setProjects(prevProjects => [createdProject, ...prevProjects]);
      
      // Close the form modal
      setShowProjectForm(false);
      
      // Show success message
      toast.success("Proiect creat cu succes!");

      // Return to projects list
      setSelectedProject(null);
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error(error.message || "Nu s-a putut crea proiectul");
    }
  };

  const handleCreateTask = async (taskData) => {
    if (!selectedProject) return;

    try {
      // Create task data object
      const newTask = {
        ...taskData,
        projectId: selectedProject.id,
        organizationId: organization.id,
        createdBy: authUser.uid,
        status: taskData.status || "De făcut",
        priority: taskData.priority || "Medie",
        progress: 0,
        loggedHours: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Create task in Firestore
      const taskId = await tasksService.createTask(newTask);

      // Update project's task count
      await projectsService.updateProject(selectedProject.id, {
        totalTasks: selectedProject.totalTasks + 1,
        updatedAt: new Date().toISOString()
      });

      // If task is assigned to a volunteer, update their tasks list
      if (taskData.assignedVolunteerId) {
        const volunteerRef = doc(db, 'volunteers', taskData.assignedVolunteerId);
        const volunteerDoc = await getDoc(volunteerRef);
        
        if (volunteerDoc.exists()) {
          const volunteerData = volunteerDoc.data();
          await updateDoc(volunteerRef, {
            tasks: [...(volunteerData.tasks || []), taskId],
            updatedAt: new Date().toISOString()
          });
        }
      }

      // Get the created task with its ID
      const createdTask = await tasksService.getTaskById(taskId);
      
      // Update local state
      setTasks(prevTasks => [createdTask, ...prevTasks]);
      
      // Close the form modal
      setShowTaskForm(false);
      
      // Show success message
      toast.success("Task creat cu succes!");
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error(error.message || "Nu s-a putut crea task-ul");
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      await projectsService.deleteProject(projectId);
      setProjects(projects.filter(p => p.id !== projectId));
      toast.success("Proiect șters cu succes!");
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Nu s-a putut șterge proiectul");
    }
  };

  const filteredProjects = projects
    .filter(project => 
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(project => 
      statusFilter === "all" ? true : project.status === statusFilter
    );

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
        <div className="dashboard-header">
          <h1>Dashboard Organizator</h1>
          <div className="dashboard-stats">
            <div className="stat-card">
              <Users size={20} />
              <div className="stat-info">
                <span className="stat-value">{organization.totalVolunteers}</span>
                <span className="stat-label">Voluntari</span>
              </div>
            </div>
            <div className="stat-card">
              <CheckCircle2 size={20} />
              <div className="stat-info">
                <span className="stat-value">{organization.totalProjects}</span>
                <span className="stat-label">Proiecte</span>
              </div>
            </div>
            <div className="stat-card">
              <Clock size={20} />
              <div className="stat-info">
                <span className="stat-value">{organization.totalHours}</span>
                <span className="stat-label">Ore</span>
              </div>
            </div>
          </div>
        </div>

        <div className="projects-section">
          <div className="section-header">
            <h2>Proiecte</h2>
            <div className="section-actions">
              <div className="search-box">
                <Search size={20} />
                <input
                  type="text"
                  placeholder="Caută proiecte..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="filter-box">
                <Filter size={20} />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">Toate</option>
                  <option value="Planificat">Planificate</option>
                  <option value="Activ">Active</option>
                  <option value="Finalizat">Finalizate</option>
                  <option value="Anulat">Anulate</option>
                </select>
              </div>
              <button 
                className="btn btn-primary"
                onClick={() => setShowProjectForm(true)}
              >
                <Plus size={20} />
                Proiect Nou
              </button>
            </div>
          </div>

          {showProjectForm && (
            <div className="modal">
              <div className="modal-content">
                <h2>{selectedProject ? "Editează" : "Creează"} Proiect</h2>
                <ProjectForm
                  onSubmit={handleCreateProject}
                  onCancel={() => setShowProjectForm(false)}
                  initialData={selectedProject}
                />
              </div>
            </div>
          )}

          <div className="projects-grid">
            {filteredProjects.map(project => (
              <OrganizerProjectCard
                key={project.id}
                project={project}
                onDelete={handleDeleteProject}
                onEdit={() => {
                  setSelectedProject(project);
                  setShowProjectForm(true);
                }}
              />
            ))}
          </div>
        </div>

        {showTaskForm && selectedProject && (
          <div className="modal">
            <div className="modal-content">
              <h2>Creează Task Nou</h2>
              <TaskForm
                onSubmit={handleCreateTask}
                onCancel={() => setShowTaskForm(false)}
                volunteers={volunteers}
              />
            </div>
          </div>
        )}

        {selectedProject && (
          <div className="tasks-section">
            <div className="section-header">
              <h2>Task-uri - {selectedProject.title}</h2>
              <button 
                className="btn btn-primary"
                onClick={() => setShowTaskForm(true)}
              >
                <Plus size={20} />
                Task Nou
              </button>
            </div>

            <div className="tasks-board">
              <div className="task-column">
                <h3>De făcut</h3>
                {tasks
                  .filter(task => 
                    task.projectId === selectedProject.id && 
                    task.status === "Nou"
                  )
                  .map(task => (
                    <div key={task.id} className="task-card">
                      <h4>{task.title}</h4>
                      <p>{task.description}</p>
                      <div className="task-meta">
                        <span className="task-priority">{task.priority}</span>
                        <span className="task-hours">{task.estimatedHours}h</span>
                      </div>
                    </div>
                  ))}
              </div>

              <div className="task-column">
                <h3>În Progres</h3>
                {tasks
                  .filter(task => 
                    task.projectId === selectedProject.id && 
                    task.status === "În Progres"
                  )
                  .map(task => (
                    <div key={task.id} className="task-card">
                      <h4>{task.title}</h4>
                      <p>{task.description}</p>
                      <div className="task-meta">
                        <span className="task-priority">{task.priority}</span>
                        <span className="task-hours">{task.estimatedHours}h</span>
                      </div>
                    </div>
                  ))}
              </div>

              <div className="task-column">
                <h3>Finalizate</h3>
                {tasks
                  .filter(task => 
                    task.projectId === selectedProject.id && 
                    task.status === "Finalizat"
                  )
                  .map(task => (
                    <div key={task.id} className="task-card">
                      <h4>{task.title}</h4>
                      <p>{task.description}</p>
                      <div className="task-meta">
                        <span className="task-priority">{task.priority}</span>
                        <span className="task-hours">{task.estimatedHours}h</span>
                      </div>
                    </div>
                  ))}
              </div>

              <div className="task-column">
                <h3>Blocate</h3>
                {tasks
                  .filter(task => 
                    task.projectId === selectedProject.id && 
                    task.status === "Blocat"
                  )
                  .map(task => (
                    <div key={task.id} className="task-card">
                      <h4>{task.title}</h4>
                      <p>{task.description}</p>
                      <div className="task-meta">
                        <span className="task-priority">{task.priority}</span>
                        <span className="task-hours">{task.estimatedHours}h</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizerDashboard; 