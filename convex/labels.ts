import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

export const listLabels = query({
  handler: async (ctx) => {
    const labels = await ctx.db.query('labels').collect()
    return labels
  },
})

export const createLabel = mutation({
  args: {
    name: v.string(),
    color: v.string(),
  },
  handler: async (ctx, args) => {
    const labelId = await ctx.db.insert('labels', {
      name: args.name,
      color: args.color,
    })
    return labelId
  },
})
