import {
  useEffect,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import {
  createCategory,
  updateCategory,
} from "../../features/category/categorySlice";

import { categorySchema } from "../../validation/category.validation";

import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import {
  showSuccess,
  showError,
} from "../../components/common/toast.utils";

const CategoryForm = ({
  editData,
  onSuccess,
}) => {
  const dispatch = useDispatch();

  const { loading } = useSelector(
    (state) => state.category
  );

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(categorySchema),
    mode: "onChange",
  });

  /* ================= PREFILL ================= */

  useEffect(() => {
    if (editData) {
      setValue("name", editData.name);
    } else {
      reset({ name: "" });
    }
  }, [editData, setValue, reset]);

  /* ================= SUBMIT ================= */

  const onSubmit = async (data) => {
    try {
      const payload = {
        name: data.name.trim().toLowerCase(),
      };

      if (editData) {
        await dispatch(
          updateCategory({
            id: editData._id,
            data: payload,
          })
        ).unwrap();

        showSuccess(
          "Category updated successfully"
        );
      } else {
        await dispatch(
          createCategory(payload)
        ).unwrap();

        showSuccess(
          "Category created successfully"
        );
      }

      reset();
      onSuccess?.();
    } catch (err) {
      showError(
        err || "Operation failed"
      );
    }
  };

  /* ================= UI ================= */

  return (
    <div className="bg-white border rounded-lg shadow-sm">
      <div className="p-5">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <Input
            type="text"
            label="Category Name"
            placeholder="Enter category name"
            {...register("name")}
            error={errors.name}
          />

          <Button
            type="submit"
            loading={loading}
            disabled={!isValid || loading}
          >
            {editData
              ? "Update Category"
              : "Create Category"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm;