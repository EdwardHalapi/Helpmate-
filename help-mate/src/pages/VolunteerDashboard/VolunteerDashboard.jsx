import React, { useState } from "react";
import "./VolunteerDashboard.css";
import "../../styles/variables.css";
import "../../styles/globals.css";
import "../../styles/typography.css";
import "../../styles/components.css";

const TaskCard = ({
  title,
  status,
  priority,
  description,
  meta,
  progress,
  actions,
}) => {
  return (
    <div className="task-card">
      <div className="task-header">
        <span className="task-title">Organizare donații textile</span>
        <span className="badge badge-blue">În progres</span>
        <span className="badge badge-red">Prioritate înaltă</span>
      </div>
      <div className="task-desc">
        Sortarea și organizarea donațiilor de haine pentru distribuire
      </div>
      <div className="task-meta">
        <span className="meta-item">🧹 Curățenie Parc</span>
        <span className="meta-item">📅 Termen: 05.06.2025</span>
        <span className="meta-item">⏱ 2.5h din 4h</span>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: "63%" }}></div>
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

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="user-info">
          <div className="avatar">MR</div>
          <div>
            <div className="welcome">Bun venit, Maria Rosca</div>
            <div className="subtitle">Dashboard Voluntar</div>
          </div>
        </div>
        <div className="stats">
          <div>
            <span className="stat-value stat-purple">45h</span>
            <div className="stat-label">Ore totale</div>
          </div>
          <div>
            <span className="stat-value stat-green">12</span>
            <div className="stat-label">Task-uri finalizate</div>
          </div>
          <div>
            <span className="stat-value stat-blue">2</span>
            <div className="stat-label">Proiecte active</div>
          </div>
        </div>
      </header>

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
              actions={["Loghează ore", "Schimbă status"]}
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
