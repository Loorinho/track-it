import { createFileRoute, Link, Outlet } from '@tanstack/react-router'
import { ModeToggle } from '~/components/mode-toggle'
import { Button } from '~/components/ui/button'

export const Route = createFileRoute('/projects')({
  component: RouteComponent,
})

function RouteComponent() {
  return <section>
     <nav className="sticky top-0 z-50 w-full">
          <div className="border-b">

        <div className="bg-background/40 mx-auto flex items-center justify-between gap-2 px-4 py-3 backdrop-blur-md">
          <div className='flex items-center gap-2'>
            <p>Track.IT</p>
          </div>
           <div className='flex items-center gap-2'>
            <Link to="/projects">Projects</Link>
            <ModeToggle />
            <Button variant="outline" className='cursor-pointer' size="sm">Logout</Button>
          </div>
        </div>
          </div>

        </nav>

        <main>
          <Outlet />
        </main>
  </section>
}
