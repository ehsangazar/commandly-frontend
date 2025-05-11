import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ConfigProvider } from "./contexts/ConfigContext";
import Home from "@/pages/home/Home";
import About from "@/pages/about/About";
import Contact from "@/pages/contact/Contact";
import Pricing from "@/pages/pricing/Pricing";
import Privacy from "@/pages/privacy/Privacy";
import Terms from "@/pages/terms/Terms";
import Cookies from "@/pages/cookies/Cookies";
import Security from "@/pages/security/Security";
import Careers from "@/pages/careers/Careers";
import Blog from "@/pages/blog/Blog";
import Download from "@/pages/download/Download";
import Features from "@/pages/features/Features";
import Profile from "@/pages/profile/Profile";
import Login from "@/pages/login/Login";
import DashboardApp from "@/pages/dashboard/App";
import NotFound from "@/pages/NotFound";
import CareersSingle from "@/pages/careers/CareersSingle";
import BlogSingle from "./pages/blog/BlogSingle";
import Chat from "@/pages/chat/Chat";
import "./App.css";
import MainLayout from "./layouts/MainLayout";
import DashboardLayout from "./layouts/DashboardLayout";

const App = () => {
  return (
    <ConfigProvider>
      <Router>
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />

          {/* Dashboard Routes */}
          <Route element={<DashboardLayout />}>
            <Route
              path="/dashboard"
              element={<Navigate to="/dashboard.html" replace />}
            />
            <Route path="/dashboard.html" element={<DashboardApp />} />
            <Route path="/chat" element={<Chat />} />
          </Route>

          {/* Main Layout Routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/cookies" element={<Cookies />} />
            <Route path="/security" element={<Security />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/careers/:id" element={<CareersSingle />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogSingle />} />
            <Route path="/download" element={<Download />} />
            <Route path="/features" element={<Features />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ConfigProvider>
  );
};

export default App;
