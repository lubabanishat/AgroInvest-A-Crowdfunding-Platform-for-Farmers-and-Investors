import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import FarmerLogin from "./pages/FarmerLogin";
import AdminLogin from "./pages/AdminLogin";
import Register from "./pages/Register";

import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";

import Payment from "./pages/Payment";
import PaymentSuccess from "./pages/PaymentSuccess";

import InvestorDashboard from "./pages/InvestorDashboard";
import InvestorProfitReport from "./pages/InvestorProfitReport";
import MyInvestment from "./pages/MyInvestment";

import FarmerDashboard from "./pages/FarmerDashboard";
import CreateProject from "./pages/CreateProject";
import FarmerProfitReport from "./pages/FarmerProfitReport";

import AdminDashboard from "./pages/AdminDashboard";

import About from "./pages/About";
import Contact from "./pages/Contact";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/farmer/login" element={<FarmerLogin />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/register" element={<Register />} />

        {/* Projects */}
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:id" element={<ProjectDetails />} />

        {/* Payment */}
        <Route path="/payment/:id" element={<Payment />} />
        <Route
          path="/payment-success"
          element={<PaymentSuccess />}
        />

        {/* Investor */}
        <Route
          path="/investor/dashboard"
          element={<InvestorDashboard />}
        />

        <Route
          path="/investor/my-investments"
          element={<MyInvestment />}
        />

        <Route
          path="/investor/profit-report"
          element={<InvestorProfitReport />}
        />

        {/* Farmer */}
        <Route
          path="/farmer/dashboard"
          element={<FarmerDashboard />}
        />

        <Route
          path="/farmer/create-project"
          element={<CreateProject />}
        />

        <Route
          path="/farmer/profit-report"
          element={<FarmerProfitReport />}
        />

        {/* Admin */}
        <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}
        />

        {/* Other Pages */}
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;