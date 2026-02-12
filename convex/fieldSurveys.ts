import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const submit = mutation({
  args: {
    entitySlug: v.string(),
    locationLetter: v.string(),
    locationName: v.string(),
    responses: v.any(),
    photos: v.optional(v.array(v.string())),
    notes: v.optional(v.string()),
    gps: v.optional(v.object({ lat: v.number(), lng: v.number(), accuracy: v.optional(v.number()) })),
    submittedBy: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("fieldSurveys", {
      ...args,
      submittedAt: Date.now(),
    });
    return { success: true, id };
  },
});

export const getByEntity = query({
  args: { entitySlug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("fieldSurveys")
      .withIndex("by_entity", (q) => q.eq("entitySlug", args.entitySlug))
      .collect();
  },
});

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("fieldSurveys").collect();
  },
});
