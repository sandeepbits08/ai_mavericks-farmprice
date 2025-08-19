import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/LanguageContext";
import { getTranslation } from "@/lib/translations";

export default function QuickActions() {
  const { toast } = useToast();
  const { currentLanguage } = useLanguage();

  const handleAction = (action: string) => {
    toast({
      title: getTranslation("Feature Coming Soon", currentLanguage),
      description: `${getTranslation(action, currentLanguage)} functionality will be available in the next update.`,
    });
  };

  const actions = [
    {
      icon: "fas fa-seedling",
      title: getTranslation("Select Crop", currentLanguage),
      description: getTranslation("Choose your produce", currentLanguage),
      color: "primary",
      action: "Select Crop"
    },
    {
      icon: "fas fa-balance-scale",
      title: getTranslation("Compare Markets", currentLanguage),
      description: getTranslation("Find best prices", currentLanguage),
      color: "accent",
      action: "Compare Markets"
    },
    {
      icon: "fas fa-chart-area",
      title: getTranslation("Price Trends", currentLanguage),
      description: getTranslation("Historical data", currentLanguage),
      color: "secondary",
      action: "Price Trends"
    },
    {
      icon: "fas fa-robot",
      title: getTranslation("AI Insights", currentLanguage),
      description: getTranslation("Smart recommendations", currentLanguage),
      color: "purple",
      action: "AI Insights"
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case "primary":
        return "bg-primary/10 text-primary";
      case "accent":
        return "bg-accent/10 text-accent";
      case "secondary":
        return "bg-secondary/10 text-secondary";
      case "purple":
        return "bg-purple-100 text-purple-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <section className="mb-8">
      <h3 className="text-lg font-semibold mb-4">{getTranslation("Quick Actions", currentLanguage)}</h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={() => handleAction(action.action)}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-center"
            data-testid={`action-${action.action.toLowerCase().replace(' ', '-')}`}
          >
            <div className={`w-12 h-12 ${getColorClasses(action.color)} rounded-lg flex items-center justify-center mx-auto mb-3`}>
              <i className={`${action.icon} text-xl`}></i>
            </div>
            <p className="font-medium text-gray-900">{action.title}</p>
            <p className="text-xs text-gray-500 mt-1">{action.description}</p>
          </button>
        ))}
      </div>
    </section>
  );
}
