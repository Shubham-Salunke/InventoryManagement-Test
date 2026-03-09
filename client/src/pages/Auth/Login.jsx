import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FiEye, FiEyeOff, FiMail, FiLock } from "react-icons/fi";

import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import FormError from "../../components/common/FormError";

import { login, clearAuthError } from "../../features/auth/authSlice";
import { loginSchema } from "./login.schema";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, loading, error } = useSelector(
    (state) => state.auth
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
    mode: "onChange",
  });

  const [showPassword, setShowPassword] = useState(false);

  const emailValue = watch("email");
  const passwordValue = watch("password");

  const onSubmit = (data) => {
    if (loading) return;

    dispatch(
      login({
        email: data.email.toLowerCase().trim(),
        password: data.password.trim(),
      })
    );
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">

        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-800">
            Inventory Management System
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Sign in with your corporate account
          </p>
        </div>

        {/* SERVER ERROR */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* EMAIL */}
          <div>

            <div className="relative">
              <FiMail className="absolute top-3.5 left-3 text-gray-400" />
              <Input
                type="email"
                {...register("email")}
                placeholder="name@company/email.com"
                aria-invalid={!!errors.email}
                className="pl-10 h-11"
              />
            </div>
            <FormError message={errors.email?.message} />
          </div>

          {/* PASSWORD */}
          <div>
            <div className="relative">
              <FiLock className="absolute top-3.5 left-3 text-gray-400" />
              <Input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="Enter your password"
                aria-invalid={!!errors.password}
                className="pl-10 pr-12 h-11"
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute top-4 right-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            <FormError message={errors.password?.message} />
          </div>

          {/* ACTION */}
          <Button
            loading={loading}
            disabled={!emailValue || !passwordValue || loading}
            className="w-full bg-gray-900 text-white hover:bg-gray-800"
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>

          {/* <p className="text-xs text-gray-500 text-center">
            Authorized personnel only.
          </p> */}
        </form>
      </div>
    </div>
  );
};

export default Login;
