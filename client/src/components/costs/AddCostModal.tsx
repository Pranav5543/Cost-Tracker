import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addOtherCost } from "../../store/slices/otherCostsSlice";
import { closeAddCostModal } from "../../store/slices/uiSlice";
import { RootState, AppDispatch } from "../../store";

const AddCostModal = () => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch<AppDispatch>();
  const { isAddCostModalOpen } = useSelector((state: RootState) => state.ui);
  const { loading } = useSelector((state: RootState) => state.otherCosts);
  const { user } = useSelector((state: RootState) => state.auth);

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
    setError("");
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only numbers and decimal point
    const value = e.target.value.replace(/[^0-9.]/g, "");

    // Ensure only one decimal point
    const parts = value.split(".");
    if (parts.length > 2) {
      return;
    }

    setAmount(value);
    setError("");
  };

  const validateForm = () => {
    if (!description.trim()) {
      setError("Description is required");
      return false;
    }

    if (!amount.trim()) {
      setError("Amount is required");
      return false;
    }

    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue < 0) {
      setError("Amount must be a valid positive number");
      return false;
    }

    return true;
  };

  const handleAddCost = async () => {
    if (!validateForm()) return;
    if (!user?.uid) {
      setError("You must be logged in to add costs");
      return;
    }

    try {
      await dispatch(
        addOtherCost({
          description,
          amount: parseFloat(amount),
          userId: user.uid,
        })
      ).unwrap();

      // Reset form and close modal
      setDescription("");
      setAmount("");
      dispatch(closeAddCostModal());
    } catch (error: any) {
      setError(error.message || "Failed to add cost");
    }
  };

  const handleCloseModal = () => {
    dispatch(closeAddCostModal());
    setDescription("");
    setAmount("");
    setError("");
  };

  if (!isAddCostModalOpen) return null;

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={handleCloseModal}
        ></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 sm:mx-0 sm:h-10 sm:w-10">
                <i className="fas fa-dollar-sign text-primary-600"></i>
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Add Other Cost
                </h3>

                {error && (
                  <div className="mt-2 p-2 bg-red-50 text-red-600 text-sm rounded">
                    {error}
                  </div>
                )}

                <div className="mt-4 space-y-4">
                  <div>
                    <label
                      htmlFor="cost-description"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Description
                    </label>
                    <input
                      type="text"
                      name="cost-description"
                      id="cost-description"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      value={description}
                      onChange={handleDescriptionChange}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="cost-amount"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Amount ($)
                    </label>
                    <input
                      type="text"
                      name="cost-amount"
                      id="cost-amount"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      value={amount}
                      onChange={handleAmountChange}
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-500 text-base font-medium text-gray hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={handleAddCost}
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Cost"}
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={handleCloseModal}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCostModal;
