import { useDispatch,useSelector  } from "react-redux";
import { setPassword } from "../../features/auth/authSlice";
import { useNavigate, useSearchParams } from "react-router-dom";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { showSuccess, showError } from "../../components/common/toast.utils.js";
import { useState } from "react";

const SetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get("token");
  const [password, setPwd] = useState("");
  const { loading } = useSelector((state) => state.auth);
  const submit = async (e) => {
    e.preventDefault();
    if (!token) {
      showError("Invalid or expired link");
      return;
    }

    try {
      await dispatch(setPassword({ token, password })).unwrap();
      showSuccess("Password set successfully");
      navigate("/login");
    } catch (err) {
      showError(err || "Failed to set password");
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col w-96 p-6 bg-white shadow">
      <Input
        type="password"
        placeholder="New Password"
        onChange={(e) => setPwd(e.target.value)}
      />
      <Button loading={loading} className="bg-blue-600 text-white">Set Password</Button>
    </form>
  );
};

export default SetPassword;
