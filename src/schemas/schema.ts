

import * as z from "zod"

export const projectTypeSchema = z.object({
  name: z
    .string()
    .min(5, "Type name must be at least 3 characters.")
})