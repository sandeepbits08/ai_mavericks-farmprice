import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertCropSchema, insertMarketSchema, insertMarketPriceSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Dashboard route
  app.get("/api/dashboard/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const dashboardData = await storage.getDashboardData(userId);
      res.json(dashboardData);
    } catch (error) {
      res.status(404).json({ message: "User not found or error fetching dashboard data" });
    }
  });

  // Get default dashboard for first user (for demo)
  app.get("/api/dashboard", async (req, res) => {
    try {
      // Get all users from storage
      const allUsers = await storage.getAllUsers();
      if (allUsers.length === 0) {
        // Create a default user if none exists
        const user = await storage.createUser({
          name: "Rajesh Kumar",
          location: "Bangalore, Karnataka", 
          phone: "+919876543210",
          preferredLanguage: "en"
        });
        const dashboardData = await storage.getDashboardData(user.id);
        return res.json(dashboardData);
      }
      const dashboardData = await storage.getDashboardData(allUsers[0].id);
      res.json(dashboardData);
    } catch (error) {
      console.error("Dashboard error:", error);
      // Create a default user if none exists
      try {
        const user = await storage.createUser({
          name: "Rajesh Kumar",
          location: "Bangalore, Karnataka", 
          phone: "+919876543210",
          preferredLanguage: "en"
        });
        const dashboardData = await storage.getDashboardData(user.id);
        res.json(dashboardData);
      } catch (createError) {
        console.error("Error creating user:", createError);
        res.status(500).json({ message: "Error creating dashboard" });
      }
    }
  });

  // Crops routes
  app.get("/api/crops", async (req, res) => {
    try {
      const crops = await storage.getCrops();
      res.json(crops);
    } catch (error) {
      res.status(500).json({ message: "Error fetching crops" });
    }
  });

  app.post("/api/crops", async (req, res) => {
    try {
      const validatedData = insertCropSchema.parse(req.body);
      const crop = await storage.createCrop(validatedData);
      res.status(201).json(crop);
    } catch (error) {
      res.status(400).json({ message: "Invalid crop data" });
    }
  });

  // Markets routes
  app.get("/api/markets", async (req, res) => {
    try {
      const markets = await storage.getMarkets();
      res.json(markets);
    } catch (error) {
      res.status(500).json({ message: "Error fetching markets" });
    }
  });

  app.get("/api/markets/nearby", async (req, res) => {
    try {
      const { location, limit } = req.query;
      const markets = await storage.getNearbyMarkets(
        location as string || "Bangalore, Karnataka",
        limit ? parseInt(limit as string) : 10
      );
      res.json(markets);
    } catch (error) {
      res.status(500).json({ message: "Error fetching nearby markets" });
    }
  });

  // Market prices routes
  app.get("/api/prices", async (req, res) => {
    try {
      const prices = await storage.getCurrentPrices();
      res.json(prices);
    } catch (error) {
      res.status(500).json({ message: "Error fetching market prices" });
    }
  });

  app.get("/api/prices/market/:marketId", async (req, res) => {
    try {
      const { marketId } = req.params;
      const prices = await storage.getMarketPrices(marketId);
      res.json(prices);
    } catch (error) {
      res.status(500).json({ message: "Error fetching market prices" });
    }
  });

  app.get("/api/prices/crop/:cropId", async (req, res) => {
    try {
      const { cropId } = req.params;
      const prices = await storage.getCropPrices(cropId);
      res.json(prices);
    } catch (error) {
      res.status(500).json({ message: "Error fetching crop prices" });
    }
  });

  app.post("/api/prices", async (req, res) => {
    try {
      const validatedData = insertMarketPriceSchema.parse(req.body);
      const price = await storage.createMarketPrice(validatedData);
      res.status(201).json(price);
    } catch (error) {
      res.status(400).json({ message: "Invalid price data" });
    }
  });

  // Price history routes
  app.get("/api/price-history/:cropId", async (req, res) => {
    try {
      const { cropId } = req.params;
      const { marketId, days } = req.query;
      const history = await storage.getPriceHistory(
        cropId,
        marketId as string,
        days ? parseInt(days as string) : 30
      );
      res.json(history);
    } catch (error) {
      res.status(500).json({ message: "Error fetching price history" });
    }
  });

  // Chart data route
  app.get("/api/chart-data/:cropId", async (req, res) => {
    try {
      const { cropId } = req.params;
      const { marketId } = req.query;
      const chartData = await storage.getPriceChartData(cropId, marketId as string);
      res.json(chartData);
    } catch (error) {
      res.status(500).json({ message: "Error fetching chart data" });
    }
  });

  // AI Recommendations routes
  app.get("/api/recommendations", async (req, res) => {
    try {
      const { userId } = req.query;
      const recommendations = await storage.getActiveRecommendations(userId as string);
      res.json(recommendations);
    } catch (error) {
      res.status(500).json({ message: "Error fetching recommendations" });
    }
  });

  // User routes
  app.get("/api/users/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(validatedData);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  // Refresh prices endpoint (for real implementation would sync with government APIs)
  app.post("/api/prices/refresh", async (req, res) => {
    try {
      // In a real implementation, this would:
      // 1. Fetch latest data from AGMARKNET API
      // 2. Update prices in storage
      // 3. Generate new AI recommendations
      
      res.json({ 
        message: "Price data refreshed successfully",
        lastSync: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ message: "Error refreshing price data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
