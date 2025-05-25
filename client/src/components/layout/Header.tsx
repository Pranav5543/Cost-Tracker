import { useDispatch } from 'react-redux';
import { toggleMobileMenu } from '../../store/slices/uiSlice';
import { setSearchTerm as setItemSearchTerm } from '../../store/slices/itemsSlice';
import { setSearchTerm as setCostSearchTerm } from '../../store/slices/otherCostsSlice';
import { useRef, useState } from 'react';

const Header = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const searchTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const handleMobileMenuToggle = () => {
    dispatch(toggleMobileMenu());
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Clear any existing timer
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }
    
    // Set a debounce timer to avoid too many dispatches
    searchTimerRef.current = setTimeout(() => {
      dispatch(setItemSearchTerm(value));
      dispatch(setCostSearchTerm(value));
    }, 300);
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full sm:w-64 px-4 py-2 pr-8 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              value={searchTerm}
              onChange={handleSearch}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <i className="fas fa-search text-gray-400"></i>
            </div>
          </div>
          
          <div className="flex sm:hidden">
            <button 
              type="button" 
              className="bg-white p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              onClick={handleMobileMenuToggle}
            >
              <i className="fas fa-bars"></i>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
