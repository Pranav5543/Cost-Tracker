import { useEffect } from 'react';
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

const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  
  useEffect(() => {
    if (user?.uid) {
      dispatch(fetchItems(user.uid));
      dispatch(fetchOtherCosts(user.uid));
    }
  }, [dispatch, user?.uid]);
  
  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row">
      <Sidebar />
      
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
        <Header />
        
        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
          <ProjectSummary />
          <ItemsTable />
          <OtherCostsTable />
          <TotalCostSection />
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
