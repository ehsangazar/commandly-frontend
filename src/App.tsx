import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import Home from "./pages/home/Home";
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
import Footer from "./components/Footer";
import Cookies from "./pages/cookies/Cookies";
import Security from "./pages/security/Security";
import Careers from "./pages/careers/Careers";
import JobDetail from "./pages/careers/[id]";
import Blog from "./pages/blog/Blog";
import BlogPost from "./pages/blog/[id]";
import Download from "./pages/download/Download";
import Features from "./pages/features/Features";

const withoutHeader = ["/login", "/dashboard"];
const withoutFooter = ["/login", "/dashboard"];

const AppContent = () => {
  const location = useLocation();
  const shouldHideHeader = withoutHeader.some((path) =>
    location.pathname.startsWith(path)
  );
  const shouldHideFooter = withoutFooter.some((path) =>
    location.pathname.startsWith(path)
  );

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
        <Route path="/cookies" element={<Cookies />} />
        <Route path="/security" element={<Security />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/careers/:id" element={<JobDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogPost />} />
        <Route path="/download" element={<Download />} />
        <Route path="/features" element={<Features />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="clips" element={<Clips />} />
          <Route path="screen-time" element={<ScreenTime />} />
        </Route>
        <Route path="/dashboard.html" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="clips" element={<Clips />} />
          <Route path="screen-time" element={<ScreenTime />} />
        </Route>
        <Route path="/subscription/success" element={<Success />} />
        <Route path="/subscription/cancel" element={<CancelSubscription />} />
      </Routes>
      {!shouldHideFooter && <Footer />}
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
