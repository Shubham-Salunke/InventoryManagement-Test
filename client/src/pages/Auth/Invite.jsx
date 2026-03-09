import { useDispatch, useSelector } from "react-redux";
import { inviteUser } from "../../features/auth/authSlice";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { showSuccess, showError } from "../../components/common/toast.utils.js";
import { useState } from "react";

const Invite = () => {
  const dispatch = useDispatch();


  const { loading } = useSelector((state) => state.auth);
const role = useSelector((state) => state.auth.role);

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "STAFF",
  });

  const submit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email) {
      showError("Name and Email are required");
      return;
    }

    try {
      await dispatch(inviteUser(form)).unwrap();
      showSuccess("Invitation sent successfully");

      // ✅ RESET FORM
      setForm({ name: "", email: "", role: "STAFF" });
    } catch (err) {
      showError(err || "Failed to send invitation");
    }
  };

  return (
     <div className="flex items-center justify-center min-h-[70vh]">
    <form onSubmit={submit} className="p-5 bg-white w-96 shadow rounded">
      <Input
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <Input
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <select
        className="w-full mb-3 p-2 border rounded"
        value={form.role}
        onChange={(e) => setForm({ ...form, role: e.target.value })}
      >
        <option value="STAFF">STAFF</option>
       {role === "ADMIN" && <option value="MANAGER">MANAGER</option>}

      </select>

    
      <Button loading={loading} className="bg-blue-600 text-white">
        Invite
      </Button>
    </form>
    </div>
  );
};

export default Invite;
