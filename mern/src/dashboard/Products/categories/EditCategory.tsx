import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../API";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Plus } from "lucide-react";
import { Card } from "../../../components/ui/card";

const EditCategory = () => {
    const { id } = useParams(); // categoryId from route
    const navigate = useNavigate();

    const [category, setCategory] = useState("");
    const [categoryimg, setCategoryImg] = useState(""); // Cloudinary URL
    const [categoryPreview, setCategoryPreview] = useState(""); // Local preview

    const [subcategories, setSubcategories] = useState<
        { _id?: string; name: string; image: string; preview: string }[]
    >([{ name: "", image: "", preview: "" }]);

    const [loading, setLoading] = useState(false);

    // Upload to Cloudinary
    const uploadToCloudinary = async (file: File) => {
        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await axios.post(
                "http://localhost:8000/api/uploadcloudinary", // ✅ use correct endpoint
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            console.log("Cloudinary upload response:", res.data);

            // handle both {url} or {secure_url}
            return res.data.url || res.data.secure_url;
        } catch (error) {
            console.error("Cloudinary upload failed:", error);
            throw error;
        }
    };


    // Fetch existing category (for editing)
    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const res = await axios.get(`${api}/category/getcategorybyid/${id}`);
                const data = res.data?.category;
                setCategory(data?.category);
                console.log(data, "data")
                setCategoryImg(data.categoryimg);
                setSubcategories(
                    data.subcategories.map((sub: any) => ({
                        _id: sub._id,
                        name: sub.name,
                        image: sub.image,
                        preview: sub.image, // show cloudinary img initially
                    }))
                );
            } catch (error) {
                console.error("Error fetching category:", error);
            }
        };
        fetchCategory();
    }, [id]);

    // Category image upload
    const handleCategoryImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setCategoryPreview(URL.createObjectURL(file)); // show preview immediately
            try {
                const url = await uploadToCloudinary(file);
                setCategoryImg(url); // set Cloudinary URL after upload
            } catch {
                alert("Failed to upload category image");
            }
        }
    };


    // Subcategory image upload
    const handleSubcategoryImage = async (
        index: number,
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const previewUrl = URL.createObjectURL(file);

            const updated = [...subcategories];
            updated[index].preview = previewUrl; // immediate preview
            setSubcategories(updated);

            try {
                const url = await uploadToCloudinary(file);
                updated[index].image = url; // cloudinary URL
                setSubcategories([...updated]);
            } catch {
                alert("Failed to upload subcategory image");
            }
        }
    };

    const handleAddSubcategory = () => {
        setSubcategories([...subcategories, { name: "", image: "", preview: "" }]);
    };

    const handleRemoveSubcategory = (index: number) => {
        const updated = [...subcategories];
        updated.splice(index, 1);
        setSubcategories(updated);
    };

    const handleSubcategoryName = (index: number, value: string) => {
        const updated = [...subcategories];
        updated[index].name = value;
        setSubcategories(updated);
    };

    const updateCategory = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                category,
                categoryimg,
                subcategories: subcategories.map(({ _id, name, image }) => ({
                    _id,
                    name,
                    image,
                })),
            };

            const res = await axios.put(`${api}/category/update/${id}`, payload);
            alert("Category updated successfully!");
            console.log(res.data);

            navigate("/categories"); // go back to list
        } catch (error) {
            console.error(error);
            alert("Error updating category");
        }
        setLoading(false);
    };

    return (
        <section className="p-4">
            <h1 className="text-2xl font-bold mb-2">Edit Category</h1>
            <Card className="p-3">
                <form className="space-y-4" onSubmit={updateCategory}>
                    {/* Category Name + Image */}
                    <Card className="grid grid-cols-1 md:grid-cols-3 p-3 gap-4">
                        <section>
                            <Label className="mb-2">Category Name</Label>
                            <Input
                                type="text"
                                placeholder="Enter category name"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                required
                            />
                        </section>

                        <section>
                            <Label className="mb-2">Category Image</Label>
                            <Input type="file" onChange={handleCategoryImage} />
                            {/* Preview: If no new file uploaded, show Cloudinary img */}
                            {categoryPreview || categoryimg ? (
                                <img
                                    src={categoryPreview || categoryimg}
                                    alt="category-preview"
                                    width="100"
                                    className="mt-2 rounded-md border"
                                />
                            ) : null}
                        </section>
                    </Card>

                    {/* Subcategories */}
                    <section>
                        <h3 className="text-lg font-medium">Subcategories</h3>
                        <div className="space-y-3">
                            {subcategories.map((sub, index) => (
                                <div
                                    key={index}
                                    className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center p-4 border rounded-md"
                                >
                                    {/* Subcategory Name */}
                                    <div className="md:col-span-2">
                                        <Input
                                            type="text"
                                            placeholder="Subcategory Name"
                                            value={sub.name}
                                            onChange={(e) =>
                                                handleSubcategoryName(index, e.target.value)
                                            }
                                            required
                                            className="w-full"
                                        />
                                    </div>

                                    {/* Subcategory Image */}
                                    <div className="md:col-span-2">
                                        <Input
                                            type="file"
                                            onChange={(e) => handleSubcategoryImage(index, e)}
                                            className="w-full"
                                        />
                                        {/* Preview (Cloudinary or local) */}
                                        {sub.preview && (
                                            <img
                                                src={sub.preview}
                                                alt={`sub-preview-${index}`}
                                                width="100"
                                                className="mt-2 rounded-md border"
                                            />
                                        )}
                                    </div>

                                    {/* Remove */}
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

                    <Button type="submit" className="w-fit">
                        {loading ? "Updating..." : "✅ Update Category"}
                    </Button>
                </form>
            </Card>
        </section>
    );
};

export default EditCategory;
