import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Briefcase, Settings,
  Calendar, MessageSquare, Award
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      path: '/',
      icon: <LayoutDashboard size={20} />,
      label: 'Dashboard'
    },
    {
      path: '/volunteers',
      icon: <Users size={20} />,
      label: 'Voluntari'
    },
    {
      path: '/projects',
      icon: <Briefcase size={20} />,
      label: 'Proiecte'
    },
    {
      path: '/calendar',
      icon: <Calendar size={20} />,
      label: 'Calendar'
    },
    {
      path: '/messages',
      icon: <MessageSquare size={20} />,
      label: 'Mesaje'
    },
    {
      path: '/achievements',
      icon: <Award size={20} />,
      label: 'Realizări'
    },
    {
      path: '/settings',
      icon: <Settings size={20} />,
      label: 'Setări'
    }
  ];

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar; 