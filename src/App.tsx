import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
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
import Clips from "./pages/dashboard/clips/Clips";
import Header from "./components/Header/Header";
import Success from "./pages/subscription/Success";
import CancelSubscription from "./pages/subscription/Cancel";

const withoutHeader = [
  '/login',
  '/dashboard'
]

const AppContent = () => {
  const location = useLocation();
  const shouldHideHeader = withoutHeader.some(path => location.pathname.startsWith(path));

  return (
    <>
      {!shouldHideHeader && <Header />}
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
          <Route path="clips" element={<Clips />} />
          <Route path="screen-time" element={<ScreenTime />} />
        </Route>
        <Route path="/subscription/success" element={<Success />} />
        <Route path="/subscription/cancel" element={<CancelSubscription />} />
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
