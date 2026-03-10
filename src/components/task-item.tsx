import type { Doc } from 'convex/_generated/dataModel'
import { EllipsisVertical } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Button } from './ui/button'
import { useState } from 'react'
import { api } from 'convex/_generated/api'
import { useMutation } from 'convex/react'

function TaskItem({task}: {task: Doc<"tasks">}) {

    const [openDropdown, setOpenDropdown] = useState(false)

    const updateTaskStatus = useMutation(api.tasks.updateTaskStatus)

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
                <DropdownMenuItem onClick={() => {
                    updateTaskStatus({
                        taskId: task._id,
                        status: "in-progress"
                    })
                }}>In Progress</DropdownMenuItem>
                <DropdownMenuItem
                onClick={() => {
                    updateTaskStatus({
                        taskId: task._id,
                        status: "completed"
                    })
                }}
                >Completed</DropdownMenuItem>
                <DropdownMenuItem
                onClick={() => {
                    updateTaskStatus({
                        taskId: task._id,
                        status: "archived"
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
          <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
        </div>
        <p className="text-sm text-muted-foreground">{task.description}</p>



        
    </div>
  )
}

export default TaskItem