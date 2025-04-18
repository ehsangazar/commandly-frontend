import { useNavigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";

interface DashboardLayoutProps {
  title?: string;
}

const DashboardLayout = ({ title }: DashboardLayoutProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove("commandly_token", { path: "/" });
    navigate("/login");
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
      <div className="bg-white min-h-screen">
        <div className="">
          <div className="border-b border-dashed border-gray-300">
            <div className="py-4 flex justify-between items-center container mx-auto border-l border-r border-dashed border-gray-300 px-4">
              <div className="flex gap-3 items-center">
                <img src="/images/logo.jpeg" alt="logo" width={48} height={48} className="rounded-full me-5" />
                <div className="cursor-pointer text-black hover:text-gray-500" onClick={() => handleNavigation("/dashboard")}>Home</div>
                <div className="cursor-pointer text-black hover:text-gray-500" onClick={() => handleNavigation("/dashboard/screen-time")}>Screen Time</div>
                <div className="cursor-pointer text-black hover:text-gray-500" onClick={() => handleNavigation("/dashboard/clips")}>Clips</div>
              </div>

              <div>
                <Button variant={'link'} onClick={handleLogout}>Logout</Button>
              </div>
            </div>
          </div>

          <main className="min-h-screen">
            <div className="container mx-auto border-r border-l border-dashed border-gray-300 min-h-screen">
              <h2>{title}</h2>
              <Outlet />
            </div>
          </main>
        </div>
      </div>
  );
};

export default DashboardLayout;
