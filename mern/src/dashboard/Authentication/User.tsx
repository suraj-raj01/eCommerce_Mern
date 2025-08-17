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
import { Trash, Edit, MoreHorizontal, UserCircle, Eye } from 'lucide-react'
import Swal from 'sweetalert2'
import { Skeleton } from '../../components/ui/skeleton'
import { useNavigate } from 'react-router-dom'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog"
import { Badge } from '../../components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar'
import { useForm } from "react-hook-form"
import {
  Form,
  // FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form"
import { Checkbox } from "../../components/ui/checkbox"
import api from "../../API"

type Role = {
  _id: string
  role: string
  name: string
  permissions?: any[]
}

type Users = {
  _id: string
  role: string
  id: string
  name: string
  email: string
  password: string
  profile: string
  roleId: Role[] | string
}

type AssignRoleFormValues = {
  roleId: string[]
}

export default function User() {
  const [users, setUser] = useState<Users[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [page, setPage] = useState(1)
  const [pageCount, setPageCount] = useState(1)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState<string>('')
  
  // Dialog states
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [assignRoleDialogOpen, setAssignRoleDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<Users | null>(null)

  const navigate = useNavigate()

  const assignRoleForm = useForm<AssignRoleFormValues>({
    defaultValues: {
      roleId: []
    }
  })

  const fetchRoles = async () => {
    try {
      const response = await axios.get(`${api}/roles/getrole?limit=100`)
      setRoles(response?.data?.data || [])
    } catch (error) {
      console.error('Error fetching roles:', error)
    }
  }

  const fetchUser = async () => {
    try {
      setLoading(true)
      let response
      if (searchQuery) {
        response = await axios.post(`${api}/users/searchuser/${searchQuery}`)
        setUser(response?.data?.data || [])
        // console.log(response.data.data,"search data")
        setPageCount(1)
      } else {
        response = await axios.get(`${api}/users/getuser?page=${page}&limit=3`)
        setUser(response?.data?.data || [])
        setPage(response.data.currentPage || page)
        setPageCount(response.data.pageCount || response.data.totalPages || 1)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      Swal.fire({
        title: "Error",
        text: "Failed to fetch users. Please try again.",
        icon: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [page, searchQuery])

  useEffect(() => {
    fetchRoles()
  }, [])

  const handleViewUser = (user: Users) => {
    setSelectedUser(user)
    setViewDialogOpen(true)
  }

  const handleAssignRole = (user: Users) => {
    setSelectedUser(user)
    const currentRoleIds = Array.isArray(user.roleId) 
      ? user.roleId.map(role => role._id)
      : user.roleId ? [user.roleId] : []
    
    assignRoleForm.reset({
      roleId: currentRoleIds
    })
    setAssignRoleDialogOpen(true)
  }

  const onAssignRoleSubmit = async (values: AssignRoleFormValues) => {
    if (!selectedUser) return

    try {
      await axios.patch(`${api}/users/updateuser/${selectedUser._id}`, {
        roleId: values.roleId
      })
      
      Swal.fire({
        title: "Roles assigned successfully",
        icon: "success",
        draggable: true
      })
      
      setAssignRoleDialogOpen(false)
      setSelectedUser(null)
      assignRoleForm.reset()
      fetchUser()
    } catch (error) {
      console.error('Error assigning roles:', error)
      Swal.fire({
        title: "Error",
        text: "Failed to assign roles. Please try again.",
        icon: "error",
      })
    }
  }

  const deleteUser = async (id: string) => {
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
        const response = await axios.delete(`${api}/users/deleteuser/${id}`)
        Swal.fire({
          title: response.data.message || "User deleted successfully",
          icon: "success",
          draggable: true
        })
        fetchUser()
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      Swal.fire({
        title: "Error",
        text: "Failed to delete user. Please try again.",
        icon: "error",
      })
    }
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setPage(1)
  }

  const getUserRoles = (user: Users) => {
    if (Array.isArray(user.roleId)) {
      return user.roleId
    }
    return []
  }

  const columns: ColumnDef<Users>[] = [
    {
      accessorKey: 'profile',
      header: "Profile",
      cell: ({ row }) => {
        const user = row.original
        return (
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.profile} alt={user.name} />
            <AvatarFallback>
              {user.name?.charAt(0)?.toUpperCase() || <UserCircle className="h-4 w-4" />}
            </AvatarFallback>
          </Avatar>
        )
      }
    },
    {
      accessorKey: 'name',
      header: "User Name"
    },
    {
      accessorKey: 'email',
      header: "User Email"
    },
    {
      accessorKey: 'roleId',
      header: "Roles",
      cell: ({ row }) => {
        const userRoles = getUserRoles(row.original)
        if (userRoles.length === 0) {
          return <Badge variant="secondary">No roles</Badge>
        }
        return (
          <div className="flex gap-1 flex-wrap">
            {userRoles.slice(0, 2).map((role, index) => (
              <Badge key={index} variant="outline" className="text-xs rounded-xs">
                {role.role || role.name}
              </Badge>
            ))}
            {userRoles.length > 2 && (
              <Badge variant="secondary" className="text-xs rounded-xs">
                +{userRoles.length - 2} more
              </Badge>
            )}
          </div>
        )
      }
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
                <DropdownMenuItem onClick={() => handleViewUser(item)}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAssignRole(item)}>
                  <UserCircle className="mr-2 h-4 w-4" />
                  Assign Roles
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate(`/dashboard/edituser/${item._id}`)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit User
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => deleteUser(item._id)}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Delete User
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ]

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
            <>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Users</h1>
                <p className="text-muted-foreground">
                  Manage and track all the users
                </p>
              </div>
            </>
          )}
        </div>
        {loading ? (
          <Skeleton className="h-10 w-32" />
        ) : (
          <Button onClick={() => navigate("/dashboard/createuser")}>
            Create New User
          </Button>
        )}
      </div>

      {/* View User Details Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={`${api}/uploads/${selectedUser.profile}`} alt={selectedUser.name} />
                  <AvatarFallback className="text-lg">
                    {selectedUser.name?.charAt(0)?.toUpperCase() || <UserCircle className="h-6 w-6" />}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{selectedUser.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Assigned Roles</h4>
                <div className="flex gap-2 flex-wrap">
                  {getUserRoles(selectedUser).length > 0 ? (
                    getUserRoles(selectedUser).map((role, index) => (
                      <Badge key={index} variant="outline" className='rounded-xs'>
                        {role.role || role.name}
                      </Badge>
                    ))
                  ) : (
                    <Badge variant="secondary">No roles assigned</Badge>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">User ID</h4>
                <p className="text-sm font-mono bg-muted p-2 rounded">{selectedUser._id}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Roles Dialog */}
      <Dialog open={assignRoleDialogOpen} onOpenChange={setAssignRoleDialogOpen}>
        <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Assign Roles to {selectedUser?.name}</DialogTitle>
          </DialogHeader>
          
          <Form {...assignRoleForm}>
            <form className="space-y-4" onSubmit={assignRoleForm.handleSubmit(onAssignRoleSubmit)}>
              <FormField
                control={assignRoleForm.control}
                name="roleId"
                render={({ field }) => {
                  const allSelected = roles.length > 0 && field.value?.length === roles.length
                  const someSelected = field.value?.length > 0 && field.value?.length < roles.length

                  const handleSelectAll = (checked: boolean) => {
                    if (checked) {
                      field.onChange(roles.map(role => role._id))
                    } else {
                      field.onChange([])
                    }
                  }

                  return (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Available Roles</FormLabel>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="select-all-roles"
                            checked={allSelected}
                            ref={(el) => {
                              if (el && el instanceof HTMLInputElement) el.indeterminate = someSelected
                            }}
                            onCheckedChange={handleSelectAll}
                          />
                          <label
                            htmlFor="select-all-roles"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            Select All ({field.value?.length || 0}/{roles.length})
                          </label>
                        </div>
                      </div>
                      <div className="space-y-2 max-h-48 overflow-y-auto border rounded-md p-3">
                        {roles.map((role) => (
                          <div key={role._id} className="flex items-center space-x-2">
                            <Checkbox
                              id={role._id}
                              checked={field.value?.includes(role._id)}
                              onCheckedChange={(checked) => {
                                const updatedValue = checked
                                  ? [...(field.value || []), role._id]
                                  : (field.value || []).filter(id => id !== role._id)
                                field.onChange(updatedValue)
                              }}
                            />
                            <div className="flex-1">
                              <label
                                htmlFor={role._id}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                              >
                                {role.role || role.name}
                              </label>
                              {role.permissions && (
                                <p className="text-xs text-muted-foreground">
                                  {role.permissions.length} permissions
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      {roles.length === 0 && (
                        <p className="text-sm text-muted-foreground">No roles available</p>
                      )}
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />

              <DialogFooter className="gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setAssignRoleDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Assign Roles
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <div className="w-full overflow-x-auto">
        <DataTable
          columns={columns}
          data={users}
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