import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchCategories = createAsyncThunk(
  "category/fetchCategories",
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await api.get("/products/categories/getCategory", { params });

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  },
);

export const createCategory = createAsyncThunk(
  "category/createCategory",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/products/categories/createCategory", data);

      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  },
);

export const updateCategory = createAsyncThunk(
  "category/updateCategory",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await api.put(
        `/products/categories/updateCategory/${id}`,
        data,
      );

      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  },
);
export const updateCategoryStatus = createAsyncThunk(
  "category/updateCategoryStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/products/categories/${id}/status`, {
        status,
      });

      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  },
);

export const deleteCategory = createAsyncThunk(
  "category/deleteCategory",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.delete(
        `/products/categories/deleteCategory/${id}`
      );
      return res.data.data; // 🔥 return updated soft deleted record
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Delete failed"
      );
    }
  }
);
export const restoreCategory = createAsyncThunk(
  "category/restoreCategory",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.patch(
        `/products/categories/restore/${id}`
      );
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Restore failed"
      );
    }
  }
);

const categorySlice = createSlice({
  name: "category",
  initialState: {
    categories: [],
    meta: {page: 1, limit: 10, total: 0},
    loading: false,
    error: null,
  },

  reducers: {
    clearCategoryError: (state) => {
      state.error = null;
    },
     optimisticStatusUpdate: (state, action) => {
      const { id, status } = action.payload;
      const category = state.categories.find(
        (c) => c._id === id
      );
      if (category) {
        category.status = status;
      }
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload.data;
        state.meta = action.payload.meta;
      })

      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createCategory.pending, (state) => {
        state.loading = false;
        state.error = null;
      })

      // .addCase(createCategory.fulfilled, (state, action) => {
      //   state.loading = false;
      //   state.categories.unshift(action.payload);
      // })
            .addCase(createCategory.fulfilled, (state, action) => {
        state.categories.unshift(action.payload);
        state.meta.total += 1;
      })


      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex(
          (category) => category._id === action.payload._id,
        );

        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      .addCase(updateCategoryStatus.fulfilled, (state, action) => {
        const index = state.categories.findIndex(
          (category) => category._id === action.payload._id,
        );

        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })

      .addCase(deleteCategory.fulfilled, (state, action) => {

  const index = state.categories.findIndex(
    (cat) => cat._id === action.payload._id
  );

  if (index !== -1) {
    state.categories[index] = action.payload;  // 🔥 replace with updated soft deleted record
  }
})
.addCase(restoreCategory.fulfilled, (state, action) => {
  const index = state.categories.findIndex(
    (c) => c._id === action.payload._id
  );

  if (index !== -1) {
    state.categories[index] = action.payload;
  }
});
  },
});

export const { clearCategoryError, optimisticStatusUpdate } = categorySlice.actions;

export default categorySlice.reducer;
