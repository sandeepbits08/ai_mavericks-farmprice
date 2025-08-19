import { 
  type User, type InsertUser,
  type Crop, type InsertCrop,
  type Market, type InsertMarket,
  type MarketPrice, type InsertMarketPrice,
  type PriceHistory, type InsertPriceHistory,
  type AIRecommendation, type InsertAIRecommendation,
  type MarketPriceWithDetails,
  type DashboardData,
  type PriceChartData
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByPhone(phone: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  
  // Crop methods
  getCrops(): Promise<Crop[]>;
  getCrop(id: string): Promise<Crop | undefined>;
  createCrop(crop: InsertCrop): Promise<Crop>;
  
  // Market methods
  getMarkets(): Promise<Market[]>;
  getMarket(id: string): Promise<Market | undefined>;
  getNearbyMarkets(userLocation: string, limit?: number): Promise<Market[]>;
  createMarket(market: InsertMarket): Promise<Market>;
  
  // Price methods
  getCurrentPrices(): Promise<MarketPriceWithDetails[]>;
  getMarketPrices(marketId: string): Promise<MarketPriceWithDetails[]>;
  getCropPrices(cropId: string): Promise<MarketPriceWithDetails[]>;
  createMarketPrice(price: InsertMarketPrice): Promise<MarketPrice>;
  updateMarketPrice(id: string, price: Partial<MarketPrice>): Promise<MarketPrice | undefined>;
  
  // Price history methods
  getPriceHistory(cropId: string, marketId?: string, days?: number): Promise<PriceHistory[]>;
  createPriceHistory(history: InsertPriceHistory): Promise<PriceHistory>;
  
  // AI recommendations
  getActiveRecommendations(userId?: string): Promise<AIRecommendation[]>;
  createRecommendation(recommendation: InsertAIRecommendation): Promise<AIRecommendation>;
  
  // Dashboard data
  getDashboardData(userId: string): Promise<DashboardData>;
  
  // Chart data
  getPriceChartData(cropId: string, marketId?: string): Promise<PriceChartData>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private crops: Map<string, Crop>;
  private markets: Map<string, Market>;
  private marketPrices: Map<string, MarketPrice>;
  private priceHistory: Map<string, PriceHistory>;
  private aiRecommendations: Map<string, AIRecommendation>;

  constructor() {
    this.users = new Map();
    this.crops = new Map();
    this.markets = new Map();
    this.marketPrices = new Map();
    this.priceHistory = new Map();
    this.aiRecommendations = new Map();
    
    this.initializeData();
  }

  private initializeData() {
    // Initialize sample crops
    const crops = [
      { name: "Wheat", nameHindi: "गेहूं", category: "Cereals", unit: "quintal", icon: "wheat-awn" },
      { name: "Rice", nameHindi: "चावल", category: "Cereals", unit: "quintal", icon: "seedling" },
      { name: "Sugarcane", nameHindi: "गन्ना", category: "Cash Crops", unit: "quintal", icon: "carrot" },
      { name: "Cotton", nameHindi: "कपास", category: "Cash Crops", unit: "quintal", icon: "cotton" },
      { name: "Maize", nameHindi: "मक्का", category: "Cereals", unit: "quintal", icon: "corn" }
    ];

    crops.forEach(crop => {
      const id = randomUUID();
      this.crops.set(id, { ...crop, id });
    });

    // Initialize sample markets
    const markets = [
      { 
        name: "Mandya Market", 
        location: "Mandya", 
        district: "Mandya", 
        state: "Karnataka",
        distanceKm: 12,
        marketType: "APMC",
        latitude: "12.5239",
        longitude: "76.8956"
      },
      { 
        name: "Tumkur Market", 
        location: "Tumkur", 
        district: "Tumkur", 
        state: "Karnataka",
        distanceKm: 28,
        marketType: "APMC",
        latitude: "13.3379",
        longitude: "77.1006"
      },
      { 
        name: "Mysore Market", 
        location: "Mysore", 
        district: "Mysore", 
        state: "Karnataka",
        distanceKm: 45,
        marketType: "APMC",
        latitude: "12.2958",
        longitude: "76.6394"
      }
    ];

    markets.forEach(market => {
      const id = randomUUID();
      this.markets.set(id, { ...market, id });
    });

    // Initialize sample user
    const userId = randomUUID();
    this.users.set(userId, {
      id: userId,
      name: "Rajesh",
      location: "Bangalore, Karnataka",
      phone: "+919876543210",
      preferredLanguage: "en"
    });

    // Initialize market prices and recommendations
    this.initializePricesAndRecommendations();
  }

  private initializePricesAndRecommendations() {
    const cropIds = Array.from(this.crops.keys());
    const marketIds = Array.from(this.markets.keys());
    const userIds = Array.from(this.users.keys());

    // Generate current market prices
    const priceRanges = {
      "Wheat": { base: 2850, min: 2650, max: 3000 },
      "Rice": { base: 3200, min: 3000, max: 3400 },
      "Sugarcane": { base: 380, min: 350, max: 420 },
      "Cotton": { base: 6200, min: 5800, max: 6500 },
      "Maize": { base: 2100, min: 1950, max: 2250 }
    };

    const trends = ["rising", "falling", "stable"];
    
    cropIds.forEach(cropId => {
      const crop = this.crops.get(cropId)!;
      const priceRange = priceRanges[crop.name as keyof typeof priceRanges];
      
      marketIds.forEach(marketId => {
        const basePrice = priceRange.base;
        const variation = (Math.random() - 0.5) * 200; // ±100 variation
        const price = Math.round(basePrice + variation);
        const changePercent = (Math.random() - 0.5) * 20; // ±10% change
        
        const priceId = randomUUID();
        this.marketPrices.set(priceId, {
          id: priceId,
          cropId,
          marketId,
          price: price.toString(),
          minPrice: (price - 50).toString(),
          maxPrice: (price + 50).toString(),
          date: new Date(),
          trend: trends[Math.floor(Math.random() * trends.length)],
          changePercent: changePercent.toFixed(1)
        });

        // Generate price history
        for (let i = 0; i < 30; i++) {
          const historyPrice = basePrice + (Math.random() - 0.5) * 300;
          const date = new Date();
          date.setDate(date.getDate() - i);
          
          const historyId = randomUUID();
          this.priceHistory.set(historyId, {
            id: historyId,
            cropId,
            marketId,
            price: Math.round(historyPrice).toString(),
            date
          });
        }
      });
    });

    // Generate AI recommendations
    if (userIds.length > 0 && cropIds.length > 0) {
      const wheatId = Array.from(this.crops.values()).find(c => c.name === "Wheat")?.id;
      const mandyaMarketId = Array.from(this.markets.values()).find(m => m.name === "Mandya Market")?.id;
      
      if (wheatId && mandyaMarketId) {
        const recId = randomUUID();
        this.aiRecommendations.set(recId, {
          id: recId,
          userId: userIds[0],
          cropId: wheatId,
          recommendedMarketId: mandyaMarketId,
          recommendation: "Sell your wheat crop at Mandya Market within the next 3-5 days. Expected price: ₹2,850-2,950 per quintal.",
          confidence: "high",
          expectedPrice: "2900",
          timeframe: "3-5 days",
          alert: "Prices expected to drop by 8-12% next week due to increased supply from neighboring districts.",
          alertType: "warning",
          createdAt: new Date(),
          isActive: true
        });
      }
    }
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByPhone(phone: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.phone === phone);
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      phone: insertUser.phone || null,
      preferredLanguage: insertUser.preferredLanguage || "en"
    };
    this.users.set(id, user);
    return user;
  }

  async getCrops(): Promise<Crop[]> {
    return Array.from(this.crops.values());
  }

  async getCrop(id: string): Promise<Crop | undefined> {
    return this.crops.get(id);
  }

  async createCrop(insertCrop: InsertCrop): Promise<Crop> {
    const id = randomUUID();
    const crop: Crop = { 
      ...insertCrop, 
      id,
      nameHindi: insertCrop.nameHindi || null,
      unit: insertCrop.unit || "quintal",
      icon: insertCrop.icon || null
    };
    this.crops.set(id, crop);
    return crop;
  }

  async getMarkets(): Promise<Market[]> {
    return Array.from(this.markets.values());
  }

  async getMarket(id: string): Promise<Market | undefined> {
    return this.markets.get(id);
  }

  async getNearbyMarkets(userLocation: string, limit: number = 10): Promise<Market[]> {
    return Array.from(this.markets.values()).slice(0, limit);
  }

  async createMarket(insertMarket: InsertMarket): Promise<Market> {
    const id = randomUUID();
    const market: Market = { 
      ...insertMarket, 
      id,
      latitude: insertMarket.latitude || null,
      longitude: insertMarket.longitude || null,
      distanceKm: insertMarket.distanceKm || null,
      marketType: insertMarket.marketType || "APMC"
    };
    this.markets.set(id, market);
    return market;
  }

  async getCurrentPrices(): Promise<MarketPriceWithDetails[]> {
    const prices = Array.from(this.marketPrices.values());
    return prices.map(price => ({
      ...price,
      crop: this.crops.get(price.cropId)!,
      market: this.markets.get(price.marketId)!
    }));
  }

  async getMarketPrices(marketId: string): Promise<MarketPriceWithDetails[]> {
    const prices = Array.from(this.marketPrices.values()).filter(p => p.marketId === marketId);
    return prices.map(price => ({
      ...price,
      crop: this.crops.get(price.cropId)!,
      market: this.markets.get(price.marketId)!
    }));
  }

  async getCropPrices(cropId: string): Promise<MarketPriceWithDetails[]> {
    const prices = Array.from(this.marketPrices.values()).filter(p => p.cropId === cropId);
    return prices.map(price => ({
      ...price,
      crop: this.crops.get(price.cropId)!,
      market: this.markets.get(price.marketId)!
    }));
  }

  async createMarketPrice(insertPrice: InsertMarketPrice): Promise<MarketPrice> {
    const id = randomUUID();
    const price: MarketPrice = { 
      ...insertPrice, 
      id,
      date: insertPrice.date || new Date(),
      minPrice: insertPrice.minPrice || null,
      maxPrice: insertPrice.maxPrice || null,
      trend: insertPrice.trend || null,
      changePercent: insertPrice.changePercent || null
    };
    this.marketPrices.set(id, price);
    return price;
  }

  async updateMarketPrice(id: string, updateData: Partial<MarketPrice>): Promise<MarketPrice | undefined> {
    const existing = this.marketPrices.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updateData };
    this.marketPrices.set(id, updated);
    return updated;
  }

  async getPriceHistory(cropId: string, marketId?: string, days: number = 30): Promise<PriceHistory[]> {
    let history = Array.from(this.priceHistory.values()).filter(h => h.cropId === cropId);
    
    if (marketId) {
      history = history.filter(h => h.marketId === marketId);
    }
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return history
      .filter(h => h.date >= cutoffDate)
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  async createPriceHistory(insertHistory: InsertPriceHistory): Promise<PriceHistory> {
    const id = randomUUID();
    const history: PriceHistory = { ...insertHistory, id };
    this.priceHistory.set(id, history);
    return history;
  }

  async getActiveRecommendations(userId?: string): Promise<AIRecommendation[]> {
    let recommendations = Array.from(this.aiRecommendations.values()).filter(r => r.isActive);
    
    if (userId) {
      recommendations = recommendations.filter(r => r.userId === userId);
    }
    
    return recommendations.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createRecommendation(insertRecommendation: InsertAIRecommendation): Promise<AIRecommendation> {
    const id = randomUUID();
    const recommendation: AIRecommendation = { 
      ...insertRecommendation, 
      id,
      userId: insertRecommendation.userId || null,
      recommendedMarketId: insertRecommendation.recommendedMarketId || null,
      expectedPrice: insertRecommendation.expectedPrice || null,
      timeframe: insertRecommendation.timeframe || null,
      alert: insertRecommendation.alert || null,
      alertType: insertRecommendation.alertType || null,
      createdAt: new Date(),
      isActive: insertRecommendation.isActive !== false
    };
    this.aiRecommendations.set(id, recommendation);
    return recommendation;
  }

  async getDashboardData(userId: string): Promise<DashboardData> {
    const user = await this.getUser(userId);
    if (!user) throw new Error("User not found");

    const marketPrices = await this.getCurrentPrices();
    const recommendations = await this.getActiveRecommendations(userId);
    const wheatCrop = Array.from(this.crops.values()).find(c => c.name === "Wheat");
    
    // Calculate best price and trend
    const wheatPrices = marketPrices.filter(p => p.crop.name === "Wheat");
    const bestPrice = Math.max(...wheatPrices.map(p => parseFloat(p.price)));
    const avgChange = wheatPrices.reduce((sum, p) => sum + parseFloat(p.changePercent || "0"), 0) / wheatPrices.length;

    // Get price chart data
    const priceChart = wheatCrop ? await this.getPriceChartData(wheatCrop.id) : {
      labels: [],
      currentPrices: [],
      averagePrices: [],
      predictedPrices: []
    };

    // Get nearby markets with price info
    const nearbyMarkets = await this.getNearbyMarkets(user.location);
    const marketsWithPrices = nearbyMarkets.map(market => {
      const wheatPrice = marketPrices.find(p => p.marketId === market.id && p.crop.name === "Wheat");
      const ricePrice = marketPrices.find(p => p.marketId === market.id && p.crop.name === "Rice");
      
      return {
        ...market,
        wheatPrice: wheatPrice ? parseFloat(wheatPrice.price) : undefined,
        ricePrice: ricePrice ? parseFloat(ricePrice.price) : undefined,
        trend: wheatPrice?.trend || "stable",
        wheatChange: wheatPrice ? parseFloat(wheatPrice.changePercent || "0") : 0,
        riceChange: ricePrice ? parseFloat(ricePrice.changePercent || "0") : 0
      };
    });

    return {
      user,
      todaysBestPrice: bestPrice,
      priceTrend: avgChange,
      marketPrices: marketPrices.slice(0, 3), // Show top 3
      recommendations,
      priceChart,
      nearbyMarkets: marketsWithPrices
    };
  }

  async getPriceChartData(cropId: string, marketId?: string): Promise<PriceChartData> {
    const history = await this.getPriceHistory(cropId, marketId, 14);
    
    const labels = history.map(h => {
      const date = new Date(h.date);
      return `${date.getDate()} ${date.toLocaleDateString('en', { month: 'short' })}`;
    });

    const currentPrices = history.map(h => parseFloat(h.price));
    const averagePrices = currentPrices.map((_, i) => {
      const subset = currentPrices.slice(Math.max(0, i - 2), i + 1);
      return subset.reduce((sum, p) => sum + p, 0) / subset.length;
    });

    // Generate predicted prices for last 4 data points
    const predictedPrices: (number | null)[] = new Array(currentPrices.length - 4).fill(null);
    const trend = currentPrices[currentPrices.length - 1] > currentPrices[currentPrices.length - 5] ? 1.02 : 0.98;
    
    for (let i = currentPrices.length - 4; i < currentPrices.length; i++) {
      const basePrice = currentPrices[i - 1] || currentPrices[currentPrices.length - 5];
      predictedPrices.push(Math.round(basePrice * trend));
    }

    return {
      labels,
      currentPrices,
      averagePrices,
      predictedPrices
    };
  }
}

export const storage = new MemStorage();
