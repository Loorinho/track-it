import type { Doc, Id } from 'convex/_generated/dataModel'
import { EllipsisVertical, Trash, Trash2Icon } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Button } from './ui/button'
import { useState } from 'react'
import { api } from 'convex/_generated/api'
import { useMutation } from 'convex/react'
import { toast } from 'sonner'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogMedia, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog'
import { set } from 'zod'

function TaskItem({task}: {task: Doc<"tasks">}) {

    const [openDropdown, setOpenDropdown] = useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [taskToDelete, setTaskToDelete] = useState<string>("")

    const updateTaskStatus = useMutation(api.tasks.updateTaskStatus)
    const deleteTask = useMutation(api.tasks.deleteTask)

  return (
    <div key={task._id} className="p-4 border rounded-md my-2">
        <div className='flex items-start justify-between'>
            <p className="font-medium">{task.name}</p>

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
           <DropdownMenuItem>Edit</DropdownMenuItem>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Mark As</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={async() => {
                   const response = await updateTaskStatus({
                        taskId: task._id,
                        status: "in-progress"
                    })

                    toast.success("Task marked as In-Progress" , {
                        position: "top-right",
                    })
                }}>In Progress</DropdownMenuItem>
                <DropdownMenuItem
                onClick={() => {
                    updateTaskStatus({
                        taskId: task._id,
                        status: "completed"
                    })

                     toast.success("Task marked as Completed" , {
                        position: "top-right",
                    })
                }}
                >Completed</DropdownMenuItem>
                <DropdownMenuItem
                onClick={() => {
                    updateTaskStatus({
                        taskId: task._id,
                        status: "archived"
                    })

                     toast.success("Task marked as Archived" , {
                        position: "top-right",
                    })
                }}
                >Archived</DropdownMenuItem>
                {/* <DropdownMenuSeparator />
                <DropdownMenuItem>Advanced...</DropdownMenuItem> */}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        
        </DropdownMenuGroup>

          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={() => {
            setTaskToDelete(task._id)
            setDeleteOpen(true)
            }}>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
        </div>
        <p className="text-sm text-muted-foreground">{task.description}</p>


        <AlertDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        >
      <AlertDialogTrigger asChild>
        {/* <Button variant="destructive">Delete Chat</Button> */}
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
            {/* <AlertDialogMedia>
            <Trash />
          </AlertDialogMedia> */}
          {/* <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon  />
          </AlertDialogMedia> */}
          <AlertDialogTitle>Delete Task?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete this task from your project. Are you sure you want to proceed? 
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={() => {
            deleteTask({taskId: taskToDelete as Id<"tasks">})
            setDeleteOpen(false)
            setTaskToDelete("")
             toast.success("Task deleted successfully" , {
                        position: "top-right",
            })
          }}>Yes, Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </div>
  )
}

export default TaskItem