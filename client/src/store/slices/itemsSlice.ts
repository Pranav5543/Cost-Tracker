import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where, 
  serverTimestamp 
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { FirebaseItem } from "@shared/schema";

interface ItemsState {
  items: FirebaseItem[];
  loading: boolean;
  error: string | null;
  sortBy: 'name' | 'cost' | 'date';
  sortOrder: 'asc' | 'desc';
  searchTerm: string;
}

const initialState: ItemsState = {
  items: [],
  loading: false,
  error: null,
  sortBy: 'date',
  sortOrder: 'desc',
  searchTerm: ''
};

// Load items from localStorage if available
const storedItems = localStorage.getItem("items");
if (storedItems) {
  try {
    initialState.items = JSON.parse(storedItems);
  } catch (e) {
    localStorage.removeItem("items");
  }
}

// Async thunks for CRUD operations
export const fetchItems = createAsyncThunk(
  "items/fetchItems",
  async (userId: string, { rejectWithValue }) => {
    try {
      const itemsQuery = query(collection(db, "items"), where("userId", "==", userId));
      const querySnapshot = await getDocs(itemsQuery);
      
      const items: FirebaseItem[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        items.push({
          id: doc.id,
          name: data.name,
          cost: data.cost,
          userId: data.userId,
          createdAt: data.createdAt?.toDate() || new Date(),
        });
      });
      
      // Update localStorage
      localStorage.setItem("items", JSON.stringify(items));
      
      return items;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch items");
    }
  }
);

export const addItem = createAsyncThunk(
  "items/addItem",
  async ({ name, cost, userId }: { name: string; cost: number; userId: string }, { rejectWithValue }) => {
    try {
      const docRef = await addDoc(collection(db, "items"), {
        name,
        cost: Number(cost),
        userId,
        createdAt: serverTimestamp()
      });
      
      const newItem: FirebaseItem = {
        id: docRef.id,
        name,
        cost: Number(cost),
        userId,
        createdAt: new Date(),
      };
      
      return newItem;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to add item");
    }
  }
);

export const updateItem = createAsyncThunk(
  "items/updateItem",
  async ({ id, name, cost }: { id: string; name: string; cost: number }, { rejectWithValue }) => {
    try {
      const itemRef = doc(db, "items", id);
      await updateDoc(itemRef, {
        name,
        cost: Number(cost)
      });
      
      return { id, name, cost: Number(cost) };
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update item");
    }
  }
);

export const deleteItem = createAsyncThunk(
  "items/deleteItem",
  async (id: string, { rejectWithValue }) => {
    try {
      const itemRef = doc(db, "items", id);
      await deleteDoc(itemRef);
      
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to delete item");
    }
  }
);

const itemsSlice = createSlice({
  name: "items",
  initialState,
  reducers: {
    setSortBy: (state, action: PayloadAction<'name' | 'cost' | 'date'>) => {
      state.sortBy = action.payload;
      if (state.sortBy === action.payload) {
        // Toggle sort order if clicking on the same column
        state.sortOrder = state.sortOrder === 'asc' ? 'desc' : 'asc';
      }
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<'asc' | 'desc'>) => {
      state.sortOrder = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        localStorage.setItem("items", JSON.stringify(action.payload));
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
        localStorage.setItem("items", JSON.stringify(state.items));
      })
      .addCase(addItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        state.loading = false;
        const { id, name, cost } = action.payload;
        const itemIndex = state.items.findIndex(item => item.id === id);
        if (itemIndex !== -1) {
          state.items[itemIndex] = {
            ...state.items[itemIndex],
            name,
            cost
          };
          localStorage.setItem("items", JSON.stringify(state.items));
        }
      })
      .addCase(updateItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item.id !== action.payload);
        localStorage.setItem("items", JSON.stringify(state.items));
      })
      .addCase(deleteItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { setSortBy, setSearchTerm, setSortOrder } = itemsSlice.actions;
export default itemsSlice.reducer;
