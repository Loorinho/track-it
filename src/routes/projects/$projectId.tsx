import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { api } from 'convex/_generated/api'
import type { Id } from 'convex/_generated/dataModel'
import { useMutation, useQuery } from 'convex/react'
import { ArrowLeft, Edit, Edit2, EllipsisVertical, FolderKanban, Kanban, KanbanSquare, List, ListTodo, Plus, PlusCircle, PlusCircleIcon, Table, Trash, Trash2 } from 'lucide-react'
import { Skeleton } from '~/components/ui/skeleton'

import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '~/components/ui/dropdown-menu'
import { Input } from '~/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '~/components/ui/empty'
import { useState } from 'react'
import { Button } from '~/components/ui/button'
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '~/components/ui/sheet'
import { useForm } from '@tanstack/react-form'
import { createTaskSchema } from '~/schemas/schema'
import { toast } from 'sonner'
import { Field, FieldError, FieldGroup, FieldLabel } from '~/components/ui/field'
import { Textarea } from '~/components/ui/textarea'
import { Progress } from '~/components/ui/progress'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import TaskItem from '~/components/task-item'
import type { vi } from 'zod/v4/locales'
import { ScrollArea } from '~/components/ui/scroll-area'
import TasksBoard from '~/components/tasks-board'
// import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '~/components/ui/item'

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
  const [openDropdown, setOpenDropdown] = useState(false)

  const navigate = useNavigate()

  const taskPriorities: string[] = ['Low', 'Medium', 'High']

  const taskLabels = useQuery(api.labels.listLabels)

  const createTask = useMutation(api.tasks.createProjectTask)

  const projectProgress = useQuery(api.tasks.getProjectProgress, {
    projectId: projectId as Id<'projects'>,
  })


  const project = useQuery(api.projects.getProjectDetails, {
    projectId: projectId,
  })
  const projectTasks = useQuery(api.tasks.listProjectTasks, {
    projectId: projectId as Id<'projects'>,
  })

  const completedTasks = projectTasks?.filter((task) => task.status === 'completed') || []
  const inProgressTasks = projectTasks?.filter((task) => task.status === 'in-progress') || []
  const backlogTasks = projectTasks?.filter((task) => task.status === 'backlog') || []

  const form = useForm({
      defaultValues: {
        name: "",
        description: "",
        label: "",
        priority: "",

      },
      validators: {
        onSubmit: createTaskSchema,
      },
      onSubmit: async ({ value }) => {
  
        const data = {
          name: value.name,
          description: value.description,
          priority: value.priority,
          label: value.label as Id<'labels'>,
          projectId: projectId as Id<'projects'>,
        }
  
        const id = await createTask(data)
  
        // console.log(id)
  
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
  
  return <section className='min-h-screen mx-10 my-5'>

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


        <DropdownMenu
        open={openDropdown}
        onOpenChange={setOpenDropdown}
        >
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex size-8 text-muted-foreground data-[state=open]:bg-muted cursor-pointer"
            size="icon"
            onClick={() => setOpenDropdown(true)}
          >
            <EllipsisVertical className="cursor-pointer size-5" />

            {/* <span className="sr-only">Open menu</span> */}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">

          <DropdownMenuGroup>
           <DropdownMenuItem><Edit2 /> Edit</DropdownMenuItem>
        
          </DropdownMenuGroup>

          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={() => {
            // setTaskToDelete(task._id)
            // setDeleteOpen(true)
            }}><Trash2 /> Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

    </div>
    <p className=''>{project.description}</p>
    <Field className="w-full mt-4">
      <FieldLabel htmlFor="progress-upload" className='mb-0'>
        <span>Progress</span>
        <span className="ml-auto">{projectProgress}%</span>
      </FieldLabel>
      <Progress value={Number(projectProgress)} className='h-3' id="progress-upload" />
    </Field>

    <Tabs defaultValue="tasks" className="w-full mt-4">
    <TabsList className='grid grid-cols-3 w-full '>
      <TabsTrigger className='cursor-pointer' value="tasks">Tasks ({projectTasks?.length})</TabsTrigger>
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
              <div className="grid grid-cols-3 gap-3 my-3 scroll-x-auto">
                <div className='max-h border rounded-md p-4 overflow-scroll'>
                    <div className='flex justify-between'>
                      <p className='font-semibold '>Backlog ({backlogTasks.length})</p>
                      <PlusCircle className='size-4 cursor-pointer' onClick={() => setSheetOpen(true)} />
                    </div>
                    <TasksBoard tasks={backlogTasks} />
                </div>

                 <div className='max-h border rounded-md p-4 overflow-scroll'>
                    <div className='flex justify-between'>
                      <p className='font-semibold '>In Progress ({inProgressTasks.length})</p>
                    </div>
                    <TasksBoard tasks={inProgressTasks} />
                </div>

                 <div className='max-h border rounded-md p-4 overflow-scroll'>
                    <div className='flex justify-between '>
                      <p className='font-semibold '>Completed ({completedTasks.length})</p>
                    </div>
                    <TasksBoard tasks={completedTasks} />
                </div>
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
                name="priority"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid} className='gap-0'>
                      <FieldLabel htmlFor={field.name}>Priority</FieldLabel>
                        <Select onValueChange={(value) => field.handleChange(value)} 
                        value={field.state.value}
                        >
                        <SelectTrigger
                        aria-invalid={isInvalid}
                        >
                          <SelectValue placeholder="Select task priority level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {
                                taskPriorities.map((type) => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                              ))
                            }
                          
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
                name="label"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid} className='gap-0'>
                      <FieldLabel htmlFor={field.name}>Label</FieldLabel>
                        <Select onValueChange={(value) => field.handleChange(value)} 
                        value={field.state.value}
                        >
                        <SelectTrigger
                        aria-invalid={isInvalid}
                        >
                          <SelectValue placeholder="Select task lebel" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {
                                taskLabels?.map((label) => (
                                <SelectItem key={label._id} value={label._id} className='w-full flex justify-between items-center gap-3'>
                                

                                  <span>
                                    {label.name}
                                  </span>
                                  <span style={{backgroundColor: label.color}} className='block rounded-md h-3 w-7'></span>
                                  </SelectItem>
                              ))
                            }
                          
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
            <form.Subscribe
            selector={(state) => [state.isSubmitting, state.canSubmit] }
            children={([isSubmitting]) => (
              <Button type="submit" form='project-task-form'
              className='cursor-pointer'
                // disabled={isSubmitting || !canSubmit}
              >
                {
                  isSubmitting ? "Saving..." : "Save Task"
                }
                {/* Save changes */}
                </Button>
            )}

            >

            </form.Subscribe>
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
