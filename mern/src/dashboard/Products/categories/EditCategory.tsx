import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../API";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Plus } from "lucide-react";
import { Card } from "../../../components/ui/card";
import Swal from "sweetalert2";

const EditCategory = () => {
    const { id } = useParams();
    const [category, setCategory] = useState("");
    const [categoryimg, setCategoryImg] = useState<string | File>("");
    const [subcategories, setSubcategories] = useState<Array<{ name: string; image: string | File }>>([{ name: "", image: "" }]);

    const loadCategory = async () => {
        try {
            const response = await axios.get(`${api}/category/getcategorybyid/${id}`);
            setCategory(response.data.category.category);
            setCategoryImg(response.data.category.categoryimg);
            setSubcategories(
                response.data.category.subcategories.map((sub: any) => ({
                    name: sub.name,
                    image: sub.image ?? ""
                }))
            );
        } catch (error) {
            console.error("Error loading category:", error);
        }
    };

    useEffect(() => {
        loadCategory();
    }, [id]);

    const handleAddSubcategory = () => {
        setSubcategories([...subcategories, { name: "", image: "" }]);
    };

    const handleRemoveSubcategory = (index: number) => {
        const updated = [...subcategories];
        updated.splice(index, 1);
        setSubcategories(updated);
    };

    const handleSubcategoryChange = (index: number, field: 'name' | 'image', value: string | File) => {
        const updated = [...subcategories];
        if (field === "image") {
            updated[index][field] = value as string | File;
        } else {
            updated[index][field] = value as string;
        }
        setSubcategories(updated);
    };

    const fileToBase64 = (file: File) => {
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
        });
    };

    const navigate = useNavigate();
    const updateCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            let categoryImage = categoryimg;
            if (categoryimg instanceof File) {
                categoryImage = await fileToBase64(categoryimg);
            }

            const subcategoriesWithBase64 = await Promise.all(
                subcategories.map(async (sub) => ({
                    name: sub.name,
                    image:
                        sub.image instanceof File ? await fileToBase64(sub.image) : sub.image,
                }))
            );

            const payload = {
                category,
                categoryimg: categoryImage,
                subcategories: subcategoriesWithBase64,
            };

            await axios.put(`${api}/category/updatecategory/${id}`, payload, {
                headers: { "Content-Type": "application/json" },
            });

            Swal.fire({
                title: "Success!",
                text: "Category updated successfully!",
                icon: "success",
                confirmButtonText: "OK"
            });
            navigate("/dashboard/categories")
            loadCategory();
        } catch (error) {
            console.error(error);
            alert("Error updating category");
        }
    };


    return (
        <div>
            <h1 className="text-2xl font-bold mb-2">Edit Category Details</h1>
            <Card className="p-3">
                <form className="space-y-4" onSubmit={updateCategory}>
                    <section>
                        <Label className='mb-2'>Category Name</Label>
                        <Input
                            type="text"
                            placeholder="Enter category name"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                        />
                    </section>
                    <div>
                        <Label className='mb-2'>Category Image</Label>
                        <Input
                            type="file"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) setCategoryImg(file);
                            }}
                        />
                    </div>
                    <section>
                        <h3 className="text-lg font-medium">Subcategories</h3>
                        {subcategories.map((sub, index) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-2 items-center p-4 border rounded-md">
                                <div className="md:col-span-2">
                                    <Input
                                        type="text"
                                        placeholder="Subcategory Name"
                                        value={sub.name}
                                        onChange={(e) => handleSubcategoryChange(index, "name", e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <Input
                                        type="file"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) handleSubcategoryChange(index, "image", file);
                                        }}
                                    />
                                </div>
                                <div className="flex justify-end md:justify-center">
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleRemoveSubcategory(index)}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            </div>
                        ))}
                        <Button type="button" size="sm" className="mt-2" onClick={handleAddSubcategory}>
                            <Plus className="w-4 h-4 mr-1" /> Add Subcategory
                        </Button>
                    </section>
                    <Button type="submit" className="w-full">Update Category</Button>
                </form>
            </Card>
        </div>
    );
};


export default EditCategory;