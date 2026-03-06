import * as z from 'zod'

export const projectTypeSchema = z.object({
  name: z.string().min(5, 'Type name must be at least 3 characters.'),
})

export const createProjectSchema = z.object({
  name: z.string().min(5, 'Project name must be at least 5 characters.'),
  type: z.string().min(1, 'Project type is required.'),
  description: z
    .string()
    .min(5, 'Project description must be at least 5 characters.'),
})
