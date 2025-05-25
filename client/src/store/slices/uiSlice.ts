import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ModalState {
  isAddItemModalOpen: boolean;
  isEditItemModalOpen: boolean;
  isAddCostModalOpen: boolean;
  isEditCostModalOpen: boolean;
  isDeleteModalOpen: boolean;
  currentItemId: string | null;
  currentCostId: string | null;
  deleteItemType: 'item' | 'cost' | null;
  deleteItemId: string | null;
  isMobileMenuOpen: boolean;
}

const initialState: ModalState = {
  isAddItemModalOpen: false,
  isEditItemModalOpen: false,
  isAddCostModalOpen: false,
  isEditCostModalOpen: false,
  isDeleteModalOpen: false,
  currentItemId: null,
  currentCostId: null,
  deleteItemType: null,
  deleteItemId: null,
  isMobileMenuOpen: false
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openAddItemModal: (state) => {
      state.isAddItemModalOpen = true;
    },
    closeAddItemModal: (state) => {
      state.isAddItemModalOpen = false;
    },
    openEditItemModal: (state, action: PayloadAction<string>) => {
      state.isEditItemModalOpen = true;
      state.currentItemId = action.payload;
    },
    closeEditItemModal: (state) => {
      state.isEditItemModalOpen = false;
      state.currentItemId = null;
    },
    openAddCostModal: (state) => {
      state.isAddCostModalOpen = true;
    },
    closeAddCostModal: (state) => {
      state.isAddCostModalOpen = false;
    },
    openEditCostModal: (state, action: PayloadAction<string>) => {
      state.isEditCostModalOpen = true;
      state.currentCostId = action.payload;
    },
    closeEditCostModal: (state) => {
      state.isEditCostModalOpen = false;
      state.currentCostId = null;
    },
    openDeleteModal: (state, action: PayloadAction<{ type: 'item' | 'cost', id: string }>) => {
      state.isDeleteModalOpen = true;
      state.deleteItemType = action.payload.type;
      state.deleteItemId = action.payload.id;
    },
    closeDeleteModal: (state) => {
      state.isDeleteModalOpen = false;
      state.deleteItemType = null;
      state.deleteItemId = null;
    },
    toggleMobileMenu: (state) => {
      state.isMobileMenuOpen = !state.isMobileMenuOpen;
    },
    closeMobileMenu: (state) => {
      state.isMobileMenuOpen = false;
    }
  }
});

export const {
  openAddItemModal,
  closeAddItemModal,
  openEditItemModal,
  closeEditItemModal,
  openAddCostModal,
  closeAddCostModal,
  openEditCostModal,
  closeEditCostModal,
  openDeleteModal,
  closeDeleteModal,
  toggleMobileMenu,
  closeMobileMenu
} = uiSlice.actions;

export default uiSlice.reducer;
