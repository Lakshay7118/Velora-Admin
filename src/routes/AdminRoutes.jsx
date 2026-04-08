import { Routes, Route } from "react-router-dom";
import AdminLayout from "../components/common/AdminLayout";
import Dashboard from "../pages/dashboard/Dashboard";
import Products from "../pages/products/Products";
import Orders from "../pages/orders/Orders";
import Users from "../pages/users/Users";
import Categories from "../pages/categories/Categories";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route
        path="/admin"
        element={
          <AdminLayout>
            <Dashboard />
          </AdminLayout>
        }
      />

      <Route
        path="/admin/products"
        element={
          <AdminLayout>
            <Products />
          </AdminLayout>
        }
      />

      <Route
        path="/admin/orders"
        element={
          <AdminLayout>
            <Orders />
          </AdminLayout>
        }
      />

      <Route
        path="/admin/users"
        element={
          <AdminLayout>
            <Users />
          </AdminLayout>
        }
      />

      <Route
        path="/admin/categories"
        element={
          <AdminLayout>
            <Categories />
          </AdminLayout>
        }
      />
    </Routes>
  );
}
