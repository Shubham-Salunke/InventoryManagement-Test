import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";


export const fetchProducts = createAsyncThunk(
  "products/fetch",
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get("/products/product/getProduct", { params });
      return res.data;
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || "Fetch failed");
    }
  }
);

export const createProduct = createAsyncThunk(
  "products/create",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post("/products/product/createProduct", payload);
      return res.data;
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || "Create failed");
    }
  }
);

export const updateProduct = createAsyncThunk(
  "products/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/products/product/updateProduct/${id}`, data);
      return res.data;
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || "Update failed");
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/delete",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.delete(`/products/product/deleteProduct/${id}`);
      return res.data;
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || "Delete failed");
    }
  }
);



const initialState = {
  items: [],
  meta: {},
  loading: false,
  error: null,
};



const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearProductError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

    
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* -------- CREATE -------- */
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload.data);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

    
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (p) => p._id === action.payload.data._id
        );
        if (index !== -1) {
          state.items[index] = action.payload.data;
        }
      })

      /* -------- DELETE -------- */
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (p) => p._id !== action.payload.data._id
        );
      });
  },
});



export const selectProducts = (state) => state.products.items;
export const selectProductsMeta = (state) => state.products.meta;
export const selectProductsLoading = (state) => state.products.loading;
export const selectProductsError = (state) => state.products.error;



export const { clearProductError } = productSlice.actions;
export default productSlice.reducer;
