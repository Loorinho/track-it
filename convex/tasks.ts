import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

export const listProjectTasks = query({
  args: {
    projectId: v.id('projects'),
  },
  handler: async (ctx, args) => {
    const tasks = await ctx.db
      .query('tasks')
      .withIndex('projectId', (q) => q.eq('projectId', args.projectId))
      .collect()

    return tasks
  },
})

export const createProjectTask = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    projectId: v.id('projects'),
  },
  handler: async (ctx, args) => {
    const taskId = await ctx.db.insert('tasks', {
      name: args.name,
      projectId: args.projectId,
      description: args.description,
      status: 'active',
    })
    return taskId
  },
})
