import { Routes, Route } from "react-router";
import "./App.css";
import Login from "./pages/auth/Login";
import LandingPage from "./pages/app/LandingPage";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import Transaction from "./pages/transaction/Transaction";
import Budget from "./pages/budget/Budget";
import Categories from "./pages/categories/Categories";
import Account from "./pages/account/Account";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transactions" element={<Transaction />} />
          <Route path="/accounts" element={<Account />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/categories" element={<Categories />} />
        </Route>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Routes>
    </>
  );
}

export default App;
