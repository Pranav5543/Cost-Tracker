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
import { FirebaseOtherCost } from "@shared/schema";

interface OtherCostsState {
  otherCosts: FirebaseOtherCost[];
  loading: boolean;
  error: string | null;
  sortBy: 'description' | 'amount' | 'date';
  sortOrder: 'asc' | 'desc';
  searchTerm: string;
}

const initialState: OtherCostsState = {
  otherCosts: [],
  loading: false,
  error: null,
  sortBy: 'date',
  sortOrder: 'desc',
  searchTerm: ''
};

// Load other costs from localStorage if available
const storedOtherCosts = localStorage.getItem("otherCosts");
if (storedOtherCosts) {
  try {
    initialState.otherCosts = JSON.parse(storedOtherCosts);
  } catch (e) {
    localStorage.removeItem("otherCosts");
  }
}

// Async thunks for CRUD operations
export const fetchOtherCosts = createAsyncThunk(
  "otherCosts/fetchOtherCosts",
  async (userId: string, { rejectWithValue }) => {
    try {
      const costsQuery = query(collection(db, "otherCosts"), where("userId", "==", userId));
      const querySnapshot = await getDocs(costsQuery);
      
      const otherCosts: FirebaseOtherCost[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        otherCosts.push({
          id: doc.id,
          description: data.description,
          amount: data.amount,
          userId: data.userId,
          createdAt: data.createdAt?.toDate() || new Date(),
        });
      });
      
      // Update localStorage
      localStorage.setItem("otherCosts", JSON.stringify(otherCosts));
      
      return otherCosts;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch other costs");
    }
  }
);

export const addOtherCost = createAsyncThunk(
  "otherCosts/addOtherCost",
  async ({ description, amount, userId }: { description: string; amount: number; userId: string }, { rejectWithValue }) => {
    try {
      const docRef = await addDoc(collection(db, "otherCosts"), {
        description,
        amount: Number(amount),
        userId,
        createdAt: serverTimestamp()
      });
      
      const newCost: FirebaseOtherCost = {
        id: docRef.id,
        description,
        amount: Number(amount),
        userId,
        createdAt: new Date(),
      };
      
      return newCost;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to add other cost");
    }
  }
);

export const updateOtherCost = createAsyncThunk(
  "otherCosts/updateOtherCost",
  async ({ id, description, amount }: { id: string; description: string; amount: number }, { rejectWithValue }) => {
    try {
      const costRef = doc(db, "otherCosts", id);
      await updateDoc(costRef, {
        description,
        amount: Number(amount)
      });
      
      return { id, description, amount: Number(amount) };
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update other cost");
    }
  }
);

export const deleteOtherCost = createAsyncThunk(
  "otherCosts/deleteOtherCost",
  async (id: string, { rejectWithValue }) => {
    try {
      const costRef = doc(db, "otherCosts", id);
      await deleteDoc(costRef);
      
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to delete other cost");
    }
  }
);

const otherCostsSlice = createSlice({
  name: "otherCosts",
  initialState,
  reducers: {
    setSortBy: (state, action: PayloadAction<'description' | 'amount' | 'date'>) => {
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
      .addCase(fetchOtherCosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOtherCosts.fulfilled, (state, action) => {
        state.loading = false;
        state.otherCosts = action.payload;
        localStorage.setItem("otherCosts", JSON.stringify(action.payload));
      })
      .addCase(fetchOtherCosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addOtherCost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addOtherCost.fulfilled, (state, action) => {
        state.loading = false;
        state.otherCosts.push(action.payload);
        localStorage.setItem("otherCosts", JSON.stringify(state.otherCosts));
      })
      .addCase(addOtherCost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateOtherCost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOtherCost.fulfilled, (state, action) => {
        state.loading = false;
        const { id, description, amount } = action.payload;
        const costIndex = state.otherCosts.findIndex(cost => cost.id === id);
        if (costIndex !== -1) {
          state.otherCosts[costIndex] = {
            ...state.otherCosts[costIndex],
            description,
            amount
          };
          localStorage.setItem("otherCosts", JSON.stringify(state.otherCosts));
        }
      })
      .addCase(updateOtherCost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteOtherCost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOtherCost.fulfilled, (state, action) => {
        state.loading = false;
        state.otherCosts = state.otherCosts.filter(cost => cost.id !== action.payload);
        localStorage.setItem("otherCosts", JSON.stringify(state.otherCosts));
      })
      .addCase(deleteOtherCost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { setSortBy, setSearchTerm, setSortOrder } = otherCostsSlice.actions;
export default otherCostsSlice.reducer;
