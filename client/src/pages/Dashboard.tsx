import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import ProjectSummary from '../components/dashboard/ProjectSummary';
import ItemsTable from '../components/items/ItemsTable';
import OtherCostsTable from '../components/costs/OtherCostsTable';
import TotalCostSection from '../components/dashboard/TotalCostSection';
import AddItemModal from '../components/items/AddItemModal';
import EditItemModal from '../components/items/EditItemModal';
import AddCostModal from '../components/costs/AddCostModal';
import EditCostModal from '../components/costs/EditCostModal';
import DeleteConfirmationModal from '../components/common/DeleteConfirmationModal';
import { fetchItems } from '../store/slices/itemsSlice';
import { fetchOtherCosts } from '../store/slices/otherCostsSlice';

// Settings & Reports Components
const UserProfile = () => (
  <div className="bg-white shadow rounded-lg p-6">
    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">User Profile</h3>
    <div className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
        <input 
          type="text" 
          id="name" 
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" 
          placeholder="Your Name"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input 
          type="email" 
          id="email" 
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" 
          placeholder="your@email.com" 
          disabled
        />
        <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
      </div>
      <div className="pt-4">
        <button className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-md text-sm font-medium">
          Update Profile
        </button>
      </div>
    </div>
  </div>
);

const ChangePassword = () => (
  <div className="bg-white shadow rounded-lg p-6">
    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Change Password</h3>
    <div className="space-y-4">
      <div>
        <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">Current Password</label>
        <input 
          type="password" 
          id="current-password" 
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" 
          placeholder="••••••••" 
        />
      </div>
      <div>
        <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">New Password</label>
        <input 
          type="password" 
          id="new-password" 
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" 
          placeholder="••••••••" 
        />
      </div>
      <div>
        <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
        <input 
          type="password" 
          id="confirm-password" 
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" 
          placeholder="••••••••" 
        />
      </div>
      <div className="pt-4">
        <button className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-md text-sm font-medium">
          Update Password
        </button>
      </div>
    </div>
  </div>
);

const BugReport = () => (
  <div className="bg-white shadow rounded-lg p-6">
    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Report a Bug</h3>
    <div className="space-y-4">
      <div>
        <label htmlFor="bug-title" className="block text-sm font-medium text-gray-700">Issue Title</label>
        <input 
          type="text" 
          id="bug-title" 
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" 
          placeholder="Brief description of the issue" 
        />
      </div>
      <div>
        <label htmlFor="bug-description" className="block text-sm font-medium text-gray-700">Issue Description</label>
        <textarea 
          id="bug-description" 
          rows={4} 
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" 
          placeholder="Please provide details about what happened and how to reproduce the issue" 
        />
      </div>
      <div className="pt-4 text-left text-[#0c0]">
        <button className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-md text-sm font-medium">
          Submit Report
        </button>
      </div>
    </div>
  </div>
);

const CostSummary = () => {
  const { items } = useSelector((state: RootState) => state.items);
  const { otherCosts } = useSelector((state: RootState) => state.otherCosts);
  
  // Calculate totals
  const totalItemsCost = items.reduce((sum, item) => sum + Number(item.cost), 0);
  const totalOtherCosts = otherCosts.reduce((sum, cost) => sum + Number(cost.amount), 0);
  
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Cost Summary Report</h3>
      <div className="overflow-hidden bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-base font-semibold leading-6 text-gray-900">Project Breakdown</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Detailed view of your project costs</p>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Items Cost</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">${totalItemsCost.toFixed(2)}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Other Costs</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">${totalOtherCosts.toFixed(2)}</dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Total Project Cost</dt>
              <dd className="mt-1 text-sm font-bold text-gray-900 sm:col-span-2 sm:mt-0">${(totalItemsCost + totalOtherCosts).toFixed(2)}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Number of Items</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{items.length}</dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Number of Other Costs</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{otherCosts.length}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [activeSection, setActiveSection] = useState('dashboard');
  
  useEffect(() => {
    if (user?.uid) {
      dispatch(fetchItems(user.uid));
      dispatch(fetchOtherCosts(user.uid));
    }
  }, [dispatch, user?.uid]);

  // Listen for sidebar navigation changes
  useEffect(() => {
    const handleSidebarNavigation = (e: CustomEvent) => {
      if (e.detail && e.detail.section) {
        setActiveSection(e.detail.section);
      }
    };
    
    window.addEventListener('sidebarNavigation' as any, handleSidebarNavigation as any);
    
    return () => {
      window.removeEventListener('sidebarNavigation' as any, handleSidebarNavigation as any);
    };
  }, []);
  
  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <>
            <ProjectSummary />
            <ItemsTable />
            <OtherCostsTable />
            <TotalCostSection />
          </>
        );
      case 'items':
        return <ItemsTable />;
      case 'costs':
        return <OtherCostsTable />;
      case 'reports':
        return (
          <>
            <CostSummary />
            <BugReport />
          </>
        );
      case 'settings':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UserProfile />
            <ChangePassword />
          </div>
        );
      default:
        return (
          <>
            <ProjectSummary />
            <ItemsTable />
            <OtherCostsTable />
            <TotalCostSection />
          </>
        );
    }
  };
  
  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row">
      <Sidebar onSectionChange={(section) => setActiveSection(section)} />
      
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
        <Header />
        
        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
          {renderContent()}
        </div>
      </main>
      
      {/* Modals */}
      <AddItemModal />
      <EditItemModal />
      <AddCostModal />
      <EditCostModal />
      <DeleteConfirmationModal />
    </div>
  );
};

export default Dashboard;
