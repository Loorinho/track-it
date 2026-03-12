import type { Doc, Id } from 'convex/_generated/dataModel'
import { Archive, CheckCircle, CheckCircle2, Edit2Icon, EllipsisVertical, ListCheck, MoreHorizontal, MoreVertical, TrendingUp } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Button } from './ui/button'
import { useState } from 'react'
import { api } from 'convex/_generated/api'
import { useMutation, useQuery } from 'convex/react'
import { toast } from 'sonner'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog'
import { Badge } from './ui/badge'

function TaskItem({task}: {task: Doc<"tasks">}) {


    const taskLabel = useQuery(api.tasks.getLabelForTask, {
        labelId: task.label
    })

  // console.log("Task Label: ", taskLabel)


    const [openDropdown, setOpenDropdown] = useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [taskToDelete, setTaskToDelete] = useState<string>("")

    const updateTaskStatus = useMutation(api.tasks.updateTaskStatus)
    const deleteTask = useMutation(api.tasks.deleteTask)


    const handleUpdateTaskStatus = async (status: string) => {

      if(status === task.status) {
        toast.error(`Task is already marked as ${status.replace("-", " ")}` , {
            position: "top-right",
        })
        return
      }
        await updateTaskStatus({
            taskId: task._id,
            status
        })

        toast.success(`Task marked as ${status.replace("-", " ")}` , {
            position: "top-right",
        })
    }

  return (
    <div key={task._id} className="p-4 border rounded-md my-2">
        <div className='flex items-start justify-between'>
            <p className="font-medium flex items-center gap-2">
              <span className='inline-block'>
                {task.name}
                </span>
{/* 
                  {taskLabel && taskLabel.name && (
                      <span className='inline-block px-2 h-5 text-xs rounded-sm text-white text-center' style={{backgroundColor: taskLabel.color, opacity: 0.9}}>
                          {taskLabel.name}
                      </span>
                  )} */}

                  <Badge variant="outline" className='text-xs bg-'>
                    {taskLabel?.name}
                  </Badge>

            </p>

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

          
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">

          <DropdownMenuGroup>
           <DropdownMenuItem> <Edit2Icon /> Edit</DropdownMenuItem>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger><MoreVertical /> Mark As</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={async() => 
                    handleUpdateTaskStatus("backlog")}><ListCheck /> Backlog</DropdownMenuItem>
                <DropdownMenuItem onClick={async() =>handleUpdateTaskStatus("in-progress")}><TrendingUp /> In Progress</DropdownMenuItem>
                <DropdownMenuItem
                onClick={() => handleUpdateTaskStatus("completed")}><CheckCircle2 /> Completed</DropdownMenuItem>
                <DropdownMenuItem
                onClick={() => handleUpdateTaskStatus("archived")}
                ><Archive /> Archived</DropdownMenuItem>
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