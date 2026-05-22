import { InsertUser, InsertGuestConfirmation } from "../drizzle/schema";

export async function upsertUser(user: InsertUser): Promise<void> {
  // No-op since database is removed
  console.log("Mock upsertUser", user.openId);
}

export async function getUserByOpenId(openId: string) {
  // Return mock admin user to avoid breaking the auth system
  return { id: 1, openId, role: "admin" as const, name: "Admin", email: "", loginMethod: "", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() };
}

export async function createGuestConfirmation(data: InsertGuestConfirmation) {
  return [{ insertId: 1 }];
}

export async function getAllConfirmations() {
  return [];
}

export async function getConfirmationStats() {
  return { total: 0, confirmed: 0, declined: 0, maybe: 0, totalCompanions: 0 };
}
