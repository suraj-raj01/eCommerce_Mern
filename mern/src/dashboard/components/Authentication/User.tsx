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
import { Trash, Edit, MoreHorizontal, UserCircle } from 'lucide-react'
import Swal from 'sweetalert2'
import { Skeleton } from '../../../components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
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

type Users = {
  _id(_id: any): void
  role: string
  id: string
  name: string
  email: string
  password: string
  profile: string
  roleId: string
}


export default function User() {
  const [users, setUser] = useState<Users[]>([])
  const [roles, setRole] = useState<Users[]>([])
  const [page, setPage] = useState(1)
  const [pageCount, setPageCount] = useState(1)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    profile: '',
    roleId: '',
  });

  const api = 'http://localhost:8000/api'

  const fetchUser = async () => {
    try {
      setLoading(true)
      let response
      if (searchQuery) {
        response = await axios.post(`${api}/users/searchuser/${searchQuery}`)
        setUser(response?.data?.data || [])
        // console.log(response.data,"search data");
      } else {
        response = await axios.get(`${api}/users/getuser?page=${page}&limit=3`)
        setUser(response?.data?.data || [])
        setPage(response.data.currentPage)
        setPageCount(response.data.pageCount)
        // console.log("users data", response.data)
      }
      const { data } = response
      setPageCount(data.totalPages || 1)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRoles = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${api}/roles/getrole`)
      setRole(response?.data?.data || [])
      setPage(response.data.currentPage)
      setPageCount(response.data.pageCount)
      console.log("users data", response.data.data)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUser();
    fetchRoles();
  }, [page, searchQuery])

  const deleteUser = async (id: any) => {
    try {
      await axios.delete(`${api}/users/deleteuser/${id}`)
      Swal.fire({
        title: "Role Deleted Successfully",
        icon: "success",
        draggable: true
      });
      fetchUser();
    } catch (error) {
      console.error('Error deleting permission:', error)
      alert('Failed to delete Role. Please try again.')
    }
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      roleId: value,
    }));
  };


  const createRole = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${api}/roles/createrole`, formData);
      Swal.fire({
        title: response.data.message || "Role Created Successfully",
        icon: "success",
        draggable: true
      });
    } catch (error) {
      console.error('Error Creating permission:', error)
    }
  }


  const columns: ColumnDef<Users>[] = [
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
      header: "Role Name",
      cell: ({ row }) => {
        const roles = row.original.roleId;
        if (!Array.isArray(roles)) return null;
        return (
          <div className="flex gap-1">
            {roles.map((item, index) => (
              <section key={index} className='shadow-md bg-accent pt-1 pb-1 pl-2 pr-2 rounded-md'>{item.role}</section>
            ))}
          </div>
        );
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

                <DropdownMenuItem>
                  <UserCircle className="mr-2 h-4 w-4" />
                  Assign role
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit role
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => deleteUser(item._id)}
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
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Create new role</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create User</DialogTitle>
                {/* <DialogDescription>
                  Anyone who has this link will be able to view this.
                </DialogDescription> */}
              </DialogHeader>
              <div className="flex items-center gap-2">
                <form className="grid gap-4 w-full max-w-md">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Enter name"
                      value={formData.name}
                      onChange={handleInput}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter email"
                      value={formData.email}
                      onChange={handleInput}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Enter password"
                      value={formData.password}
                      onChange={handleInput}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="profile">Profile URL</Label>
                    <Input
                      id="profile"
                      name="profile"
                      placeholder="Enter profile image URL"
                      value={formData.profile}
                      onChange={handleInput}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label>Role</Label>
                    <Select onValueChange={handleRoleChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles?.map((role,index) => (
                          <SelectItem key={index} value={role._id.toString()}>
                            {role.role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>


                  </div>

                  <Button
                    type="submit"
                    variant='default'
                  >
                    Submit
                  </Button>
                </form>
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
        data={users}
        pageCount={pageCount}
        currentPage={page}
        onPageChange={setPage}
        onSearch={handleSearch}
        isLoading={loading}
      />
    </div>
  )
}