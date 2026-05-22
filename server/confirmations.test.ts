import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createAdminContext(): TrpcContext {
  const user = {
    id: 1,
    openId: "admin-user",
    email: "admin@example.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin" as const,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return ctx;
}

function createPublicContext(): TrpcContext {
  const ctx: TrpcContext = {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return ctx;
}

describe("confirmations", () => {
  describe("submit", () => {
    it("should accept a guest confirmation with valid data", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.confirmations.submit({
        fullName: "João Silva",
        numberOfCompanions: 2,
        confirmationStatus: "yes",
      });

      expect(result).toBeDefined();
      // The result is an array with the insert result
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it("should reject empty name", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.confirmations.submit({
          fullName: "",
          numberOfCompanions: 0,
          confirmationStatus: "yes",
        })
      ).rejects.toThrow();
    });

    it("should accept 'maybe' status", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.confirmations.submit({
        fullName: "Maria Santos",
        numberOfCompanions: 1,
        confirmationStatus: "maybe",
      });

      expect(result).toBeDefined();
    });

    it("should accept 'no' status", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.confirmations.submit({
        fullName: "Pedro Costa",
        numberOfCompanions: 0,
        confirmationStatus: "no",
      });

      expect(result).toBeDefined();
    });
  });

  describe("list", () => {
    it("should allow admin to list confirmations", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.confirmations.list();
      expect(Array.isArray(result)).toBe(true);
    });

    it("should reject non-authenticated users", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      // Public users without authentication will get "Please login" error
      await expect(caller.confirmations.list()).rejects.toThrow();
    });
  });

  describe("stats", () => {
    it("should allow admin to get stats", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.confirmations.stats();
      expect(result).toHaveProperty("total");
      expect(result).toHaveProperty("confirmed");
      expect(result).toHaveProperty("declined");
      expect(result).toHaveProperty("maybe");
      expect(result).toHaveProperty("totalCompanions");
      expect(typeof result.total).toBe("number");
      expect(typeof result.confirmed).toBe("number");
      expect(typeof result.declined).toBe("number");
      expect(typeof result.maybe).toBe("number");
      expect(typeof result.totalCompanions).toBe("number");
    });

    it("should reject non-authenticated users from getting stats", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      // Public users without authentication will get "Please login" error
      await expect(caller.confirmations.stats()).rejects.toThrow();
    });
  });
});
