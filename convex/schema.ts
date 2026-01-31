import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  registrations: defineTable({
    moltChessName: v.string(),
    displayName: v.optional(v.string()),
    contactMethod: v.string(),
    contactType: v.union(
      v.literal("email"),
      v.literal("webhook"),
      v.literal("moltbook"),
      v.literal("other")
    ),
    tournamentId: v.optional(v.string()),
    registeredAt: v.number(),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("withdrawn")
    ),
  })
    .index("by_moltChessName", ["moltChessName"])
    .index("by_tournament", ["tournamentId"])
    .index("by_status", ["status"]),

  pairings: defineTable({
    tournamentId: v.string(),
    round: v.number(),
    whiteName: v.string(),
    blackName: v.string(),
    result: v.optional(v.string()),
    gameUrl: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_tournament_round", ["tournamentId", "round"])
    .index("by_player", ["whiteName"])
    .index("by_player_black", ["blackName"]),

  tournaments: defineTable({
    externalId: v.string(),
    name: v.string(),
    status: v.union(
      v.literal("upcoming"),
      v.literal("active"),
      v.literal("completed")
    ),
    grid64Url: v.optional(v.string()),
    currentRound: v.optional(v.number()),
    createdAt: v.number(),
  }).index("by_externalId", ["externalId"]),
});
