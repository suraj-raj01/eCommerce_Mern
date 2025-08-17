import { useEffect, useState } from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import axios from 'axios'
import { DataTable } from '../../components/ui/data-table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import { Button } from '../../components/ui/button'
import { Trash, Edit, MoreHorizontal } from 'lucide-react'
import Swal from 'sweetalert2'
import { Skeleton } from '../../components/ui/skeleton'
import api from "../../API"
import { useForm } from "react-hook-form"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form"
import { Input } from '../../components/ui/input'
import { Textarea } from '../../components/ui/textarea'

type Permission = {
  _id: any
  id: string;
  permission: string;
  description: string;
};

type FormValues = {
  permission: string;
  description: string;
};

export default function Permission() {
  const [roles, setRoles] = useState<Permission[]>([])
  const [page, setPage] = useState(1)
  const [pageCount, setPageCount] = useState(1)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Permission | null>(null)

  const form = useForm<FormValues>({
    defaultValues: { permission: "", description: "" },
  })

  const resetForm = () => {
    form.reset({ permission: "", description: "" })
    setEditing(null)
  }

  const handleCreate = () => {
    resetForm()
    setOpen(true)
  }

  const handleEdit = (row: Permission) => {
    setEditing(row)
    form.reset({ permission: row.permission, description: row.description })
    setOpen(true)
  }

  const onSubmit = async (values: FormValues) => {
    try {
      if (editing) {
        // UPDATE existing permission
        await axios.patch(`${api}/permission/updatepermission/${editing._id}`, values)
        Swal.fire({
          title: "Permission updated successfully",
          icon: "success",
        })
      } else {
        // CREATE new permission
        await axios.post(`${api}/permission/createpermission`, values)
        Swal.fire({
          title: "Permission created successfully",
          icon: "success",
        })
      }

      setOpen(false)
      resetForm()
      fetchPermission() // reload table from API
    } catch (error) {
      console.error("Error saving permission:", error)
      Swal.fire({
        title: "Error",
        text: "Failed to save permission. Please try again.",
        icon: "error",
      })
    }
  }

  const deletePermission = async (id: string) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      })

      if (result.isConfirmed) {
        await axios.delete(`${api}/permission/deletepermission/${id}`)
        Swal.fire({
          title: "Permission deleted successfully",
          icon: "success",
        })
        fetchPermission()
      }
    } catch (error) {
      console.error("Error deleting permission:", error)
      Swal.fire({
        title: "Error",
        text: "Failed to delete permission. Please try again.",
        icon: "error",
      })
    }
  }

  const fetchPermission = async () => {
    try {
      setLoading(true)
      let response
      if (searchQuery) {
        response = await axios.post(`${api}/permission/searchpermission/${searchQuery}`)
        setRoles(response?.data?.data || [])
        console.log(response.data, "search data")
        // For search, we might not have pagination info
        setPageCount(1)
      } else {
        response = await axios.get(`${api}/permission/getpermission?page=${page}&limit=5`)
        setRoles(response?.data?.data || [])
        setPage(response.data.currentPage || page)
        setPageCount(response.data.pageCount || response.data.totalPages || 1)
        console.log("roles data", response.data)
      }
    } catch (error) {
      console.error('Error fetching permissions:', error)
      Swal.fire({
        title: "Error",
        text: "Failed to fetch permissions. Please try again.",
        icon: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPermission()
  }, [page, searchQuery])

  const columns: ColumnDef<Permission>[] = [
    {
      accessorKey: 'permission',
      header: "Permission Name"
    },
    {
      accessorKey: 'description',
      header: "Description"
    },
    {
      header: "Action",
      id: "actions",
      cell: ({ row }) => {
        const item = row.original
        return (
          <div className='flex items-center justify-start gap-1'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleEdit(item)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Permission
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => deletePermission(item.id)}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Delete Permission
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ]

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setPage(1) // Reset to first page when searching
  }

  return (
    <section className="p-3">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
        <div>
          {loading ? (
            <>
              <Skeleton className="h-9 w-32 mb-2" />
              <Skeleton className="h-5 w-48" />
            </>
          ) : (
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Permissions</h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Manage and track all the permissions
              </p>
            </div>
          )}
        </div>
        {loading ? (
          <Skeleton className="h-10 w-32" />
        ) : (
          <Button size="sm" onClick={handleCreate} className="w-fit sm:w-auto">
            Create New Permission
          </Button>
        )}
      </div>
      <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Permission" : "Add Permission"}</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="permission"
                rules={{ required: "Permission is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Permission</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. product.create" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                rules={{ required: "Description is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Short description of what this permission allows" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="gap-2">
                <Button type="button" variant="outline" onClick={() => { setOpen(false); resetForm(); }}>
                  Cancel
                </Button>
                <Button type="submit">{editing ? "Save changes" : "Create"}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <div className="w-full overflow-x-auto">
        <DataTable
          columns={columns}
          data={roles}
          pageCount={pageCount}
          currentPage={page}
          onPageChange={setPage}
          onSearch={handleSearch}
          isLoading={loading}
        />
      </div>
    </section>
  )
}