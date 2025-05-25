import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOtherCosts, setSortBy, setSortOrder } from '../../store/slices/otherCostsSlice';
import { openEditCostModal, openDeleteModal } from '../../store/slices/uiSlice';
import { RootState, AppDispatch } from '../../store';
import { formatCurrency } from '../../utils/formatCurrency';
import { format } from 'date-fns';

const OtherCostsTable = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { otherCosts, loading, sortBy, sortOrder, searchTerm } = useSelector((state: RootState) => state.otherCosts);
  const { user } = useSelector((state: RootState) => state.auth);
  
  useEffect(() => {
    if (user?.uid) {
      dispatch(fetchOtherCosts(user.uid));
    }
  }, [dispatch, user?.uid]);
  
  const handleEditCost = (costId: string) => {
    dispatch(openEditCostModal(costId));
  };
  
  const handleDeleteCost = (costId: string) => {
    dispatch(openDeleteModal({ type: 'cost', id: costId }));
  };
  
  const handleSort = (column: 'description' | 'amount' | 'date') => {
    dispatch(setSortBy(column));
  };
  
  // Filter and sort costs
  const filteredAndSortedCosts = useMemo(() => {
    // First filter by search term
    let result = otherCosts;
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = otherCosts.filter(cost => 
        cost.description.toLowerCase().includes(lowerSearchTerm) || 
        cost.amount.toString().includes(lowerSearchTerm)
      );
    }
    
    // Then sort
    return [...result].sort((a, b) => {
      if (sortBy === 'description') {
        return sortOrder === 'asc' 
          ? a.description.localeCompare(b.description)
          : b.description.localeCompare(a.description);
      } else if (sortBy === 'amount') {
        return sortOrder === 'asc' 
          ? a.amount - b.amount
          : b.amount - a.amount;
      } else { // date
        return sortOrder === 'asc' 
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  }, [otherCosts, sortBy, sortOrder, searchTerm]);
  
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Other Costs</h3>
        <button 
          type="button" 
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          onClick={() => dispatch({ type: 'ui/openAddCostModal' })}
        >
          <i className="fas fa-plus mr-2"></i> Add Cost
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <div className="align-middle inline-block min-w-full">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('description')}
                  >
                    Description {sortBy === 'description' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('amount')}
                  >
                    Amount {sortBy === 'amount' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('date')}
                  >
                    Date Added {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      Loading costs...
                    </td>
                  </tr>
                ) : filteredAndSortedCosts.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      No other costs found. Add some costs to get started.
                    </td>
                  </tr>
                ) : (
                  filteredAndSortedCosts.map((cost) => (
                    <tr key={cost.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {cost.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                        {formatCurrency(cost.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(cost.createdAt), 'MMM dd, yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          type="button" 
                          className="text-secondary-500 hover:text-secondary-700 mr-3"
                          onClick={() => handleEditCost(cost.id)}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button 
                          type="button" 
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDeleteCost(cost.id)}
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtherCostsTable;
