import { User, Clock } from 'lucide-react';
import './TopNavigation.css';

const TopNavigation = () => {
  return (
    <header className="top-navigation">
      <div className="brand-mobile">
        <Clock className="brand-icon" size={24} color="var(--primary-blue)" />
        <span className="brand-name">Control de Horario</span>
      </div>

      <div className="top-actions">
        <div className="avatar-btn">
          <User size={20} />
        </div>
      </div>
    </header>
  );
};

export default TopNavigation;
