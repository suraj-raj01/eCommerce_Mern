import { useEffect, useState } from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import axios from 'axios'
import { DataTable } from '../../../components/ui/data-table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu"
import { Button } from '../../../components/ui/button'
import { Trash, Edit, MoreHorizontal } from 'lucide-react'
import Swal from 'sweetalert2'
import { Skeleton } from '../../../components/ui/skeleton'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"

type Roles = {
  _id: string
  name: string
  permissions: []
  roleId: string
}


export default function Roles() {
  const [roles, setRoles] = useState<Roles[]>([])
  const [page, setPage] = useState(1)
  const [pageCount, setPageCount] = useState(1)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [input, setInput] = useState('')

  const api =  'http://localhost:8000/api'

  const fetchRoles = async () => {
    try {
      setLoading(true)
      let response
      if (searchQuery) {
        response = await axios.post(`${api}/roles/searchrole/${searchQuery}`)
        setRoles(response?.data?.data || [])
        // console.log(response.data,"search data");
      } else {
        response = await axios.get(`${api}/roles/getrole?page=${page}&limit=3`)
        setRoles(response?.data?.data || [])
        setPage(response.data.currentPage)
        setPageCount(response.data.pageCount)
        console.log("roles data", response.data)
      }
      const { data } = response
      setPageCount(data.totalPages || 1)
    } catch (error) {
      console.error('Error fetching roles:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRoles();
  }, [page, searchQuery])

  const handleInput = async (e: any) => {
    console.log(e.target.value, "input value");
    setInput(e.target.value)
  }

  const createRole = async() => {
    try {
      const response = await axios.post(`${api}/roles/createrole`, { role: input, permissionId: [] });
      Swal.fire({
        title: response.data.message || "Role Created Successfully",
        icon: "success",
        draggable: true
      });
      fetchRoles()
    } catch (error) {
      console.error('Error Creating permission:', error)
    }
  }

  const deleteRole = async (id: any) => {
    try {
      await axios.delete(`${api}/roles/deleterole/${id}`)
      Swal.fire({
        title: "Role Deleted Successfully",
        icon: "success",
        draggable: true
      });
      fetchRoles();
    } catch (error) {
      console.error('Error deleting permission:', error)
      alert('Failed to delete Role. Please try again.')
    }
  }


  const columns: ColumnDef<Roles>[] = [
    {
      accessorKey: 'role',
      header: "Role Name"
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

                <DropdownMenuItem>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit role
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => deleteRole(item._id)}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
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
  }

  return (
    <div className="p-3">
      <div className="flex justify-between items-center mb-4">
        <div>
          {loading ? (
            <>
              <Skeleton className="h-9 w-32 mb-2" />
              <Skeleton className="h-5 w-48" />
            </>
          ) : (
            <>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Roles</h1>
                <p className="text-muted-foreground">
                  Manage and track all the roles
                </p>
              </div>
            </>
          )}
        </div>
        {loading ? (
          <Skeleton className="h-10 w-32" />
        ) : (
           <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Create new role</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create role*</DialogTitle>
                {/* <DialogDescription>
                  Anyone who has this link will be able to view this.
                </DialogDescription> */}
              </DialogHeader>
              <div className="flex items-center gap-2">
                <div className="grid flex-1 gap-2">
                  <Label htmlFor="link" className="sr-only">
                    Link
                  </Label>
                  <Input
                    id="link"
                    placeholder='enter role ...'
                    onChange={handleInput}
                  />
                </div>
              </div>
              <DialogFooter className="sm:justify-start">
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    Close
                  </Button>
                </DialogClose>
                <Button type="button" variant='default' onClick={createRole}>
                  Submit
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

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
  )
}