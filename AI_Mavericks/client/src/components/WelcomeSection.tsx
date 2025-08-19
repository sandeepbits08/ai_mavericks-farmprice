import type { User } from "@shared/schema";
import { useLanguage } from "@/context/LanguageContext";
import { getTranslation, formatIndianNumber, getCurrencySymbol } from "@/lib/translations";

interface WelcomeSectionProps {
  user: User;
  bestPrice: number;
  priceTrend: number;
}

export default function WelcomeSection({ user, bestPrice, priceTrend }: WelcomeSectionProps) {
  const { currentLanguage } = useLanguage();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return getTranslation("Good Morning", currentLanguage);
    if (hour < 17) return getTranslation("Good Afternoon", currentLanguage);
    return getTranslation("Good Evening", currentLanguage);
  };

  return (
    <section className="mb-8">
      <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-6 text-white">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h2 className="text-2xl font-bold mb-2" data-testid="greeting">
              {getGreeting()}, <span data-testid="user-name">{user.name}</span>!
            </h2>
            <p className="text-green-100 mb-4">
              {getTranslation("Here's today's market intelligence for your crops", currentLanguage)}
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="bg-white/20 rounded-lg px-4 py-2">
                <p className="text-sm text-green-100">
                  {getTranslation("Today's Best Price", currentLanguage)}
                </p>
                <p className="text-xl font-bold" data-testid="best-price">
                  {getCurrencySymbol(currentLanguage)}{currentLanguage === "hi" ? formatIndianNumber(bestPrice) : bestPrice.toLocaleString()}/{getTranslation("quintal", currentLanguage)}
                </p>
              </div>
              <div className="bg-white/20 rounded-lg px-4 py-2">
                <p className="text-sm text-green-100">
                  {getTranslation("Price Trend", currentLanguage)}
                </p>
                <p className="text-xl font-bold flex items-center" data-testid="price-trend">
                  <i className={`fas ${priceTrend >= 0 ? 'fa-arrow-up text-accent' : 'fa-arrow-down text-red-300'} mr-1`}></i>
                  {priceTrend >= 0 ? '+' : ''}{priceTrend.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center">
              <i className="fas fa-chart-line text-4xl"></i>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
