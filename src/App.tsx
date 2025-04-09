import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import Header from "./components/header";
import Home from "./pages/home";
import Dashboard from "./pages/dashboard";
import "./styles/global.css";
import "./App.css";
import Contact from "./pages/contact";
import Pricing from "./pages/pricing";
import Privacy from "./pages/privacy";
import Terms from "./pages/terms";
import Login from "./pages/login";
import About from "./pages/about";
import ScreenTime from "./pages/screen-time";

const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />}>
            <Route
              index
              element={<Navigate to="/dashboard/screen-time" replace />}
            />
            <Route path="screen-time" element={<ScreenTime />} />
            {/* Add more dashboard routes here */}
          </Route>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
