import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { RootState, AppDispatch } from '../../store';
import { closeMobileMenu } from '../../store/slices/uiSlice';

const Sidebar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { isMobileMenuOpen } = useSelector((state: RootState) => state.ui);
  
  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <aside className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:block w-full md:w-64 bg-gray-800 text-white md:min-h-screen`}>
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold">Project Cost Tracker</h2>
      </div>
      
      <nav className="p-4">
        <ul className="space-y-2">
          <li>
            <a href="#" className="flex items-center p-2 rounded-md bg-gray-700 text-white">
              <i className="fas fa-home mr-3"></i>
              <span>Dashboard</span>
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center p-2 rounded-md hover:bg-gray-700 text-gray-300 hover:text-white">
              <i className="fas fa-list-alt mr-3"></i>
              <span>Items</span>
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center p-2 rounded-md hover:bg-gray-700 text-gray-300 hover:text-white">
              <i className="fas fa-dollar-sign mr-3"></i>
              <span>Other Costs</span>
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center p-2 rounded-md hover:bg-gray-700 text-gray-300 hover:text-white">
              <i className="fas fa-chart-pie mr-3"></i>
              <span>Reports</span>
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center p-2 rounded-md hover:bg-gray-700 text-gray-300 hover:text-white">
              <i className="fas fa-cog mr-3"></i>
              <span>Settings</span>
            </a>
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
          <button onClick={handleLogout} className="text-gray-300 hover:text-white">
            <i className="fas fa-sign-out-alt"></i>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
