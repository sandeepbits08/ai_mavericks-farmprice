import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  location: text("location").notNull(),
  phone: text("phone"),
  preferredLanguage: text("preferred_language").default("en"),
});

export const crops = pgTable("crops", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  nameHindi: text("name_hindi"),
  category: text("category").notNull(),
  unit: text("unit").notNull().default("quintal"),
  icon: text("icon").default("seedling"),
});

export const markets = pgTable("markets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  location: text("location").notNull(),
  district: text("district").notNull(),
  state: text("state").notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 7 }),
  longitude: decimal("longitude", { precision: 10, scale: 7 }),
  distanceKm: integer("distance_km"),
  marketType: text("market_type").default("APMC"),
});

export const marketPrices = pgTable("market_prices", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  cropId: varchar("crop_id").notNull().references(() => crops.id),
  marketId: varchar("market_id").notNull().references(() => markets.id),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  minPrice: decimal("min_price", { precision: 10, scale: 2 }),
  maxPrice: decimal("max_price", { precision: 10, scale: 2 }),
  date: timestamp("date").notNull().defaultNow(),
  trend: text("trend"), // "rising", "falling", "stable"
  changePercent: decimal("change_percent", { precision: 5, scale: 2 }),
});

export const priceHistory = pgTable("price_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  cropId: varchar("crop_id").notNull().references(() => crops.id),
  marketId: varchar("market_id").notNull().references(() => markets.id),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  date: timestamp("date").notNull(),
});

export const aiRecommendations = pgTable("ai_recommendations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  cropId: varchar("crop_id").notNull().references(() => crops.id),
  recommendedMarketId: varchar("recommended_market_id").references(() => markets.id),
  recommendation: text("recommendation").notNull(),
  confidence: text("confidence").notNull(), // "high", "medium", "low"
  expectedPrice: decimal("expected_price", { precision: 10, scale: 2 }),
  timeframe: text("timeframe"), // "3-5 days", "next week", etc.
  alert: text("alert"),
  alertType: text("alert_type"), // "warning", "info", "success"
  createdAt: timestamp("created_at").notNull().defaultNow(),
  isActive: boolean("is_active").default(true),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertCropSchema = createInsertSchema(crops).omit({ id: true });
export const insertMarketSchema = createInsertSchema(markets).omit({ id: true });
export const insertMarketPriceSchema = createInsertSchema(marketPrices).omit({ id: true });
export const insertPriceHistorySchema = createInsertSchema(priceHistory).omit({ id: true });
export const insertAIRecommendationSchema = createInsertSchema(aiRecommendations).omit({ id: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Crop = typeof crops.$inferSelect;
export type InsertCrop = z.infer<typeof insertCropSchema>;
export type Market = typeof markets.$inferSelect;
export type InsertMarket = z.infer<typeof insertMarketSchema>;
export type MarketPrice = typeof marketPrices.$inferSelect;
export type InsertMarketPrice = z.infer<typeof insertMarketPriceSchema>;
export type PriceHistory = typeof priceHistory.$inferSelect;
export type InsertPriceHistory = z.infer<typeof insertPriceHistorySchema>;
export type AIRecommendation = typeof aiRecommendations.$inferSelect;
export type InsertAIRecommendation = z.infer<typeof insertAIRecommendationSchema>;

// Extended types for API responses
export type MarketPriceWithDetails = MarketPrice & {
  crop: Crop;
  market: Market;
};

export type PriceChartData = {
  labels: string[];
  currentPrices: number[];
  averagePrices: number[];
  predictedPrices: (number | null)[];
};

export type DashboardData = {
  user: User;
  todaysBestPrice: number;
  priceTrend: number;
  marketPrices: MarketPriceWithDetails[];
  recommendations: AIRecommendation[];
  priceChart: PriceChartData;
  nearbyMarkets: (Market & { 
    wheatPrice?: number; 
    ricePrice?: number; 
    trend?: string;
    wheatChange?: number;
    riceChange?: number;
  })[];
};
