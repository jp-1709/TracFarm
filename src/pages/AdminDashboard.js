import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API, logoutUser, getAllProducts } from "./api";
import { Users, Package, TrendingUp, Eye, EyeOff, LogOut, ShieldAlert, Key, UserCheck, Trash2, Edit3, Settings } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingRoleId, setEditingRoleId] = useState(null);
  const [newRole, setNewRole] = useState("");
  const [showPasswordIds, setShowPasswordIds] = useState([]);
  const [activeTab, setActiveTab] = useState("users");
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const roles = ["farmer", "distributor", "retailer", "customer"];

  useEffect(() => {
    const fetchProducts = async () => {
      setProductsLoading(true);
      try {
        const allProducts = await getAllProducts();
        const mappedProducts = allProducts.map((product) => ({
          id: product.id,
          name: product.cropType,
          farmer: `Farmer ID: ${product.farmerId}`,
          status: product.retailerId ? "Active" : "Pending",
          price: 2.5,
          ...product,
        }));
        setProducts(mappedProducts);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setProducts([
          { id: 1, name: "Organic Tomatoes", farmer: "Ramesh Kumar", status: "Active", price: 2.5 },
          { id: 2, name: "Bell Peppers", farmer: "Suresh Singh", status: "Active", price: 3.0 },
          { id: 3, name: "Organic Carrots", farmer: "Ramesh Kumar", status: "Active", price: 1.8 }
        ]);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      const storedUser = JSON.parse(localStorage.getItem("user"));

      const buildMockUsers = () => {
        const current = storedUser || {
          id: "demo-admin",
          name: "Demo Admin",
          email: "admin@demo.local",
          role: "admin",
        };
        return [
          { id: current.id, name: current.name || "Admin", email: current.email, role: "admin", password: "••••••••", username: "admin" },
          { id: "u-1", name: "Ramesh Kumar", email: "ramesh@farmchain.com", role: "farmer", password: "••••••••", username: "ramesh" },
          { id: "u-2", name: "Vikas Logistics", email: "vikas@farmchain.com", role: "distributor", password: "••••••••", username: "vikas" },
          { id: "u-3", name: "Aroma Grocery Store", email: "aroma@farmchain.com", role: "retailer", password: "••••••••", username: "aroma" },
          { id: "u-4", name: "Amit Sharma", email: "amit@farmchain.com", role: "customer", password: "••••••••", username: "amit" }
        ];
      };

      if (!storedUser || storedUser.role.toLowerCase() !== "admin") {
        console.warn("ADMIN CHECK FAILED: User is not logged in or not an Admin.");
        alert("Access denied. Admins only.");
        logoutUser();
        navigate("/login");
        return;
      }

      if (!storedUser.token) {
        console.info("No token found. Using mock users for offline/demo mode.");
        setUsers(buildMockUsers());
        setLoading(false);
        return;
      }

      try {
        const response = await API.get("/all-with-passwords");
        setUsers(response.data);
      } catch (error) {
        console.warn("Backend unreachable; showing mock users.");
        setUsers(buildMockUsers());
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate]);

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const handleDelete = async (userId) => {
    const user = users.find((u) => u.id === userId);
    if (user.role.toLowerCase() === "admin") {
      alert("Admin cannot be deleted");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this user from the identity logs?")) return;

    try {
      await API.delete(`/${userId}`);
      setUsers(users.filter((u) => u.id !== userId));
    } catch (error) {
      console.warn("Backend delete failed. Simulating local delete.");
      setUsers(users.filter((u) => u.id !== userId));
    }
  };

  const startEditingRole = (userId, currentRole) => {
    const user = users.find((u) => u.id === userId);
    if (user.role.toLowerCase() === "admin") {
      alert("Admin role cannot be changed");
      return;
    }
    setEditingRoleId(userId);
    setNewRole(currentRole);
  };

  const saveRole = async (userId) => {
    try {
      await API.put(`/${userId}/role`, { role: newRole });
      setUsers(
        users.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
      setEditingRoleId(null);
    } catch (error) {
      console.warn("Backend update failed. Simulating local role update.");
      setUsers(
        users.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
      setEditingRoleId(null);
    }
  };

  const togglePassword = (id) => {
    setShowPasswordIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-200 ${isDark ? "bg-[#080c14] text-white" : "bg-[#f6f8fa]"}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-500 font-semibold">Loading Admin Console...</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: "Total Registrants",
      value: users.length,
      icon: Users,
      color: "from-blue-500 to-cyan-600",
    },
    {
      label: "Total Crops Logged",
      value: products.length,
      icon: Package,
      color: "from-emerald-500 to-green-600",
    },
    {
      label: "Traceable Shipments",
      value: products.filter((p) => p.status === "Active").length,
      icon: TrendingUp,
      color: "from-purple-500 to-pink-600",
    },
  ];

  return (
    <div className={`min-h-screen pb-16 transition-colors duration-200 ${isDark ? "bg-[#080c14] text-white" : "bg-[#f6f8fa]"}`}>
      
      {/* Header */}
      <header className="max-w-7xl mx-auto px-6 pt-12 pb-6 flex justify-between items-center text-left">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Admin Console</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            System metrics, node registry, and identity governance logs.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-6">
        
        {/* Error Notification */}
        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-2xl text-sm flex gap-3 items-center text-left">
            <ShieldAlert size={20} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="glass-panel p-6 flex items-center justify-between text-left">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{stat.label}</p>
                  <h3 className="text-3xl font-extrabold mt-1">{stat.value}</h3>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                  <Icon size={22} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Tabs navigation */}
        <div className="flex gap-2 mb-8 border-b border-gray-200 dark:border-slate-800 pb-px">
          {[
            { id: "users", label: "Identity Registry", count: users.length },
            { id: "products", label: "Crop Audits", count: products.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 font-bold text-sm transition-all border-b-2 cursor-pointer ${
                activeTab === tab.id
                  ? "text-emerald-500 border-emerald-500"
                  : "text-gray-500 border-transparent hover:text-gray-700 dark:hover:text-white"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Tab 1: Users */}
        {activeTab === "users" && (
          <div className="glass-panel overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50 dark:bg-slate-900/50 border-b border-gray-200 dark:border-slate-800">
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Username</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Role Access</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Secret Token</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                        No identities registered.
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50/30 dark:hover:bg-slate-900/30 transition">
                        <td className="px-6 py-4 font-bold text-sm">{user.username || "N/A"}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{user.name || "N/A"}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{user.email || "N/A"}</td>
                        <td className="px-6 py-4">
                          {editingRoleId === user.id ? (
                            <select
                              value={newRole}
                              onChange={(e) => setNewRole(e.target.value)}
                              className="px-3 py-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-xs"
                            >
                              {roles.map((role) => (
                                <option key={role} value={role}>
                                  {role.toUpperCase()}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                                user.role?.toLowerCase() === "admin"
                                  ? "bg-red-500/10 text-red-500"
                                  : user.role?.toLowerCase() === "farmer"
                                  ? "bg-amber-500/10 text-amber-500"
                                  : user.role?.toLowerCase() === "distributor"
                                  ? "bg-blue-500/10 text-blue-500"
                                  : user.role?.toLowerCase() === "retailer"
                                  ? "bg-purple-500/10 text-purple-500"
                                  : "bg-emerald-500/10 text-emerald-500"
                              }`}
                            >
                              {user.role}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <code className="text-xs bg-gray-100 dark:bg-slate-800 px-2 py-1 rounded font-mono text-gray-500">
                              {showPasswordIds.includes(user.id)
                                ? user.password
                                : "••••••••"}
                            </code>
                            <button
                              onClick={() => togglePassword(user.id)}
                              className="p-1 hover:bg-gray-200 dark:hover:bg-slate-700 rounded transition cursor-pointer"
                            >
                              {showPasswordIds.includes(user.id) ? (
                                <EyeOff size={14} className="text-gray-500" />
                              ) : (
                                <Eye size={14} className="text-gray-500" />
                              )}
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex gap-2 justify-end">
                            {editingRoleId === user.id ? (
                              <button
                                onClick={() => saveRole(user.id)}
                                className="text-xs font-bold px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg cursor-pointer"
                              >
                                Save
                              </button>
                            ) : (
                              <>
                                <button
                                  onClick={() => startEditingRole(user.id, user.role)}
                                  disabled={user.role?.toLowerCase() === "admin"}
                                  className="text-xs font-bold px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500 text-blue-600 hover:text-white rounded-lg transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                                >
                                  Modify
                                </button>
                                <button
                                  onClick={() => handleDelete(user.id)}
                                  disabled={user.role?.toLowerCase() === "admin"}
                                  className="text-xs font-bold px-3 py-1.5 bg-red-500/10 hover:bg-red-500 text-red-600 hover:text-white rounded-lg transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                                >
                                  Purge
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Products */}
        {activeTab === "products" && (
          <div className="glass-panel overflow-hidden shadow-2xl text-left">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/50 dark:bg-slate-900/50 border-b border-gray-200 dark:border-slate-800">
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Crop Name</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Farmer Origin</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Base Price</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Traceability Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50/30 dark:hover:bg-slate-900/30 transition">
                      <td className="px-6 py-4 text-sm font-bold">{product.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{product.farmer}</td>
                      <td className="px-6 py-4 text-sm font-semibold">${product.price.toFixed(2)}/kg</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            product.status === "Active"
                              ? "bg-emerald-500/10 text-emerald-500"
                              : "bg-gray-500/10 text-gray-500"
                          }`}
                        >
                          {product.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
