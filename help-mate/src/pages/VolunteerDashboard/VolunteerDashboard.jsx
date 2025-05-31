import React, { useEffect, useState } from "react";
import "./VolunteerDashboard.css";
import "../../styles/variables.css";
import "../../styles/globals.css";
import "../../styles/typography.css";
import "../../styles/components.css";
import { volunteerService } from "../../services/api/volunteers.js";
import { ProjectsService } from "../../services/api/projects.js";
import Header from "../../components/layout/Header/Header.jsx";

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
  const [pageSelected, setPageSelected] = useState("task-list");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  const projectsService = new ProjectsService();

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        const user = await volunteerService.getById("75ytUh3LjYvs5EXF6itS"); // Exemplu de ID

        user.projects = await Promise.all(
          user.projects.map(async (project) => {
            const data = await projectsService.getProjectById(project);
            return data;
          })
        );

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
          className={"tab " + (pageSelected === "logare-ore" ? "active" : "")}
          onClick={() => setPageSelected("logare-ore")}
        >
          Logarea Orelor
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
          <div className="proiecte"></div>
        </main>
      )}

      {pageSelected === "logare-ore" && (
        <main className="dashboard-main">
          <h2 className="section-title">Logarea Orelor</h2>
          <div className="logare-ore">
            {/* Logare ore component can be added here */}
            <p>
              Funcționalitatea de logare a orelor va fi implementată în curând.
            </p>
          </div>
        </main>
      )}

      {/* Footer */}
    </div>
  );
};

export default VolunteerDashboard;
