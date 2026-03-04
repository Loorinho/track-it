import { v } from "convex/values";
import { mutation, query } from "./_generated/server";


export const listProjectTypes = query({
    handler: async (ctx) => {   
        const projectTypes = await ctx.db.query("projectTypes").collect();
        return projectTypes;
    },
})

export const createProjectType = mutation({
    args: {
        name: v.string()
    },
    handler: async (ctx, args) => {   
        const typeId = await ctx.db.insert("projectTypes",{
            name: args.name,
            status: true,
        });
        return typeId;
    },
})