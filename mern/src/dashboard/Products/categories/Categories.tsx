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
import { Trash, Edit, MoreHorizontal, Eye } from 'lucide-react'
import Swal from 'sweetalert2'
import { Skeleton } from '../../../components/ui/skeleton'
import { Badge } from '../../../components/ui/badge'
import { useNavigate } from 'react-router-dom'
import api from "../../../API"

type Category = {
    subcategories: any
    _id: string
    name: string
    permissions: []
    roleId: string
}


export default function Category() {
    const [categories, setCategories] = useState<Category[]>([])
    const [page, setPage] = useState(1)
    const [pageCount, setPageCount] = useState(1)
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState<string>('')

    const fetchCategories = async () => {
        try {
            setLoading(true)
            let response
            if (searchQuery) {
                response = await axios.get(`${api}/category/searchcategory/${searchQuery}`)
                setCategories(response?.data?.category || [])
                // console.log(response.data,"search data");
            } else {
                response = await axios.get(`${api}/category/getcategory?page=${page}&limit=5`)
                setCategories(response?.data?.categories || [])
                setPage(response.data.currentPage)
                setPageCount(response.data.pageCount)
                // console.log("categories data", response.data)
            }
            const { data } = response
            setPageCount(data.totalPages || 1)
        } catch (error) {
            console.error('Error fetching categories:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCategories();
    }, [page, searchQuery])


    const deleteCategory = async (id: any) => {
        try {
            await axios.delete(`${api}/category/deletecategory/${id}`)
            Swal.fire({
                title: "Category Deleted Successfully",
                icon: "success",
                draggable: true
            });
            fetchCategories();
        } catch (error) {
            console.error('Error deleting permission:', error)
            alert('Failed to delete Role. Please try again.')
        }
    }

    const navigate = useNavigate();
    const viewpage = (id: any) => {
        navigate(`/dashboard/categoryview/${id}`)
    }


    const columns: ColumnDef<Category>[] = [
        {
            accessorKey: 'category',
            header: "Category Name",
        },
        {
            accessorKey: 'subcategory',
            header: "Subcategories",
            cell: ({ row }) => {
                const subcategories = row.original.subcategories || []
                const isMobile = window.innerWidth < 640
                const visibleSubcategories = isMobile ? subcategories.slice(0, 2) : subcategories

                return (
                    <div className="flex flex-wrap gap-1 items-center">
                        {visibleSubcategories.map((subcat: Category) => (
                            <Badge key={subcat._id} variant="outline" className="rounded-xs text-xs">
                                {subcat.name}
                            </Badge>
                        ))}

                        {/* Show +N on mobile if more subcategories exist */}
                        {isMobile && subcategories.length > 2 && (
                            <Badge variant="secondary" className="rounded-xs text-xs">
                                +{subcategories.length - 2}
                            </Badge>
                        )}
                    </div>
                )
            },
        },

        {
            header: "Action",
            id: "actions",
            cell: ({ row }) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 sm:h-auto sm:w-auto sm:px-2">
                            <MoreHorizontal className="h-4 w-4" />
                            {/* <span className="hidden sm:inline">Actions</span> */}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => viewpage(row.original._id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Category
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(`/dashboard/editcategory/${row.original._id}`)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Category
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => deleteCategory(row.original._id)}>
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ]


    const handleSearch = (query: string) => {
        setSearchQuery(query)
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
                        <>
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
                                <p className="text-muted-foreground">
                                    Manage and track all the categories
                                </p>
                            </div>
                        </>
                    )}
                </div>
                {loading ? (
                    <Skeleton className="h-10 w-32" />
                ) : (
                    <Button onClick={() => { navigate("/dashboard/createcategory") }}>
                        Create Category
                    </Button>
                )}
            </div>

            <div className="w-full overflow-x-auto">
                <DataTable
                    columns={columns}
                    data={categories}
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