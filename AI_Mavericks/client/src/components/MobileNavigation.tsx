import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function MobileNavigation() {
  const [activeTab, setActiveTab] = useState("home");
  const { toast } = useToast();

  const handleNavigation = (tab: string, label: string) => {
    setActiveTab(tab);
    if (tab !== "home") {
      toast({
        title: "Feature Coming Soon",
        description: `${label} section will be available in the next update.`,
      });
    }
  };

  const navItems = [
    { id: "home", icon: "fas fa-home", label: "Home" },
    { id: "prices", icon: "fas fa-chart-line", label: "Prices" },
    { id: "markets", icon: "fas fa-map-marker-alt", label: "Markets" },
    { id: "insights", icon: "fas fa-robot", label: "Insights" },
    { id: "profile", icon: "fas fa-user", label: "Profile" }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 sm:hidden z-40">
      <div className="flex">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavigation(item.id, item.label)}
            className={`flex-1 flex flex-col items-center py-3 px-2 ${
              activeTab === item.id ? 'text-primary' : 'text-gray-400'
            }`}
            data-testid={`nav-${item.id}`}
          >
            <i className={`${item.icon} text-lg mb-1`}></i>
            <span className={`text-xs ${activeTab === item.id ? 'font-medium' : ''}`}>
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
}
