import "./VolunteerDashboard.css";
import "../../styles/variables.css";
import "../../styles/globals.css";
import "../../styles/typography.css";
import "../../styles/components.css";
import { volunteerService } from "../../services/api/volunteers.js";
import Header from "../../components/layout/Header/Header.jsx";
import React, { useState, useEffect, useLayoutEffect } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import {
  Search,
  Calendar,
  MapPin,
  Users,
  Star,
  Heart,
  User,
  Building2,
  ChevronRight,
  Filter,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import projectsService from "../../services/api/projects.js";
import { Project } from "../../models/Project.js";
import styles from "../HomeScreen/HomeScreen.module.css";

const TaskCard = ({ title, status, priority, description, meta, progress }) => {
  return (
    <div className="task-card">
      <div className="task-header">
        <span className="task-title">{title}</span>
        <span className="badge badge-blue">{status}</span>
        <span className="badge badge-red">{priority}</span>
      </div>
      <div className="task-desc">{description}</div>
      <div className="task-meta">
        <span className="meta-item">{meta[0]}</span>
        <span className="meta-item">{meta[1]}</span>
        <span className="meta-item">{meta[2]}</span>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: progress + "%" }}></div>
      </div>
      <div className="task-actions">
        <button className="log-hours-btn">+ Loghează ore</button>
        <select className="status-select">
          <option>În progres</option>
          <option>De făcut</option>
          <option>Finalizat</option>
        </select>
      </div>
    </div>
  );
};

const VolunteerDashboard = () => {
  const location = useLocation();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    planned: 0,
    totalVolunteers: 0,
  });
  const [pageSelected, setPageSelected] = useState("task-list");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        const user = await volunteerService.getById("75ytUh3LjYvs5EXF6itS"); // Exemplu de ID
        console.log("Utilizator încărcat:", user);
        setUser(user);
      } catch (error) {
        console.error("Eroare la încărcarea proiectelor:", error);
        setError("Nu s-a putut încărca utilizatorul");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        const projectList = await projectsService.getAllProjects();
        setProjects(projectList);
        setFilteredProjects(projectList);

        // Calculează statisticile
        const newStats = {
          total: projectList.length,
          active: projectList.filter((p) => p.status === "Activ").length,
          planned: projectList.filter((p) => p.status === "Planificat").length,
          totalVolunteers: projectList.reduce(
            (sum, p) => sum + p.currentVolunteers,
            0
          ),
        };
        setStats(newStats);
      } catch (error) {
        console.error("Eroare la încărcarea proiectelor:", error);
        setError("Nu s-au putut încărca proiectele");
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  useEffect(() => {
    let filtered = projects;

    // Filtrare după termen de căutare
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (project) =>
          project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          project.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrare după status
    if (selectedFilter !== "all") {
      filtered = filtered.filter((project) => {
        switch (selectedFilter) {
          case "active":
            return project.status === "Activ";
          case "planned":
            return project.status === "Planificat";
          case "available":
            return (
              project.status === "Activ" &&
              project.currentVolunteers < project.maxVolunteers
            );
          default:
            return true;
        }
      });
    }

    setFilteredProjects(filtered);
  }, [projects, searchTerm, selectedFilter]);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p className="text-lg text-secondary">Încărcăm utilizatorul...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <p className="text-lg text-error">{error}</p>
        <button
          className="btn btn-primary"
          onClick={() => window.location.reload()}
        >
          Încearcă din nou
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <Header
        name={user?.firstName + " " + user?.lastName}
        oreTotale={user?.totalHours || 0}
        taskuriFinalizate={1}
        proiecteActive={user?.totalProjects || 0}
      />

      {/* Tabs */}
      <nav className="dashboard-tabs">
        <button
          className={"tab " + (pageSelected === "task-list" ? "active" : "")}
          onClick={() => setPageSelected("task-list")}
        >
          Task-urile Mele
        </button>
        <button
          className={"tab " + (pageSelected === "proiecte" ? "active" : "")}
          onClick={() => setPageSelected("proiecte")}
        >
          Proiectele Mele
        </button>
        <button
          className={
            "tab " + (pageSelected === "status-aplicatii" ? "active" : "")
          }
          onClick={() => setPageSelected("status-aplicatii")}
        >
          Status Aplicatii
        </button>
      </nav>

      {/* Task List */}
      {pageSelected === "task-list" && (
        <main className="dashboard-main">
          <h2 className="section-title">Task-urile Mele</h2>
          <div className="task-list">
            {/* Task Card 1 */}
            <TaskCard
              title="Organizare donații textile"
              status="În progres"
              priority="Înaltă"
              description="Sortarea și organizarea donațiilor de haine pentru distribuire"
              meta={[
                "🧹 Curățenie Parc",
                "📅 Termen: 05.06.2025",
                "⏱ 2.5h din 4h",
              ]}
              progress={63}
            />
          </div>
        </main>
      )}

      {pageSelected === "proiecte" && (
        <main className="dashboard-main">
          <h2 className="section-title">Proiectele Mele</h2>
          <div className="proiecte">
            {/* Projects Section */}
            <section className={styles.projects}>
              <div className={styles.container}>
                {filteredProjects.length === 0 ? (
                  <div className={styles.noProjects}>
                    <p className="text-lg text-secondary">
                      Nu s-au găsit proiecte care să corespundă criteriilor
                      tale.
                    </p>
                  </div>
                ) : (
                  <div className={styles.projectsGrid}>
                    {filteredProjects.map((project) => (
                      <ProjectCard key={project.id} project={project} />
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>
        </main>
      )}

      {pageSelected === "status-aplicatii" && (
        <main className="dashboard-main">
          <h2 className="section-title">Status Aplicatii</h2>
          <div className="status-aplicatii"></div>
        </main>
      )}

      {/* Footer */}
    </div>
  );
};

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState(null);

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

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Ridicată":
        return styles.priorityHigh;
      case "Medie":
        return styles.priorityMedium;
      case "Scăzută":
        return styles.priorityLow;
      default:
        return styles.priorityMedium;
    }
  };

  const formatDate = (date) => {
    if (!date) return "Nu este stabilită";
    return new Intl.DateTimeFormat("ro-RO", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const handleApplyClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      // For now, we'll use a mock volunteer data since we don't have auth yet
      const mockVolunteer = {
        volunteerId: "mock-volunteer-id",
        name: "John Doe",
        email: "john@example.com",
      };

      // Update project with new application
      await projectsService.updateProject(project.id, {
        pendingVolunteers: [
          ...(project.pendingVolunteers || []),
          {
            volunteerId: mockVolunteer.volunteerId,
            status: "Pending",
            appliedAt: new Date().toISOString(),
            name: mockVolunteer.name,
            email: mockVolunteer.email,
          },
        ],
      });

      // Show success message
      setShowSuccessMessage(true);
      setApplicationStatus("Pending");

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    } catch (error) {
      console.error("Error applying to project:", error);
      // You might want to show an error message here
    }
  };

  return (
    <Link to={`/proiecte/${project.id}`} className={styles.projectCardLink}>
      <div className={`card ${styles.projectCard}`}>
        <div className="card-header">
          <div className={styles.cardHeader}>
            <div className={`badge ${getStatusBadgeClass(project.status)}`}>
              {project.status}
            </div>
            <div
              className={`${styles.priority} ${getPriorityColor(
                project.priority
              )}`}
            >
              {project.priority}
            </div>
          </div>
        </div>

        <div className="card-body">
          <h4 className="text-h4">{project.title}</h4>
          <p
            className="text-sm text-secondary"
            style={{ marginBottom: "var(--spacing-md)" }}
          >
            {project.description.length > 120
              ? `${project.description.substring(0, 120)}...`
              : project.description}
          </p>

          <div className={styles.projectMeta}>
            <div className={styles.metaItem}>
              <MapPin size={16} />
              <span className="text-sm">{project.location}</span>
            </div>
            <div className={styles.metaItem}>
              <Calendar size={16} />
              <span className="text-sm">{formatDate(project.startDate)}</span>
            </div>
            <div className={styles.metaItem}>
              <Users size={16} />
              <span className="text-sm">
                {project.currentVolunteers}/{project.maxVolunteers} voluntari
              </span>
            </div>
          </div>

          {project.requiredSkills.length > 0 && (
            <div className={styles.skills}>
              {project.requiredSkills.slice(0, 3).map((skill, index) => (
                <span key={index} className={`badge ${styles.skillBadge}`}>
                  {skill}
                </span>
              ))}
              {project.requiredSkills.length > 3 && (
                <span className="text-xs text-muted">
                  +{project.requiredSkills.length - 3} mai multe
                </span>
              )}
            </div>
          )}

          <div className={styles.progress}>
            <div className={styles.progressHeader}>
              <span className="text-sm font-medium">Progres</span>
              <span className="text-sm text-secondary">
                {project.progress}%
              </span>
            </div>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${project.progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default VolunteerDashboard;
