import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";


export const login = createAsyncThunk(
  "auth/login",
  async (credentials, thunkAPI) => {
    try {
      const res = await api.post("/api/auth/login", credentials);
      return res.data; // expect { role, user }
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Login failed"
      );
    }
  }
);

export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/api/auth/me");
      return res.data.user;
    } catch (err) {
      return thunkAPI.rejectWithValue("Not authenticated",err);
    }
  }
);


/* ============================
   LOGOUT
============================ */
export const logout = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI) => {
    try {
      await api.post("/api/auth/logout");
    } catch (err) {
      return thunkAPI.rejectWithValue("Logout failed", err);
    }
  }
);
/* ================= INVITE ================= */
export const inviteUser = createAsyncThunk(
  "auth/inviteUser",
  async (data, thunkAPI) => {
    try {
      const res = await api.post("/api/auth/invite", data);
      return res.data?.message || "Invitation sent";
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Invite failed"
      );
    }
  }
);

/* ================= SET PASSWORD ================= */
export const setPassword = createAsyncThunk(
  "auth/setPassword",
  async (data, thunkAPI) => {
    try {
      const res = await api.post("/api/auth/set-password", data);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Set password failed"
      );
    }
  }
);

/* ============================
   SLICE
============================ */
const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: false,
    user: null,
    role: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      /* ---------- LOGIN ---------- */
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload?.user || null;
        state.role = action.payload?.user?.role || null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload;
      })
 .addCase(checkAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.role = action.payload.role;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.role = null;
      })
    .addCase(inviteUser.pending, (state) => {
      state.loading = true;         
      state.error = null;
    })
    .addCase(inviteUser.fulfilled, (state) => {
      state.loading = false;          
    })
    .addCase(inviteUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
  /* ---------- SET PASSWORD ---------- */
    .addCase(setPassword.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(setPassword.fulfilled, (state) => {
      state.loading = false;
    })
    .addCase(setPassword.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

      /* ---------- LOGOUT ---------- */
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.role = null;
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;
