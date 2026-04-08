import { useState } from "react";

export default function Settings() {
  const [profile, setProfile] = useState({
    name: "Velora Admin",
    email: "admin@velora.com",
  });

  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPassword({ ...password, [name]: value });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      {/* Profile Settings */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleProfileChange}
            placeholder="Admin Name"
            className="border px-4 py-2 rounded-lg w-full"
          />

          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleProfileChange}
            placeholder="Admin Email"
            className="border px-4 py-2 rounded-lg w-full"
          />
        </div>

        <button className="mt-6 bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800">
          Save Changes
        </button>
      </div>

      {/* Password Settings */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Change Password</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <input
            type="password"
            name="current"
            value={password.current}
            onChange={handlePasswordChange}
            placeholder="Current Password"
            className="border px-4 py-2 rounded-lg w-full"
          />

          <input
            type="password"
            name="new"
            value={password.new}
            onChange={handlePasswordChange}
            placeholder="New Password"
            className="border px-4 py-2 rounded-lg w-full"
          />

          <input
            type="password"
            name="confirm"
            value={password.confirm}
            onChange={handlePasswordChange}
            placeholder="Confirm New Password"
            className="border px-4 py-2 rounded-lg w-full"
          />
        </div>

        <button className="mt-6 bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800">
          Update Password
        </button>
      </div>
    </div>
  );
}
