import { createFileRoute } from '@tanstack/react-router'
import { api } from 'convex/_generated/api'
import { useQuery } from 'convex/react'
import { Folder } from 'lucide-react'
import { Button } from '~/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/components/ui/empty"

export const Route = createFileRoute('/projects/')({
  component: RouteComponent,
})

function RouteComponent() {
  const projects = useQuery(api.projects.listProjects)


  return <div className='mx-10 my-3'>

    {
      projects && projects.length > 0 ? (
        <>
    <h1 className='text-2xl font-bold'>Projects</h1>

        <ul className='list-disc list-inside'>
          {projects.map((project) => (
            <li key={project._id}>{project.name}</li>
          ))}
        </ul>
          </>
      ) : (
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
        <Button>Create Project</Button>
      </EmptyContent>
  
    </Empty>
      )
    }
  </div>
}
