import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

export const listProjects = query({
  handler: async (ctx) => {
    const projects = await ctx.db.query('projects').collect()
    const projectTypes = await ctx.db.query('projectTypes').collect()

    const projectTypeById = new Map(
      projectTypes.map((projectType) => [projectType._id, projectType]),
    )

    return projects.map((project) => ({
      ...project,
      type: projectTypeById.get(project.type)?.name,
    }))
  },
})

export const createProject = mutation({
  args: {
    name: v.string(),
    type: v.id('projectTypes'),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert('projects', {
      name: args.name,
      type: args.type,
      description: args.description,
    })

    console.log('Added new project with id:', id)
  },
})
