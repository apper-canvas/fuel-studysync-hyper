import React, { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "@/App";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const LogoutButton = () => {
  const authContext = useContext(AuthContext);

  const handleLogout = async () => {
    if (authContext && authContext.logout) {
      await authContext.logout();
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLogout}
      className="flex items-center space-x-2 text-gray-600 hover:text-red-600"
      title="Logout"
    >
      <ApperIcon name="LogOut" className="w-4 h-4" />
      <span className="hidden sm:inline">Logout</span>
    </Button>
  );
};
const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { path: "/", label: "Dashboard", icon: "LayoutDashboard" },
    { path: "/courses", label: "Courses", icon: "BookOpen" },
    { path: "/assignments", label: "Assignments", icon: "FileText" },
    { path: "/schedule", label: "Schedule", icon: "Calendar" },
    { path: "/grades", label: "Grades", icon: "Award" },
  ];

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center shadow-lg">
                <ApperIcon name="GraduationCap" className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  StudySync
                </h1>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm",
                      isActive
                        ? "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border border-primary/20"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    )
                  }
                >
                  <ApperIcon name={item.icon} className="w-4 h-4" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>
{/* User Actions */}
            <div className="hidden md:flex items-center space-x-3">
              <LogoutButton />
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              <LogoutButton />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2"
              >
                <ApperIcon name={isMobileMenuOpen ? "X" : "Menu"} className="w-5 h-5" />
              </Button>
</Button>
            </div>
          </div>
        </div>
        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
            <nav className="px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium",
                      isActive
                        ? "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border border-primary/20"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    )
                  }
                >
                  <ApperIcon name={item.icon} className="w-5 h-5" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;