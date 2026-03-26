import { useForm } from '@tanstack/react-form'
import { createFileRoute, Link } from '@tanstack/react-router'
import { api } from 'convex/_generated/api'
import type { Id } from 'convex/_generated/dataModel'
import { useMutation, useQuery } from 'convex/react'
import { Folder, Loader } from 'lucide-react'

import { useState } from 'react'
import { toast } from 'sonner'
import ProjectCard from '~/components/project-card'
import { Button } from '~/components/ui/button'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '~/components/ui/empty'
import {
  FieldGroup,
  FieldLabel,
  FieldError,
  Field,
} from '~/components/ui/field'
import { Input } from '~/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { Textarea } from '~/components/ui/textarea'
import { authMiddleware } from '~/lib/middleware'
import { createProjectSchema } from '~/schemas/schema'

export const Route = createFileRoute('/projects/')({
  component: RouteComponent,
  server: {
    middleware: [authMiddleware],
  },
})

function RouteComponent() {
  const [open, setOpen] = useState(false)
  // const [searchTerm, setSearchTerm] = useState("");
  const createProject = useMutation(api.projects.createProject)
  const projects = useQuery(api.projects.listProjects)
  const projectTypes = useQuery(api.project_types.listProjectTypes)

  // const setProjectStatus = useMutation(api.projects.setProjectStatus)

  // const [status, setStatus] = useState(false)

  //  const filteredProjects = projects?.filter(
  //   (project) =>
  //     project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     project.description.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  const form = useForm({
    defaultValues: {
      name: '',
      description: '',
      type: '',
    },
    validators: {
      onSubmit: createProjectSchema,
    },
    onSubmit: async ({ value }) => {
      const data = {
        name: value.name,
        description: value.description,
        type: value.type as Id<'projectTypes'>,
      }

      const id = await createProject(data)

      console.log(id)

      if (!id) {
        toast.error('Failed to create project')
        return
      }

      setOpen(false)
      toast('Project created successfully: ' + id, {
        position: 'top-right',
      })
    },
  })

  return (
    <div className="mx-10 my-3 h-screen">
      {projects && open && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            {/* <Button variant="outline" className='w-23 flex items-center cursor-pointer px-2'>Add New <Plus /></Button> */}
          </DialogTrigger>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-center">
                Add a new project
              </DialogTitle>
            </DialogHeader>

            <form
              id="project-type-form"
              onSubmit={(e) => {
                e.preventDefault()

                form.handleSubmit()
              }}
              className="flex flex-col gap-3"
            >
              <FieldGroup>
                <form.Field
                  name="name"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid
                    return (
                      <Field data-invalid={isInvalid} className="gap-0">
                        <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder="user friendy project name"
                          autoComplete="off"
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    )
                  }}
                />
              </FieldGroup>

              <FieldGroup>
                <form.Field
                  name="type"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid
                    return (
                      <Field data-invalid={isInvalid} className="gap-0">
                        <FieldLabel htmlFor={field.name}>
                          Project Type
                        </FieldLabel>
                        <Select
                          onValueChange={(value) => field.handleChange(value)}
                          value={field.state.value}
                        >
                          <SelectTrigger aria-invalid={isInvalid}>
                            <SelectValue placeholder="Select project type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {projectTypes &&
                                projectTypes.map((type) => (
                                  <SelectItem key={type._id} value={type._id}>
                                    {type.name}
                                  </SelectItem>
                                ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>

                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    )
                  }}
                />
              </FieldGroup>

              <FieldGroup>
                <form.Field
                  name="description"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid
                    return (
                      <Field data-invalid={isInvalid} className="gap-0">
                        <FieldLabel htmlFor={field.name}>
                          Description
                        </FieldLabel>
                        <Textarea
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder="your project description"
                          autoComplete="off"
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    )
                  }}
                />
              </FieldGroup>
              <DialogFooter>
                <Field orientation="horizontal" className="justify-end gap-2">
                  <DialogClose asChild>
                    <Button variant="outline" onClick={() => form.reset()}>
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type="submit" form="project-type-form">
                    {form.state.isSubmitting ? 'Creating...' : 'Create'}
                  </Button>
                </Field>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {projects === undefined && (
        <div className="flex justify-center items-center h-40">
          <div>
            <Loader size={50} className="text-green-600 animate-spin" />
          </div>
        </div>
      )}

      {projects && projects.length === 0 && (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Folder />
            </EmptyMedia>
            <EmptyTitle>No Projects Yet</EmptyTitle>
            <EmptyDescription>
              You haven&apos;t created any projects yet. Get started by creating
              your first project.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent className="flex-row justify-center gap-2">
            <Button onClick={() => setOpen(true)}>Create Project</Button>
          </EmptyContent>
        </Empty>
      )}

      {projects && projects.length > 0 && (
        <>
          {/* <h1 className='text-2xl font-bold text-center'>Projects</h1> */}
          <Button
            variant="default"
            onClick={() => setOpen(true)}
            className="w-23 flex items-center cursor-pointer px-2"
          >
            Add New
          </Button>
          <div className="flex flex-wrap gap-5 mt-5">
            {/* <Input
              placeholder="Search records by patient name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-2 py-1 border border-gray-300 rounded-md w-full mt-5"
            /> */}

            {projects.map((project) => (
              <Link
                to={`/projects/$projectId`}
                params={{
                  projectId: project._id,
                }}
                key={project._id}
                className="w-70 max-w-70 hover:scale-[1.02] transition-transform duration-200"
              >
                <ProjectCard project={project} />
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
