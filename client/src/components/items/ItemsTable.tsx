import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchItems, setSortBy, setSortOrder } from '../../store/slices/itemsSlice';
import { openEditItemModal, openDeleteModal } from '../../store/slices/uiSlice';
import { RootState, AppDispatch } from '../../store';
import { formatCurrency } from '../../utils/formatCurrency';
import { format } from 'date-fns';

const ItemsTable = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, sortBy, sortOrder, searchTerm } = useSelector((state: RootState) => state.items);
  const { user } = useSelector((state: RootState) => state.auth);
  
  useEffect(() => {
    if (user?.uid) {
      dispatch(fetchItems(user.uid));
    }
  }, [dispatch, user?.uid]);
  
  const handleEditItem = (itemId: string) => {
    dispatch(openEditItemModal(itemId));
  };
  
  const handleDeleteItem = (itemId: string) => {
    dispatch(openDeleteModal({ type: 'item', id: itemId }));
  };
  
  const handleSort = (column: 'name' | 'cost' | 'date') => {
    dispatch(setSortBy(column));
  };
  
  // Filter and sort items
  const filteredAndSortedItems = useMemo(() => {
    // First filter by search term
    let result = items;
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = items.filter(item => 
        item.name.toLowerCase().includes(lowerSearchTerm) || 
        item.cost.toString().includes(lowerSearchTerm)
      );
    }
    
    // Then sort
    return [...result].sort((a, b) => {
      if (sortBy === 'name') {
        return sortOrder === 'asc' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortBy === 'cost') {
        return sortOrder === 'asc' 
          ? a.cost - b.cost
          : b.cost - a.cost;
      } else { // date
        return sortOrder === 'asc' 
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  }, [items, sortBy, sortOrder, searchTerm]);
  
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Items</h3>
        <button 
          type="button" 
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          onClick={() => dispatch({ type: 'ui/openAddItemModal' })}
        >
          <i className="fas fa-plus mr-2"></i> Add Item
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
                    onClick={() => handleSort('name')}
                  >
                    Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('cost')}
                  >
                    Cost {sortBy === 'cost' && (sortOrder === 'asc' ? '↑' : '↓')}
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
                      Loading items...
                    </td>
                  </tr>
                ) : filteredAndSortedItems.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      No items found. Add some items to get started.
                    </td>
                  </tr>
                ) : (
                  filteredAndSortedItems.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                        {formatCurrency(item.cost)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(item.createdAt), 'MMM dd, yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          type="button" 
                          className="text-secondary-500 hover:text-secondary-700 mr-3"
                          onClick={() => handleEditItem(item.id)}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button 
                          type="button" 
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDeleteItem(item.id)}
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
      
      {filteredAndSortedItems.length > 0 && (
        <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Previous
            </button>
            <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredAndSortedItems.length}</span> of <span className="font-medium">{filteredAndSortedItems.length}</span> items
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemsTable;
