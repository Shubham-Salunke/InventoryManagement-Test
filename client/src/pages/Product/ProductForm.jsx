import { useState } from "react";
import { useDispatch } from "react-redux";
import { createProduct } from "../../features/product/productSlice";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { showError, showSuccess } from "../../components/common/toast.utils";

export default function ProductForm() {
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    name: "",
    sku: "",
    price: "",
    category: "",
  });

  const [submitting, setSubmitting] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();

    setSubmitting(true);

    try {
      const action = await dispatch(
        createProduct({
          name: form.name,
          sku: form.sku,
          price: Number(form.price),
          category: form.category,
        })
      );

      if (createProduct.fulfilled.match(action)) {
        showSuccess("Product created successfully");
      } else {
        showError(action.payload || "Unable to create product");
      }
    } catch {
      showError("Unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50">
      <form
        onSubmit={submit}
        className="w-full max-w-lg bg-white p-6 rounded-lg shadow"
      >
        <h2 className="text-xl font-semibold mb-6 text-gray-800">
          Add Product
        </h2>

        <Input
          label="Product Name"
          name="name"
          placeholder="Enter product name"
          onChange={onChange}
        />

        <Input
          label="SKU"
          name="sku"
          placeholder="Enter SKU"
          onChange={onChange}
        />

        <Input
          label="Price"
          name="price"
          type="number"
          placeholder="Enter price"
          onChange={onChange}
        />

        {/* 🔹 REQUIRED */}
        <Input
          label="Category *"
          name="category"
          placeholder="Enter category"
          onChange={onChange}
        />

        <Button className="mt-4" loading={submitting}>
          Save Product
        </Button>
      </form>
    </div>
  );
}
