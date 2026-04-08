import { useEffect, useState } from "react";
import { 
  UserPlus, 
  Search, 
  UserX, 
  UserCheck, 
  Mail, 
  Filter,
  Loader2,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Users as UsersIcon
} from "lucide-react";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setLoading(true);
    fetch("http://localhost:5000/api/users")
      .then(res => res.json())
      .then(data => {
        const formatted = data.map((u) => ({
  id: u._id,
  name: u.name,
  email: u.email,
  role: u.role || "Customer",
  status: u.isBlocked ? "Blocked" : "Active",   // ✅ map isBlocked to status
  joined: new Date(u.createdAt).toLocaleDateString('en-IN', {
    year: 'numeric', month: 'short', day: 'numeric'
  })
}));
        setUsers(formatted);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const toggleStatus = async (userId, currentStatus) => {
  try {
    const token = localStorage.getItem("token"); // or however you store JWT
    const response = await fetch(`http://localhost:5000/api/users/${userId}/block`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update user status");
    }

    const data = await response.json();
    
    // Update local state based on response
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? { ...user, status: data.isBlocked ? "Blocked" : "Active" }
          : user
      )
    );
  } catch (err) {
    console.error("Error updating user status:", err);
    alert(err.message);
  }
};

  const getInitials = (name) =>
    name ? name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase() : "??";

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-10 font-sans text-gray-900">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-gray-500 mt-1">Manage permissions and monitor user activity.</p>
        </div>
        
        <button className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 font-medium">
          <UserPlus className="w-4 h-4" />
          <span>Add Member</span>
        </button>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-lg text-blue-600"><UsersIcon className="w-6 h-6"/></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Users</p>
            <p className="text-2xl font-bold">{users.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-50 rounded-lg text-green-600"><CheckCircle2 className="w-6 h-6"/></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Active Now</p>
            <p className="text-2xl font-bold">{users.filter(u => u.status === "Active").length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-red-50 rounded-lg text-red-600"><XCircle className="w-6 h-6"/></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Blocked</p>
            <p className="text-2xl font-bold">{users.filter(u => u.status === "Blocked").length}</p>
          </div>
        </div>
      </div>

      {/* SEARCH & FILTERS */}
      <div className="bg-white p-4 rounded-t-2xl border border-gray-100 border-b-0 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text"
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 text-sm font-medium text-gray-600 px-4 py-2 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors">
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-b-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-gray-500">
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider">User Profile</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider">Joined Date</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider">Account Status</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                  
                  {/* User Profile */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold text-xs shadow-inner">
                        {getInitials(user.name)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-700 bg-gray-100 px-2.5 py-1 rounded-lg">
                      {user.role}
                    </span>
                  </td>

                  {/* Joined */}
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {user.joined}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                      user.status === "Active"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                        : "bg-rose-50 text-rose-700 border-rose-100"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${user.status === "Active" ? "bg-emerald-500" : "bg-rose-500"}`}></span>
                      {user.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="Send Email">
                        <Mail className="w-4.5 h-4.5" />
                      </button>

                      <button
                        onClick={() => toggleStatus(user.id)}
                        className={`p-2 rounded-lg transition-all ${
                          user.status === "Active" 
                          ? "text-gray-400 hover:text-rose-600 hover:bg-rose-50" 
                          : "text-gray-400 hover:text-emerald-600 hover:bg-emerald-50"
                        }`}
                        title={user.status === "Active" ? "Block User" : "Unblock User"}
                      >
                        {user.status === "Active" ? <UserX className="w-4.5 h-4.5" /> : <UserCheck className="w-4.5 h-4.5" />}
                      </button>
                      
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
                        <MoreVertical className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* EMPTY STATE */}
        {filteredUsers.length === 0 && (
          <div className="py-20 text-center">
            <Search className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No users found</h3>
            <p className="text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
          </div>
        )}
      </div>
    </div>
  );
}