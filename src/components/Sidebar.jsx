import { Clock, LayoutDashboard, History, CircleDollarSign, BarChart3, HelpCircle, LogOut } from 'lucide-react';
import './Sidebar.css';
import { useLanguage } from '../context/LanguageContext';

const Sidebar = () => {
  const { t } = useLanguage();

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-logo">
          <Clock className="brand-icon" size={24} />
        </div>
        <div className="brand-text">
          <span className="brand-name">{t.brandName}</span>
        </div>
      </div>

      <div className="profile-section">
        <div className="profile-avatar-container">
          <Clock className="profile-icon" size={20} />
        </div>
        <div className="profile-info">
          <h3 className="profile-name">Precision Time</h3>
          <p className="profile-role">{t.profileRole}</p>
        </div>
      </div>

      <nav className="nav-menu">
        <a href="#" className="nav-item active">
          <LayoutDashboard size={20} />
          <span>{t.navOverview}</span>
        </a>
        <a href="#" className="nav-item">
          <History size={20} />
          <span>{t.navLogs}</span>
        </a>
        <a href="#" className="nav-item">
          <CircleDollarSign size={20} />
          <span>{t.navRates}</span>
        </a>
        <a href="#" className="nav-item">
          <BarChart3 size={20} />
          <span>{t.navAnalytics}</span>
        </a>
      </nav>

      <div className="pro-plan-card">
        <h4 className="pro-title">{t.proPlanTitle}</h4>
        <p className="pro-desc">{t.proPlanDesc}</p>
        <button className="pro-button">{t.proPlanBtn}</button>
      </div>

      <div className="bottom-links">
        <a href="#" className="bottom-link">
          <HelpCircle size={20} />
          <span>{t.support}</span>
        </a>
        <a href="#" className="bottom-link">
          <LogOut size={20} />
          <span>{t.signOut}</span>
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;
