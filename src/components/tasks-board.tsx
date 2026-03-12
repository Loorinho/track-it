import type { Doc } from "convex/_generated/dataModel";
import { Plus } from "lucide-react";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import TaskItem from "./task-item";

export default function TasksBoard({tasks}: {tasks: Doc<"tasks">[]}) {
  return (
    <div className=''>

       {tasks.length > 0 && <Input placeholder='Search tasks...' className='mt-3 mb-1' />}
        <ScrollArea className="h-150 rounded-md px-1">
            {tasks.map((task) => (
        <TaskItem key={task._id} task={task} />
        ))}
        </ScrollArea>
    </div>
  )
}