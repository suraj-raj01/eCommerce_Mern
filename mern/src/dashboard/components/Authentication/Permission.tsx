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

type Permission = {
  id: string
  permission: string
  description: string
}


export default function Permission() {
  const [roles, setRoles] = useState<Permission[]>([])
  const [page, setPage] = useState(1)
  const [pageCount, setPageCount] = useState(1)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState<string>('')

  const api =  'http://localhost:8000/api'

  const fetchPermission = async () => {
    try {
      setLoading(true)
      let response
      if (searchQuery) {
        response = await axios.post(`${api}/permission/searchpermission/${searchQuery}`)
        setRoles(response?.data?.data || [])
        console.log(response.data,"search data");
      } else {
        response = await axios.get(`${api}/permission/getpermission?page=${page}&limit=5`)
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
    fetchPermission();
  }, [page, searchQuery])

  const deleteRole = async (id: any) => {
    try {
      await axios.delete(`${api}/vendor/role/${id}`)
      Swal.fire({
        title: "Role Deleted Successfully",
        icon: "success",
        draggable: true
      });
      fetchPermission();
    } catch (error) {
      console.error('Error deleting permission:', error)
      alert('Failed to delete Role. Please try again.')
    }
  }


  const columns: ColumnDef<Permission>[] = [
    {
      accessorKey: 'permission',
      header: "Role Name"
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

                <DropdownMenuItem>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit role
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => deleteRole(item.id)}
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
                <h1 className="text-3xl font-bold tracking-tight">Permission</h1>
                <p className="text-muted-foreground">
                  Manage and track all the permission
                </p>
              </div>
            </>
          )}
        </div>
        {loading ? (
          <Skeleton className="h-10 w-32" />
        ) : (
          <Button>
            Create New Role
          </Button>
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