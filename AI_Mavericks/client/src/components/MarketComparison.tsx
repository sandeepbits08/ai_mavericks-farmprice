import { useToast } from "@/hooks/use-toast";
import type { Market } from "@shared/schema";

interface MarketComparisonProps {
  markets: (Market & { 
    wheatPrice?: number; 
    ricePrice?: number; 
    trend?: string;
    wheatChange?: number;
    riceChange?: number;
  })[];
}

export default function MarketComparison({ markets }: MarketComparisonProps) {
  const { toast } = useToast();

  const handleViewMarket = (marketName: string) => {
    toast({
      title: "Market Details",
      description: `Detailed information for ${marketName} will be available soon.`,
    });
  };

  const getTrendBadge = (trend?: string) => {
    switch (trend) {
      case 'rising':
        return 'bg-success text-white';
      case 'falling':
        return 'bg-error text-white';
      default:
        return 'bg-warning text-white';
    }
  };

  const getTrendText = (trend?: string) => {
    switch (trend) {
      case 'rising':
        return 'Rising';
      case 'falling':
        return 'Falling';
      default:
        return 'Stable';
    }
  };

  const formatPrice = (price?: number) => {
    return price ? `₹${price.toLocaleString()}` : 'N/A';
  };

  const formatChange = (change?: number) => {
    if (!change) return '';
    const icon = change >= 0 ? 'fa-arrow-up' : 'fa-arrow-down';
    const color = change >= 0 ? 'text-success' : 'text-error';
    return (
      <span className={`text-xs ${color} ml-2`}>
        <i className={`fas ${icon}`}></i> {change >= 0 ? '+' : ''}{change.toFixed(1)}%
      </span>
    );
  };

  if (!markets.length) {
    return (
      <section className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Nearby Markets Comparison</h3>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <i className="fas fa-map-marker-alt text-4xl text-gray-300 mb-4"></i>
          <p className="text-gray-500">No market data available.</p>
          <p className="text-sm text-gray-400 mt-2">Market comparison will be displayed once data is available.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-8">
      <h3 className="text-lg font-semibold mb-4">Nearby Markets Comparison</h3>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Market</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Distance</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Wheat Price</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Rice Price</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Trend</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {markets.map((market) => (
                <tr key={market.id} className="hover:bg-gray-50" data-testid={`market-row-${market.name.toLowerCase().replace(' ', '-')}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <i className="fas fa-map-marker-alt text-primary text-sm"></i>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{market.name}</p>
                        <p className="text-xs text-gray-500">{market.marketType} {market.location}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {market.distanceKm ? `${market.distanceKm} km` : 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-gray-900" data-testid={`wheat-price-${market.id}`}>
                      {formatPrice(market.wheatPrice)}
                    </span>
                    {formatChange(market.wheatChange)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-gray-900" data-testid={`rice-price-${market.id}`}>
                      {formatPrice(market.ricePrice)}
                    </span>
                    {formatChange(market.riceChange)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${getTrendBadge(market.trend)}`}>
                      {getTrendText(market.trend)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleViewMarket(market.name)}
                      className="text-primary text-sm font-medium hover:text-secondary transition-colors"
                      data-testid={`view-market-${market.id}`}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
