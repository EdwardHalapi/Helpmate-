import "./Header.css";

export default function Header({
  name,
  oreTotale = 0,
  taskuriFinalizate = 0,
  proiecteActive = 0,
}) {
  return (
    <header className="dashboard-header">
      <div className="user-info">
        <div className="avatar">
          {name
            .split(" ")
            .map((part) => part.charAt(0).toUpperCase())
            .join("")}
        </div>
        <div>
          <div className="welcome">Bun venit, {name || "Utilizator"}!</div>
          <div className="subtitle">Dashboard Voluntar</div>
        </div>
      </div>
      <div className="stats">
        {oreTotale > 0 && (
          <div>
            <span className="stat-value stat-purple">{oreTotale}h</span>
            <div className="stat-label">Ore totale</div>
          </div>
        )}
        {taskuriFinalizate > 0 && (
          <div>
            <span className="stat-value stat-green">{taskuriFinalizate}</span>
            <div className="stat-label">Task-uri finalizate</div>
          </div>
        )}
        {proiecteActive > 0 && (
          <div>
            <span className="stat-value stat-blue">{proiecteActive}</span>
            <div className="stat-label">Proiecte active</div>
          </div>
        )}
      </div>
    </header>
  );
}
