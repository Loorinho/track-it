import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { api } from 'convex/_generated/api'
import type { Id } from 'convex/_generated/dataModel'
import { useMutation, useQuery } from 'convex/react'
import { ArrowBigLeft, ArrowLeft, EllipsisVertical, ListTodo } from 'lucide-react'
import { Skeleton } from '~/components/ui/skeleton'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '~/components/ui/dropdown-menu'
import { Input } from '~/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '~/components/ui/empty'
import { useState } from 'react'
import { Button } from '~/components/ui/button'
import { cn } from '~/lib/utils'
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '~/components/ui/sheet'
import { useForm } from '@tanstack/react-form'
import { createTaskSchema } from '~/schemas/schema'
import { toast } from 'sonner'
import { Field, FieldError, FieldGroup, FieldLabel } from '~/components/ui/field'
import { Textarea } from '~/components/ui/textarea'

export const Route = createFileRoute('/projects/$projectId')({
  component: RouteComponent,
  loader: async ({ params }) => {
      const { projectId } = params

      return {projectId}
    },

 
})


function RouteComponent() {

  const {projectId} = Route.useLoaderData()
  const [sheetOpen, setSheetOpen] = useState(false);

  const createTask = useMutation(api.tasks.createProjectTask)


  const project = useQuery(api.projects.getProjectDetails, {
    projectId: projectId,
  })
  const projectTasks = useQuery(api.tasks.listProjectTasks, {
    projectId: projectId as Id<'projects'>,
  })

  const form = useForm({
      defaultValues: {
        name: "",
        description: "",

      },
      validators: {
        onSubmit: createTaskSchema,
      },
      onSubmit: async ({ value }) => {
  
        const data = {
          name: value.name,
          description: value.description,
          projectId: projectId as Id<'projects'>,
        }
  
        const id = await createTask(data)
  
        console.log(id)
  
        if (!id) {
          toast.error("Failed to create project")
          return
        }
  
        setSheetOpen(false)
        toast("Task added successfully: " + id, {
          position: "top-right",
        })
      },
    })
  

  // console.log('project', project)
  
  return <section className='h-screen mx-10 my-5'>

   

    <Link to="/projects" className='flex items-center mb-2 w-28'> <ArrowLeft className='size-5' /> Back Home</Link>

     {
      project === undefined && (
        <div className="grid gap-3 my-3">
          <div className='flex justify-between'>
            <Skeleton className="h-8 w-50 " />
            <Skeleton className="size-5"/>
          </div>
            <Skeleton className="h-10 w-full" />

            <Skeleton className="h-50 w-full" />

        </div>
      )
    }

{
  project && project.name && (
    <>

        <div className='flex justify-between'>
      <h3 className='font-semibold text-2xl mb-2'>{project.name}</h3>
        <DropdownMenu>
                    <DropdownMenuTrigger>
                      <EllipsisVertical className="text-center size-5 ml-3 cursor-pointer" />
                          </DropdownMenuTrigger>

                          <DropdownMenuContent >
                            <DropdownMenuItem
                              // onClick={() => setIsViewDetailsOpen(true)}
                              className="flex gap-2 items-center  cursor-pointer"
                            >
                              {/* <PenLine className="size-3 " /> */}
                              View
                            </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={async () =>{

                        
                                } 
                              }
                              className="flex gap-2 items-center  cursor-pointer"
                            >
                            Archive
                            </DropdownMenuItem>
                            
                          </DropdownMenuContent>
        </DropdownMenu>
  </div>

   <p className=''>{project.description}</p>

  <Tabs defaultValue="tasks" className="w-full mt-4">
  <TabsList className='grid grid-cols-3 w-full '>
    <TabsTrigger className='cursor-pointer' value="tasks">Tasks</TabsTrigger>
    <TabsTrigger className='cursor-pointer' value="members">Members</TabsTrigger>
    <TabsTrigger className='cursor-pointer' value="settings">Settings</TabsTrigger>

  </TabsList>
  <TabsContent value="tasks">
    {
      projectTasks === undefined && (
        <div className="grid gap-3 my-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      )

    
    }

    {
        projectTasks && projectTasks.length === 0 && (
         <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <ListTodo />
          </EmptyMedia>
          <EmptyTitle>No Tasks Yet</EmptyTitle>
          <EmptyDescription>
            You haven&apos;t created any tasks for this project yet.

          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent className="flex-row justify-center gap-2">
          <Button onClick={() => setSheetOpen(true)} className='cursor-pointer'>Add New</Button>
        </EmptyContent>
      </Empty>
      )
    }

    {
        projectTasks && projectTasks.length > 0 && (

          <>
          <Button onClick={() => setSheetOpen(true)} className='cursor-pointer mt-2'>Add New</Button>

            <div className="grid gap-3 my-3">

                {projectTasks.map((task) => (
                  <div key={task._id} className="p-4 border rounded-md">
                    <p className="font-medium">{task.name}</p>
                    <p className="text-sm text-muted-foreground">{task.status}</p>
                  </div>
                ))}
            </div>
                </>
        )
    }
  </TabsContent>
  <TabsContent value="members">Members</TabsContent>
  <TabsContent value="settings">Settings</TabsContent>


  </Tabs>
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="px-5">
          <SheetHeader>
            <SheetTitle className="text-center text-xl mb-4">
              Add Project Task
            </SheetTitle>
          </SheetHeader>
          <form
            id="project-task-form"
            onSubmit={(e) => {
              e.preventDefault()
  
              form.handleSubmit()
            }}
            className='flex flex-col gap-3'
            
          >
            <FieldGroup>
              <form.Field
                name="name"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid} className='gap-0'>
                      <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="user friendy task name"
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
                name="description"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid} className='gap-0'>
                      <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                      <Textarea
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="your task description"
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

          
            <SheetFooter className='flex'>
              <Button type="submit" form='project-task-form'
              className='cursor-pointer'
                disabled={form.state.isSubmitting}
              >
                {
                  form.state.isSubmitting ? "Saving..." : "Save Task"
                }
                {/* Save changes */}
                </Button>
              <SheetClose asChild>
                <Button variant="outline" className='cursor-pointer' onClick={() => form.reset()}>Close</Button>
              </SheetClose>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </>
  )
}

  </section>
}
