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
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card";
import { Label } from "../../../components/ui/label";
import { Trash2, Plus } from "lucide-react";

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
    const [input, setInput] = useState('')
    const [category, setCategory] = useState("");
    const [categoryimg, setCategoryImg] = useState("");
    const [subcategories, setSubcategories] = useState([{ name: "", image: "" }]);

    const api = 'http://localhost:8000/api'

    console.log(subcategories, "subcategory")

    const handleAddSubcategory = () => {
        setSubcategories([...subcategories, { name: "", image: "" }]);
    };

    // Remove subcategory input
    const handleRemoveSubcategory = (index: any) => {
        const updated = [...subcategories];
        updated.splice(index, 1);
        setSubcategories(updated);
    };

    const handleSubcategoryChange = (
        index: number,
        field: 'name' | 'image',
        value: string
    ) => {
        const updated = [...subcategories];
        updated[index][field] = value;
        setSubcategories(updated);
    };

    const fetchCategories = async () => {
        try {
            setLoading(true)
            let response
            if (searchQuery) {
                response = await axios.get(`${api}/category/searchcategory/${searchQuery}`)
                setCategories(response?.data?.categories || [])
                // console.log(response.data,"search data");
            } else {
                response = await axios.get(`${api}/category/getcategory?page=${page}&limit=3`)
                setCategories(response?.data?.categories || [])
                setPage(response.data.currentPage)
                setPageCount(response.data.pageCount)
                console.log("categories data", response.data)
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

    const handleInput = async (e: any) => {
        console.log(e.target.value, "input value");
        setInput(e.target.value)
    }

    const createCategory = async (e: any) => {
        e.preventDefault();
        try {
            const payload = { category, categoryimg, subcategories };
            const res = await axios.post(`${api}/category/createcategory`, payload);
            alert("Category saved successfully!");
            console.log(res.data);
            // Reset form
            setCategory("");
            setCategoryImg("");
            setSubcategories([{ name: "", image: "" }]);
        } catch (error) {
            console.error(error);
            alert("Error saving category");
        }
    };

    const deleteRole = async (id: any) => {
        try {
            await axios.delete(`${api}/category/deleterole/${id}`)
            Swal.fire({
                title: "Role Deleted Successfully",
                icon: "success",
                draggable: true
            });
            fetchCategories();
        } catch (error) {
            console.error('Error deleting permission:', error)
            alert('Failed to delete Role. Please try again.')
        }
    }


    const columns: ColumnDef<Category>[] = [
        {
            accessorKey: 'category',
            header: "Category Name"
        },
        {
            accessorKey: 'subcategory',
            header: "Subcategories",
            cell: ({ row }) => {
                return (
                    <div className='flex items-center justify-start gap-2'>
                        {row.original.subcategories.map((subcat: Category) => (
                            <section key={subcat._id} >
                                <Button size="sm" variant='ghost' className='border text-xs'>{subcat.name}</Button>
                            </section>
                        ))}
                    </div>
                )
            },
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
                                <h1 className="text-3xl font-bold tracking-tight">Category</h1>
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
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline">Create new Category</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Create Category*</DialogTitle>
                            </DialogHeader>
                            <Card className="max-w-xl mx-auto mt-2">
                                {/* <CardHeader>
                                </CardHeader> */}
                                <CardContent>
                                    <form className="space-y-4">
                                        {/* Category Name */}
                                        <div>
                                            <Label className='mb-2'>Category Name</Label>
                                            <Input
                                                type="text"
                                                placeholder="Enter category name"
                                                value={category}
                                                onChange={(e) => setCategory(e.target.value)}
                                                required
                                            />
                                        </div>

                                        {/* Category Image */}
                                        <div>
                                            <Label className='mb-2'>Category Image URL</Label>
                                            <Input
                                                type="text"
                                                placeholder="https://example.com/image.jpg"
                                                value={categoryimg}
                                                onChange={(e) => setCategoryImg(e.target.value)}
                                            />
                                        </div>

                                        {/* Subcategories */}
                                        <div>
                                            <h3 className="text-lg font-medium">Subcategories</h3>
                                            <div className="space-y-3">
                                                {subcategories.map((sub, index) => (
                                                    <div
                                                        key={index}
                                                        className="grid grid-cols-1 md:grid-cols-4 gap-2 items-center"
                                                    >
                                                        <div className="md:col-span-2">
                                                            <Input
                                                                type="text"
                                                                placeholder="Subcategory Name"
                                                                value={sub.name}
                                                                onChange={(e) =>
                                                                    handleSubcategoryChange(index, "name", e.target.value)
                                                                }
                                                                required
                                                            />
                                                        </div>
                                                        <div className="md:col-span-2">
                                                            <Input
                                                                type="text"
                                                                placeholder="Subcategory Image URL"
                                                                value={sub.image}
                                                                onChange={(e) =>
                                                                    handleSubcategoryChange(index, "image", e.target.value)
                                                                }
                                                            />
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            size="icon"
                                                            className='w-fit pl-3 pr-3'
                                                            onClick={() => handleRemoveSubcategory(index)}
                                                        >
                                                            {/* <Trash2 className="w-4 h-4" /> */}
                                                            Remove Subcategory
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>

                                            <Button
                                                type="button"
                                                variant="secondary"
                                                size="sm"
                                                className="mt-2"
                                                onClick={handleAddSubcategory}
                                            >
                                                <Plus className="w-4 h-4 mr-1" /> Add Subcategory
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                            <DialogFooter className="sm:justify-start">
                                <DialogClose asChild>
                                    <Button type="button" variant="secondary">
                                        Close
                                    </Button>
                                </DialogClose>
                                <Button type="button" variant='default' className='cursor-pointer' onClick={createCategory}>
                                    Create Category
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                )}
            </div>

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
    )
}