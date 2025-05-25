import { pgTable, text, serial, integer, numeric, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Original users table kept for reference
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Project items table
export const items = pgTable("items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  cost: numeric("cost", { precision: 10, scale: 2 }).notNull(),
  userId: text("user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Other costs table
export const otherCosts = pgTable("other_costs", {
  id: serial("id").primaryKey(),
  description: text("description").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  userId: text("user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Define Zod schemas for validation
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertItemSchema = createInsertSchema(items).pick({
  name: true,
  cost: true,
  userId: true,
});

export const insertOtherCostSchema = createInsertSchema(otherCosts).pick({
  description: true,
  amount: true,
  userId: true,
});

// Types for our application
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertItem = z.infer<typeof insertItemSchema>;
export type Item = typeof items.$inferSelect;

export type InsertOtherCost = z.infer<typeof insertOtherCostSchema>;
export type OtherCost = typeof otherCosts.$inferSelect;

// Custom types for frontend
export type FirebaseItem = {
  id: string;
  name: string;
  cost: number;
  userId: string;
  createdAt: Date;
};

export type FirebaseOtherCost = {
  id: string;
  description: string;
  amount: number;
  userId: string;
  createdAt: Date;
};
