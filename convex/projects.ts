import { v } from 'convex/values'
import { mutation, query } from './_generated/server'
import { Id } from './_generated/dataModel'

export const getProjectDetails = query({
  args: {
    projectId: v.string(),
  },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.projectId as Id<'projects'>)

    // console.log('Project from db', project)

    if (!project) {
      throw new Error('Project not found')

      // return {
      //   message: 'Project not found',
      //   data: {},
      // }
    }

    const projectType = await ctx.db.get(project.type)

    return {
      ...project,
      type: projectType?.name,
    }
  },
})

// export type Project = Awaited<ReturnType<typeof getProjectDetails.isQuery>>

export const listProjects = query({
  handler: async (ctx) => {
    const projects = await ctx.db.query('projects').collect()
    const projectTypes = await ctx.db.query('projectTypes').collect()

    const projectTypeById = new Map(
      projectTypes.map((projectType) => [projectType._id, projectType]),
    )

    // add a field for tasks progress, which is the percentage of completed tasks for the project

    // const projectsWithProgress = await Promise.all(
    //   projects.map(async (project) => {
    //     const tasks = await ctx.db
    //       .query('tasks')
    //       .withIndex('projectId', (q) => q.eq('projectId', project._id))
    //       .collect()

    //       console.log(tasks)

    //     const completedTasks = tasks.filter((task) => task.status === 'completed')
    //     const progress =
    //       tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0

    //     return {
    //       ...project,
    //       progress,
    //     }
    //   }),
    // )

    // console.log('Projects with progress', projectsWithProgress)
    

    return projects.map((project) => ({
      ...project,
      type: projectTypeById.get(project.type)?.name,
    }))
  },
})

export const setProjectStatus = mutation({
  args: {
    projectId: v.id('projects'),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.projectId, {
      status: args.status,
    })
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
      status: 'active',
      description: args.description,
    })

    return id

    // console.log('Added new project with id:', id)
  },
})
