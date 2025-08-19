import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import Header from "@/components/Header";
import WelcomeSection from "@/components/WelcomeSection";
import QuickActions from "@/components/QuickActions";
import AIRecommendations from "@/components/AIRecommendations";
import MarketPricesGrid from "@/components/MarketPricesGrid";
import PriceTrendChart from "@/components/PriceTrendChart";
import MarketComparison from "@/components/MarketComparison";
import DataSources from "@/components/DataSources";
import MobileNavigation from "@/components/MobileNavigation";
import type { DashboardData } from "@shared/schema";

export default function Dashboard() {
  const { data: dashboardData, isLoading, error } = useQuery<DashboardData>({
    queryKey: ["/api/dashboard"],
    refetchInterval: 300000, // Refetch every 5 minutes
  });

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Unable to load dashboard</h2>
          <p className="text-gray-600">Please check your connection and try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 sm:pb-0">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {isLoading ? (
          <DashboardSkeleton />
        ) : dashboardData ? (
          <>
            <WelcomeSection 
              data-testid="welcome-section"
              user={dashboardData.user}
              bestPrice={dashboardData.todaysBestPrice}
              priceTrend={dashboardData.priceTrend}
            />
            
            <QuickActions data-testid="quick-actions" />
            
            <AIRecommendations 
              data-testid="ai-recommendations"
              recommendations={dashboardData.recommendations}
            />
            
            <MarketPricesGrid 
              data-testid="market-prices"
              prices={dashboardData.marketPrices}
            />
            
            <PriceTrendChart 
              data-testid="price-chart"
              chartData={dashboardData.priceChart}
            />
            
            <MarketComparison 
              data-testid="market-comparison"
              markets={dashboardData.nearbyMarkets}
            />
            
            <DataSources data-testid="data-sources" />
          </>
        ) : null}
      </main>
      
      <MobileNavigation data-testid="mobile-nav" />
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-40 w-full rounded-2xl" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-32 w-full rounded-xl" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-40 w-full rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-80 w-full rounded-xl" />
    </div>
  );
}
