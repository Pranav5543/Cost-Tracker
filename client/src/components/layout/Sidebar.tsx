import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { RootState, AppDispatch } from '../../store';
import { closeMobileMenu } from '../../store/slices/uiSlice';
import { useLocation } from 'wouter';
import { useState, useEffect } from 'react';

interface SidebarProps {
  onSectionChange?: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onSectionChange }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { isMobileMenuOpen } = useSelector((state: RootState) => state.ui);
  const [location, setLocation] = useLocation();
  const [activeSection, setActiveSection] = useState('dashboard');
  
  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      setLocation('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navigate = (section: string) => {
    setActiveSection(section);
    
    // Call the parent component's section change handler if provided
    if (onSectionChange) {
      onSectionChange(section);
    }
    
    dispatch(closeMobileMenu());
  };

  return (
    <aside className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:block w-full md:w-64 bg-gray-800 text-white md:min-h-screen fixed md:sticky top-0 z-40 h-full`}>
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold">Project Cost Tracker</h2>
      </div>
      
      <nav className="p-4">
        <ul className="space-y-2">
          <li>
            <button 
              onClick={() => navigate('dashboard')} 
              className={`w-full flex items-center p-2 rounded-md ${activeSection === 'dashboard' ? 'bg-primary-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
            >
              <i className="fas fa-home mr-3"></i>
              <span>Dashboard</span>
            </button>
          </li>
          <li>
            <button 
              onClick={() => navigate('items')} 
              className={`w-full flex items-center p-2 rounded-md ${activeSection === 'items' ? 'bg-primary-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
            >
              <i className="fas fa-list-alt mr-3"></i>
              <span>Items</span>
            </button>
          </li>
          <li>
            <button 
              onClick={() => navigate('costs')} 
              className={`w-full flex items-center p-2 rounded-md ${activeSection === 'costs' ? 'bg-primary-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
            >
              <i className="fas fa-dollar-sign mr-3"></i>
              <span>Other Costs</span>
            </button>
          </li>
          <li>
            <button 
              onClick={() => navigate('reports')} 
              className={`w-full flex items-center p-2 rounded-md ${activeSection === 'reports' ? 'bg-primary-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
            >
              <i className="fas fa-chart-pie mr-3"></i>
              <span>Reports</span>
            </button>
          </li>
          <li>
            <button 
              onClick={() => navigate('settings')} 
              className={`w-full flex items-center p-2 rounded-md ${activeSection === 'settings' ? 'bg-primary-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
            >
              <i className="fas fa-cog mr-3"></i>
              <span>Settings</span>
            </button>
          </li>
        </ul>
      </nav>
      
      <div className="absolute bottom-0 w-full p-4 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center">
              <span className="text-white font-medium">
                {user?.email ? user.email[0].toUpperCase() : 'U'}
              </span>
            </div>
            <span className="ml-2 text-sm text-gray-300 truncate">
              {user?.email || 'User'}
            </span>
          </div>
          <button 
            onClick={handleLogout} 
            className="text-gray-300 hover:text-white p-2 rounded-full hover:bg-red-600"
            title="Logout"
          >
            <i className="fas fa-sign-out-alt"></i>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
