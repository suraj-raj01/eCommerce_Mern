import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../../API";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { Plus } from "lucide-react";
import { Card } from "../../../../components/ui/card";


const CreateCategory = () => {
    const { id } = useParams();
    const [category, setCategory] = useState("");
    const [categoryimg, setCategoryImg] = useState("");
    const [subcategories, setSubcategories] = useState([{ name: "", image: "" }]);

    const loadCategory = async () => {
        try {
            const response = await axios.get(`${api}/category/getcategorybyid/${id}`);
            setCategory(response.data.category);
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


    return (
        <section className="p-4">
            <h1 className="text-2xl font-bold mb-2">Create Category</h1>
            <Card className="p-3">
                <form className="space-y-4">
                    {/* Category Name */}
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

                    {/* Category Image */}
                    <div>
                        <Label className='mb-2'>Category Image URL</Label>
                        <Input
                            type="file"
                            placeholder="https://example.com/image.jpg"
                            value={categoryimg}
                            onChange={(e) => setCategoryImg(e.target.value)}
                        />
                    </div>

                    {/* Subcategories */}
                    <section>
                        <h3 className="text-lg font-medium">Subcategories</h3>
                        <div className="space-y-3">
                            {subcategories.map((sub, index) => (
                                <div
                                    key={index}
                                    className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center p-4 border rounded-md"
                                >
                                    {/* Subcategory Name Input */}
                                    <div className="md:col-span-2">
                                        <Input
                                            type="text"
                                            placeholder="Subcategory Name"
                                            value={sub.name}
                                            onChange={(e) =>
                                                handleSubcategoryChange(index, "name", e.target.value)
                                            }
                                            required
                                            className="w-full"
                                        />
                                    </div>

                                    {/* Subcategory Image URL Input */}
                                    <div className="md:col-span-2">
                                        <Input
                                            type="file"
                                            placeholder="Subcategory Image URL"
                                            value={sub.image}
                                            onChange={(e) =>
                                                handleSubcategoryChange(index, "image", e.target.value)
                                            }
                                            className="w-full"
                                        />
                                    </div>

                                    {/* Remove Button */}
                                    <div className="flex justify-end md:justify-center">
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            className="px-4 py-2 text-sm"
                                            onClick={() => handleRemoveSubcategory(index)}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                </div>

                            ))}
                        </div>

                        <Button
                            type="button"
                            size="sm"
                            className="mt-2"
                            onClick={handleAddSubcategory}
                        >
                            <Plus className="w-4 h-4 mr-1" /> Add Subcategory
                        </Button>
                    </section>
                    <Button
                        type="submit"
                        onClick={createCategory}
                        className="w-full"
                    >
                        Create Category
                    </Button>
                </form>
            </Card>
        </section>
    );
};

export default CreateCategory;