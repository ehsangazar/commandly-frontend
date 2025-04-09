import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import Header from "./components/Header/Header";
import Home from "./pages/home/Home";
import "./styles/global.css";
import "./App.css";
import Contact from "./pages/contact/Contact";
import Pricing from "./pages/pricing/Pricing";
import Privacy from "./pages/privacy/Privacy";
import Terms from "./pages/terms/Terms";
import Login from "./pages/login/Login";
import About from "./pages/about/About";
import ScreenTime from "./pages/dashboard/screen-time/ScreenTime";
import DashboardLayout from "./components/layouts/DashboardLayout";
import Dashboard from "./pages/dashboard/home/Dashboard";

const AppContent = () => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/dashboard");

  return (
    <>
      {!isDashboard && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="screen-time" element={<ScreenTime />} />
        </Route>
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
};

export default App;
