import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { loginUser, registerUser, logoutUser } from "../../firebase/auth";

interface AuthState {
  user: {
    uid: string;
    email: string | null;
  } | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null
};

// Check if user is stored in localStorage
const storedUser = localStorage.getItem("user");
if (storedUser) {
  try {
    initialState.user = JSON.parse(storedUser);
  } catch (e) {
    localStorage.removeItem("user");
  }
}

// Async thunks for authentication
export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const userCredential = await loginUser(email, password);
      const user = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
      };
      localStorage.setItem("user", JSON.stringify(user));
      return user;
    } catch (error: any) {
      return rejectWithValue(error.message || "Login failed");
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const userCredential = await registerUser(email, password);
      const user = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
      };
      localStorage.setItem("user", JSON.stringify(user));
      return user;
    } catch (error: any) {
      return rejectWithValue(error.message || "Registration failed");
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await logoutUser();
      localStorage.removeItem("user");
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message || "Logout failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ uid: string; email: string | null } | null>) => {
      state.user = action.payload;
      if (action.payload) {
        localStorage.setItem("user", JSON.stringify(action.payload));
      } else {
        localStorage.removeItem("user");
      }
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { setUser, clearError } = authSlice.actions;
export default authSlice.reducer;
