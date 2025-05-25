import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { formatCurrency } from '../../utils/formatCurrency';

const ProjectSummary = () => {
  const { items } = useSelector((state: RootState) => state.items);
  const { otherCosts } = useSelector((state: RootState) => state.otherCosts);
  
  // Calculate totals
  const totalItems = items.length;
  const totalCosts = otherCosts.length;
  const totalItemsCost = items.reduce((sum, item) => sum + Number(item.cost), 0);
  const totalOtherCosts = otherCosts.reduce((sum, cost) => sum + Number(cost.amount), 0);
  const totalBudget = totalItemsCost + totalOtherCosts;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0 rounded-md p-3 bg-primary-50">
            <i className="fas fa-shopping-cart text-primary-500"></i>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">Total Items</dt>
              <dd>
                <div className="text-lg font-medium text-gray-900">{totalItems}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0 rounded-md p-3 bg-blue-50">
            <i className="fas fa-receipt text-blue-500"></i>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">Other Costs</dt>
              <dd>
                <div className="text-lg font-medium text-gray-900">{totalCosts}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0 rounded-md p-3 bg-green-50">
            <i className="fas fa-dollar-sign text-green-500"></i>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">Total Budget</dt>
              <dd>
                <div className="text-lg font-medium text-gray-900 font-mono">{formatCurrency(totalBudget)}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectSummary;
