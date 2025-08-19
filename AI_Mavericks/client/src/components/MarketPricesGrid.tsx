import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/LanguageContext";
import { getTranslation, getCropName, formatIndianNumber, getCurrencySymbol } from "@/lib/translations";
import type { MarketPriceWithDetails } from "@shared/schema";

interface MarketPricesGridProps {
  prices: MarketPriceWithDetails[];
}

export default function MarketPricesGrid({ prices }: MarketPricesGridProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { currentLanguage } = useLanguage();

  const refreshMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/prices/refresh"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      toast({
        title: getTranslation("Prices Updated", currentLanguage),
        description: getTranslation("Market prices have been refreshed successfully.", currentLanguage),
      });
    },
    onError: () => {
      toast({
        title: getTranslation("Update Failed", currentLanguage),
        description: getTranslation("Unable to refresh prices. Please try again.", currentLanguage),
        variant: "destructive",
      });
    },
  });

  const getCropIcon = (cropName: string) => {
    switch (cropName.toLowerCase()) {
      case 'wheat':
        return 'fas fa-wheat-awn';
      case 'rice':
        return 'fas fa-seedling';
      case 'sugarcane':
        return 'fas fa-carrot';
      case 'cotton':
        return 'fas fa-cotton';
      case 'maize':
        return 'fas fa-corn';
      default:
        return 'fas fa-seedling';
    }
  };

  const getTrendColor = (trend: string | null) => {
    switch (trend) {
      case 'rising':
        return 'bg-success text-white';
      case 'falling':
        return 'bg-error text-white';
      default:
        return 'bg-warning text-white';
    }
  };

  const getTrendText = (trend: string | null) => {
    switch (trend) {
      case 'rising':
        return getTranslation('Rising', currentLanguage);
      case 'falling':
        return getTranslation('Falling', currentLanguage);
      default:
        return getTranslation('Stable', currentLanguage);
    }
  };

  const getTrendIcon = (changePercent: string | null) => {
    if (!changePercent) return 'fas fa-minus';
    const change = parseFloat(changePercent);
    return change >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down';
  };

  if (!prices.length) {
    return (
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{getTranslation("Today's Market Prices", currentLanguage)}</h3>
          <button
            onClick={() => refreshMutation.mutate()}
            disabled={refreshMutation.isPending}
            className="text-primary text-sm font-medium hover:text-secondary transition-colors disabled:opacity-50"
            data-testid="refresh-prices"
          >
            <i className={`fas fa-sync-alt mr-1 ${refreshMutation.isPending ? 'animate-spin' : ''}`}></i>
            {getTranslation("Refresh", currentLanguage)}
          </button>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
          <i className="fas fa-chart-line text-4xl text-gray-300 mb-4"></i>
          <p className="text-gray-500">No market price data available.</p>
          <p className="text-sm text-gray-400 mt-2">Price data will be displayed once available.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Today's Market Prices</h3>
        <button
          onClick={() => refreshMutation.mutate()}
          disabled={refreshMutation.isPending}
          className="text-primary text-sm font-medium hover:text-secondary transition-colors disabled:opacity-50"
          data-testid="refresh-prices"
        >
          <i className={`fas fa-sync-alt mr-1 ${refreshMutation.isPending ? 'animate-spin' : ''}`}></i>
          Refresh
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {prices.map((price) => (
          <div
            key={price.id}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
            data-testid={`price-card-${price.crop.name.toLowerCase()}`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <i className={`${getCropIcon(price.crop.name)} text-primary`}></i>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">
                    {getCropName(price.crop.name, price.crop.nameHindi, currentLanguage)}
                  </h4>
                  <p className="text-xs text-gray-500">
                    {getTranslation("Per", currentLanguage)} {getTranslation(price.crop.unit, currentLanguage)}
                  </p>
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${getTrendColor(price.trend)}`}>
                <i className={`${getTrendIcon(price.changePercent)} mr-1`}></i>
                {price.changePercent ? `${parseFloat(price.changePercent) >= 0 ? '+' : ''}${price.changePercent}%` : '0%'}
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{getTranslation("Current Price", currentLanguage)}</span>
                <span className="font-bold text-lg text-gray-900" data-testid={`current-price-${price.crop.name.toLowerCase()}`}>
                  {getCurrencySymbol(currentLanguage)}{currentLanguage === "hi" ? formatIndianNumber(parseFloat(price.price)) : parseFloat(price.price).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{getTranslation("Min-Max", currentLanguage)}</span>
                <span className="text-sm text-gray-500">
                  {getCurrencySymbol(currentLanguage)}{price.minPrice ? (currentLanguage === "hi" ? formatIndianNumber(parseFloat(price.minPrice)) : parseFloat(price.minPrice).toLocaleString()) : getTranslation('N/A', currentLanguage)} - 
                  {getCurrencySymbol(currentLanguage)}{price.maxPrice ? (currentLanguage === "hi" ? formatIndianNumber(parseFloat(price.maxPrice)) : parseFloat(price.maxPrice).toLocaleString()) : getTranslation('N/A', currentLanguage)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{getTranslation("Market", currentLanguage)}</span>
                <span className="text-sm font-medium text-primary">{price.market.location}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
