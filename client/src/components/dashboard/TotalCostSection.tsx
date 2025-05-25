import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { formatCurrency } from '../../utils/formatCurrency';

const TotalCostSection = () => {
  const { items } = useSelector((state: RootState) => state.items);
  const { otherCosts } = useSelector((state: RootState) => state.otherCosts);
  
  // Calculate totals
  const itemsSubtotal = items.reduce((sum, item) => sum + Number(item.cost), 0);
  const otherCostsTotal = otherCosts.reduce((sum, cost) => sum + Number(cost.amount), 0);
  const totalCost = itemsSubtotal + otherCostsTotal;
  
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Project Cost Summary</h3>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
          <span className="text-base text-gray-500">Items Subtotal</span>
          <span className="text-base font-medium font-mono text-gray-900">{formatCurrency(itemsSubtotal)}</span>
        </div>
        
        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
          <span className="text-base text-gray-500">Other Costs</span>
          <span className="text-base font-medium font-mono text-gray-900">{formatCurrency(otherCostsTotal)}</span>
        </div>
        
        <div className="flex justify-between items-center pt-2">
          <span className="text-lg font-semibold text-gray-900">Total Cost</span>
          <span className="text-lg font-bold font-mono text-primary-600">{formatCurrency(totalCost)}</span>
        </div>
      </div>
    </div>
  );
};

export default TotalCostSection;
