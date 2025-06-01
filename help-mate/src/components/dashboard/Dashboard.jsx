import React from 'react';
import { 
  Users, Clock, Award, Briefcase, 
  TrendingUp, CheckCircle, Calendar, Target 
} from 'lucide-react';
import './Dashboard.css';

const StatCard = ({ icon: Icon, title, value, trend, color }) => (
  <div className={`stat-card ${color}`}>
    <div className="stat-icon">
      <Icon size={24} />
    </div>
    <div className="stat-content">
      <h3>{title}</h3>
      <div className="stat-value">
        {value}
        {trend && (
          <span className={`trend ${trend > 0 ? 'positive' : 'negative'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  // Date mock pentru demonstrație
  const stats = {
    voluntari: {
      total: 124,
      activi: 89,
      trend: 12
    },
    proiecte: {
      total: 15,
      active: 8,
      finalizate: 7
    },
    ore: {
      total: 1240,
      medieLunara: 180,
      trend: 8
    },
    impact: {
      beneficiari: 450,
      comunitati: 5,
      trend: 15
    }
  };

  const topVolunteers = [
    { id: 1, name: "Maria Popescu", hours: 45, projects: 3, rating: 4.8 },
    { id: 2, name: "Ion Ionescu", hours: 38, projects: 4, rating: 4.7 },
    { id: 3, name: "Ana Marinescu", hours: 32, projects: 2, rating: 4.9 }
  ];

  const recentActivity = [
    { id: 1, type: 'task', message: 'Task nou adăugat în proiectul Educație pentru toți', time: '2h' },
    { id: 2, type: 'volunteer', message: 'Ana s-a alăturat ca voluntar', time: '4h' },
    { id: 3, type: 'project', message: 'Proiectul Mediu Curat a fost finalizat', time: '1d' }
  ];

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="header-actions">
          <button className="btn-primary">
            <Calendar size={20} />
            Această Lună
          </button>
        </div>
      </header>

      <div className="stats-grid">
        <StatCard
          icon={Users}
          title="Voluntari Activi"
          value={stats.voluntari.activi}
          trend={stats.voluntari.trend}
          color="purple"
        />
        <StatCard
          icon={Briefcase}
          title="Proiecte Active"
          value={stats.proiecte.active}
          color="blue"
        />
        <StatCard
          icon={Clock}
          title="Ore Voluntariat"
          value={stats.ore.total}
          trend={stats.ore.trend}
          color="green"
        />
        <StatCard
          icon={Target}
          title="Beneficiari"
          value={stats.impact.beneficiari}
          trend={stats.impact.trend}
          color="orange"
        />
      </div>

      <div className="dashboard-content">
        <div className="dashboard-left">
          <section className="dashboard-section">
            <h2>Top Voluntari</h2>
            <div className="volunteers-list">
              {topVolunteers.map(volunteer => (
                <div key={volunteer.id} className="volunteer-card">
                  <div className="volunteer-info">
                    <div className="volunteer-avatar">
                      {volunteer.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="volunteer-details">
                      <h3>{volunteer.name}</h3>
                      <div className="volunteer-stats">
                        <span>{volunteer.hours} ore</span>
                        <span>{volunteer.projects} proiecte</span>
                        <span>{volunteer.rating} ★</span>
                      </div>
                    </div>
                  </div>
                  <Award className="award-icon" size={20} />
                </div>
              ))}
            </div>
          </section>

          <section className="dashboard-section">
            <h2>Activitate Recentă</h2>
            <div className="activity-list">
              {recentActivity.map(activity => (
                <div key={activity.id} className="activity-item">
                  <div className={`activity-icon ${activity.type}`}>
                    {activity.type === 'task' && <CheckCircle size={16} />}
                    {activity.type === 'volunteer' && <Users size={16} />}
                    {activity.type === 'project' && <Briefcase size={16} />}
                  </div>
                  <div className="activity-content">
                    <p>{activity.message}</p>
                    <span className="activity-time">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="dashboard-right">
          <section className="dashboard-section">
            <h2>Statistici Proiecte</h2>
            <div className="project-stats">
              <div className="stat-row">
                <div className="stat-label">Proiecte Active</div>
                <div className="stat-value">{stats.proiecte.active}</div>
              </div>
              <div className="stat-row">
                <div className="stat-label">Proiecte Finalizate</div>
                <div className="stat-value">{stats.proiecte.finalizate}</div>
              </div>
              <div className="stat-row">
                <div className="stat-label">Total Ore</div>
                <div className="stat-value">{stats.ore.total}</div>
              </div>
              <div className="stat-row">
                <div className="stat-label">Medie Lunară</div>
                <div className="stat-value">{stats.ore.medieLunara}</div>
              </div>
            </div>
          </section>

          <section className="dashboard-section">
            <h2>Impact în Comunitate</h2>
            <div className="impact-stats">
              <div className="impact-card">
                <h4>Beneficiari Direcți</h4>
                <div className="impact-value">
                  {stats.impact.beneficiari}
                  <TrendingUp className="trend-icon" size={16} />
                </div>
              </div>
              <div className="impact-card">
                <h4>Comunități Implicate</h4>
                <div className="impact-value">
                  {stats.impact.comunitati}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 