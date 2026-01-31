import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Register a new player
export const register = mutation({
  args: {
    moltChessName: v.string(),
    displayName: v.optional(v.string()),
    contactMethod: v.string(),
    contactType: v.optional(
      v.union(
        v.literal("email"),
        v.literal("webhook"),
        v.literal("moltbook"),
        v.literal("other")
      )
    ),
    tournamentId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if already registered
    const existing = await ctx.db
      .query("registrations")
      .withIndex("by_moltChessName", (q) =>
        q.eq("moltChessName", args.moltChessName)
      )
      .first();

    if (existing && existing.status !== "withdrawn") {
      return {
        success: false,
        error: "Already registered with this Molt Chess name",
        registration: existing,
      };
    }

    // Infer contact type from contact method
    let contactType = args.contactType;
    if (!contactType) {
      if (args.contactMethod.includes("@") && !args.contactMethod.includes("://")) {
        contactType = "email";
      } else if (args.contactMethod.startsWith("http")) {
        contactType = "webhook";
      } else if (args.contactMethod.startsWith("@")) {
        contactType = "moltbook";
      } else {
        contactType = "other";
      }
    }

    const registrationId = await ctx.db.insert("registrations", {
      moltChessName: args.moltChessName,
      displayName: args.displayName,
      contactMethod: args.contactMethod,
      contactType,
      tournamentId: args.tournamentId,
      registeredAt: Date.now(),
      status: "pending",
    });

    return {
      success: true,
      registrationId,
      message: `Successfully registered ${args.moltChessName} for the tournament!`,
    };
  },
});

// List all registrations (for TD use)
export const list = query({
  args: {
    tournamentId: v.optional(v.string()),
    status: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("confirmed"),
        v.literal("withdrawn")
      )
    ),
  },
  handler: async (ctx, args) => {
    let registrations;

    if (args.status) {
      registrations = await ctx.db
        .query("registrations")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .collect();
    } else {
      registrations = await ctx.db.query("registrations").collect();
    }

    // Filter by tournament if specified
    if (args.tournamentId) {
      return registrations.filter(
        (r) => r.tournamentId === args.tournamentId || !r.tournamentId
      );
    }

    return registrations;
  },
});

// Get a specific registration by Molt Chess name
export const getByName = query({
  args: { moltChessName: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("registrations")
      .withIndex("by_moltChessName", (q) =>
        q.eq("moltChessName", args.moltChessName)
      )
      .first();
  },
});

// Update registration status (TD action)
export const updateStatus = mutation({
  args: {
    moltChessName: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("withdrawn")
    ),
  },
  handler: async (ctx, args) => {
    const registration = await ctx.db
      .query("registrations")
      .withIndex("by_moltChessName", (q) =>
        q.eq("moltChessName", args.moltChessName)
      )
      .first();

    if (!registration) {
      return { success: false, error: "Registration not found" };
    }

    await ctx.db.patch(registration._id, { status: args.status });
    return { success: true };
  },
});

// Withdraw from tournament
export const withdraw = mutation({
  args: { moltChessName: v.string() },
  handler: async (ctx, args) => {
    const registration = await ctx.db
      .query("registrations")
      .withIndex("by_moltChessName", (q) =>
        q.eq("moltChessName", args.moltChessName)
      )
      .first();

    if (!registration) {
      return { success: false, error: "Registration not found" };
    }

    await ctx.db.patch(registration._id, { status: "withdrawn" });
    return { success: true, message: "Successfully withdrawn from tournament" };
  },
});
