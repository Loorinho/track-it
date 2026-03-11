import { createFileRoute } from '@tanstack/react-router'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog'
import { projectTypeSchema } from '~/schemas/schema'
import { useForm } from "@tanstack/react-form"
import { Field, FieldError, FieldGroup, FieldLabel } from '~/components/ui/field'
import { Input } from '~/components/ui/input'
import { api } from 'convex/_generated/api'
import { useMutation, useQuery } from 'convex/react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import { useState } from 'react'
import { Loader, Plus, PlusCircle } from 'lucide-react'
import { dateFormatter } from '~/lib/helpers'


export const Route = createFileRoute('/projects/types')({
  component: RouteComponent,
})

function RouteComponent() {

  const [open, setOpen] = useState(false)
  const createProjectType = useMutation(api.project_types.createProjectType)
  const projectTypes = useQuery(api.project_types.listProjectTypes)


  const form = useForm({
    defaultValues: {
      name: "",
    },
    validators: {
      onSubmit: projectTypeSchema,
    },
    onSubmit: async ({ value }) => {
      const id = await createProjectType({name: value.name})

      if (!id) {
        toast.error("Failed to create project type")
        return
      }

      setOpen(false)
      toast.success("Type created successfully: " + id, {
        position: "top-right",
        classNames: {
          content: "flex flex-col gap-2",
        },
        style: {
          "--border-radius": "calc(var(--radius)  + 4px)",
        } as React.CSSProperties,
      })
    },
  })


  return <section className='min-h-screen my-6 max-w-3xl mx-auto'>
    


    <Dialog
    open={open}
    onOpenChange={setOpen}
    >
        <DialogTrigger asChild>
          <Button variant="outline" className='w-23 flex items-center cursor-pointer px-3'>Add New <PlusCircle /></Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className='text-center'>Add a new Project Type</DialogTitle>

          </DialogHeader>

        <form
          id="project-type-form"
          onSubmit={(e) => {
            e.preventDefault()

            form.handleSubmit()
          }}
          
        >
          <FieldGroup>
            <form.Field
              name="name"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="user friendy project type name"
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
        </form>
          <DialogFooter >
          <Field orientation="horizontal"  className="justify-end gap-2">
              <DialogClose asChild>
                <Button variant="outline" onClick={() => form.reset()}>Cancel</Button>
              </DialogClose>
              <Button type="submit" form="project-type-form">
                {
                  form.state.isSubmitting ? "Creating..." : "Submit"
                }
              </Button>
          </Field>
          </DialogFooter>
        </DialogContent>
    </Dialog>
    
    
          {projectTypes === undefined && (
            <div className="flex justify-center items-center h-40">
              <div>
                <Loader size={50} className="text-green-600 animate-spin" />
              </div>
            </div>
          )}

          {projectTypes && projectTypes.length === 0 && (
            <div className="text-center my-4">
              <h2 className="font-medium text-2xl">
                You do not have any project types at the moment
              </h2>
            </div>
          )}

            {projectTypes && projectTypes.length > 0 && (
                  <Table>
  <TableCaption>A list of your recent project types.</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead className="w-3">No</TableHead>
      <TableHead>Name</TableHead>
      <TableHead>Status</TableHead>

      <TableHead className="text-right">CreatedAt</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {projectTypes.map((type, index) => (
          <TableRow key={type._id}>
            <TableCell className="font-medium">{index + 1}</TableCell>

            <TableCell className="font-medium">{type.name}</TableCell>
            <TableCell className="font-medium">
              {type.status ? "Active" : "Inactive"}
            </TableCell>

           
            <TableCell className="text-right">{
              dateFormatter.format(type._creationTime).toLocaleString()
              }</TableCell>
          </TableRow>
        ))}
  </TableBody>
</Table>
            )
          }

    </section>
}
