import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// The schema is entirely optional.
// You can delete this file (schema.ts) and the
// app will continue to work.
// The schema provides more precise TypeScript types.
export default defineSchema({
  numbers: defineTable({
    value: v.number(),
  }),
  projectTypes: defineTable({
    name: v.string(),
    status: v.optional(v.boolean()),
  }).index("name", ["name"]),
  projects: defineTable({
    name: v.string(),
    type: v.id("projectTypes"),
    description: v.string(),
  }).index("type", ["type"]),
});
