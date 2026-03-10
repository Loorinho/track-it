import type { Doc } from 'convex/_generated/dataModel'
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'

export default function ProjectCard({project}: {project: Doc<"projects">} ) {


  const dateFormatter = new Intl.DateTimeFormat("en-UG", {
    dateStyle: "medium",
    timeStyle: "medium",
  })


  return (
                <Card className="@container/card w-72 max-w-70 pt-0 h-45 px-1 py-4">
        <CardHeader>
          <CardTitle className="text-xl font-semibold tabular-nums @[250px]/card:text-3xl">
          <p>

            {project.name}
          </p>

            {/* <Badge variant="outline">
              <LoaderIcon />
              {project.status}
            </Badge> */}
          </CardTitle>
          <CardDescription className='line-clamp-2 h-10'>{project.description}

          </CardDescription>
          <CardAction>
            
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm mx-0">
          <div className="text-muted-foreground">
            Type: {project.type}
          </div>
          <div className="line-clamp-1 flex gap-2">
            Updated on: {dateFormatter.format(project._creationTime)}
          </div>
        </CardFooter>
      </Card>
  )
}
