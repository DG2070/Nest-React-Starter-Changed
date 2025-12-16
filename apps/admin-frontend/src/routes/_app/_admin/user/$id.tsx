import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/_admin/user/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_app/_admin/user/$id"!</div>
}
