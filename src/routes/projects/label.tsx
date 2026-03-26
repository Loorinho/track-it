import { useForm } from '@tanstack/react-form'
import { createFileRoute } from '@tanstack/react-router'
import { api } from 'convex/_generated/api'
import { useMutation, useQuery } from 'convex/react'
import { PlusCircle } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '~/components/ui/field'
import { Input } from '~/components/ui/input'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '~/components/ui/sheet'
import { createLabelSchema } from '~/schemas/schema'

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
import { dateFormatter } from '~/lib/helpers'

export const Route = createFileRoute('/projects/label')({
  component: RouteComponent,
})

function RouteComponent() {
  const labels = useQuery(api.labels.listLabels)
  const createLabel = useMutation(api.labels.createLabel)

  const [sheetOpen, setSheetOpen] = useState(false)

  const form = useForm({
    defaultValues: {
      name: '',
      color: '',
    },
    validators: {
      onSubmit: createLabelSchema,
    },
    onSubmit: async ({ value }) => {
      const data = {
        name: value.name,
        color: value.color,
      }

      // console.log(data)

      const id = await createLabel(data)

      if (!id) {
        toast.error('Failed to create task label')
        return
      }

      setSheetOpen(false)
      toast.success('Task label added successfully: ' + id, {
        position: 'top-right',
      })
    },
  })

  return (
    <section className="min-h-screen my-3 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold text-center">Labels</h1>

      <Button
        className="my-5 cursor-pointer"
        onClick={() => setSheetOpen(true)}
      >
        Add Label
        <PlusCircle className="ml-1" />
      </Button>

      {labels && labels.length > 0 && (
        <Table>
          <TableCaption>A list of your recently created labels.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">No</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Color</TableHead>
              <TableHead className="text-right">CreatedAt</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {labels.map((label, index) => (
              <TableRow key={label._id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{label.name}</TableCell>
                <TableCell>
                  {label.color && (
                    <div className="flex items-center gap-2">
                      <div
                        style={{ backgroundColor: label.color }}
                        className="w-20 h-5 rounded-md px-2"
                      >
                        {/* <span className={`text-[${label.color}]/50 text-sm font-medium`}>
                        {label.color}
                    </span> */}
                      </div>
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {dateFormatter.format(label._creationTime)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="px-5">
          <SheetHeader>
            <SheetTitle className="text-center text-xl mb-4">
              Add Task Label
            </SheetTitle>
          </SheetHeader>
          <form
            id="project-task-form"
            onSubmit={(e) => {
              e.preventDefault()

              form.handleSubmit()
            }}
            className="flex flex-col gap-3"
          >
            <FieldGroup>
              <form.Field
                name="name"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid} className="gap-0">
                      <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="user friendy task label name"
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
                name="color"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid} className="gap-0">
                      <FieldLabel htmlFor={field.name}>Color</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        type="color"
                        // defaultValue={}
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

            <SheetFooter className="flex">
              <form.Subscribe
                selector={(state) => [state.isSubmitting, state.canSubmit]}
                children={([isSubmitting]) => (
                  <Button
                    type="submit"
                    form="project-task-form"
                    className="cursor-pointer"
                    // disabled={isSubmitting || !canSubmit}
                  >
                    {isSubmitting ? 'Saving...' : 'Save Label'}
                    {/* Save changes */}
                  </Button>
                )}
              ></form.Subscribe>
              <SheetClose asChild>
                <Button
                  variant="outline"
                  className="cursor-pointer"
                  onClick={() => form.reset()}
                >
                  Close
                </Button>
              </SheetClose>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </section>
  )
}
