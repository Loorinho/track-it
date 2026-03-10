import { v } from 'convex/values'
import { mutation, query } from './_generated/server'


export const updateTaskStatus = mutation({
  args: {
    taskId: v.id('tasks'),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.taskId, {
      status: args.status,
    })
  },
})


export const deleteTask = mutation({
  args: {
    taskId: v.id('tasks'),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.taskId)
    return true
  },
})

export const getProjectProgress =  query({
  args: {
    projectId: v.id('projects'),
  },
  handler: async (ctx, args) => {
    const tasks = await ctx.db
      .query('tasks')
      .withIndex('projectId', (q) => q.eq('projectId', args.projectId))
      .collect()

    const completedTasks = tasks.filter((task) => task.status === 'completed')
    const progress = (tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0).toFixed(2)


      return progress
  },
})
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
    priority: v.string(),
    projectId: v.id('projects'),
  },
  handler: async (ctx, args) => {
    const taskId = await ctx.db.insert('tasks', {
      name: args.name,
      projectId: args.projectId,
      description: args.description,
      status: 'pending',
      priority: args.priority,

    })
    return taskId
  },
})
