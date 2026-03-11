import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

// The schema is entirely optional.
// You can delete this file (schema.ts) and the
// app will continue to work.
// The schema provides more precise TypeScript types.
export default defineSchema({
  projectTypes: defineTable({
    name: v.string(),
    status: v.optional(v.boolean()),
  }).index('name', ['name']),
  projects: defineTable({
    name: v.string(),
    type: v.id('projectTypes'),
    status: v.optional(v.string()),
    description: v.string(),
  }).index('type', ['type']),
  tasks: defineTable({
    name: v.string(),
    projectId: v.id('projects'),
    priority: v.string(),
    description: v.string(),
    label: v.optional(v.id('labels')),
    status: v.string(),
  }).index('projectId', ['projectId']),
  labels: defineTable({
    name: v.string(),
    color: v.string()
  }).index('name', ['name']),
})


