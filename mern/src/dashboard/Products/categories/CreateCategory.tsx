import axios from "axios";
import { useState } from "react";
import api from "../../../API";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Plus } from "lucide-react";
import { Card } from "../../../components/ui/card";

const CreateCategory = () => {
  const [category, setCategory] = useState("");
  const [categoryimg, setCategoryImg] = useState(""); // Cloudinary URL
  const [categoryPreview, setCategoryPreview] = useState(""); // Local preview

  const [subcategories, setSubcategories] = useState<
    { name: string; image: string; preview: string }[]
  >([{ name: "", image: "", preview: "" }]);

  const [loading, setLoading] = useState(false);

  // Upload to Cloudinary
  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await axios.post(
      "http://localhost:8000/api/uploadcloudinary",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return res.data.url; // backend returns {url, public_id}
  };

  // Category image upload
  const handleCategoryImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCategoryPreview(URL.createObjectURL(file)); // live preview
      const url = await uploadToCloudinary(file);
      setCategoryImg(url); // Cloudinary URL
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
      updated[index].preview = previewUrl; // temporary preview
      setSubcategories(updated);

      const url = await uploadToCloudinary(file);
      updated[index].image = url; // Cloudinary URL
      setSubcategories([...updated]);
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

  const createCategory = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        category,
        categoryimg,
        subcategories: subcategories.map(({ name, image }) => ({
          name,
          image, // only Cloudinary URL goes to backend
        })),
      };

      const res = await axios.post(`${api}/category/createcategory`, payload);
      alert("Category saved successfully!");
      console.log(res.data);

      // Reset form
      setCategory("");
      setCategoryImg("");
      setCategoryPreview("");
      setSubcategories([{ name: "", image: "", preview: "" }]);
    } catch (error) {
      console.error(error);
      alert("Error saving category");
    }
    setLoading(false);
  };

  return (
    <section className="p-4">
      <h1 className="text-2xl font-bold mb-2">Create Category</h1>
      <Card className="p-3">
        <form className="space-y-4" onSubmit={createCategory}>
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
              {/* Show preview before Cloudinary upload finishes */}
              {categoryPreview && (
                <img
                  src={categoryPreview}
                  alt="category-preview"
                  width="100"
                  className="mt-2 rounded-md border"
                />
              )}
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
                      onChange={(e) => handleSubcategoryName(index, e.target.value)}
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
                    {/* Live preview */}
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

            <Button type="button" size="sm" className="mt-2" onClick={handleAddSubcategory}>
              <Plus className="w-4 h-4 mr-1" /> Add Subcategory
            </Button>
          </section>

          <Button type="submit" className="w-fit">
            {loading ? "Creating..." : "✅ Create Category"}
          </Button>
        </form>
      </Card>
    </section>
  );
};

export default CreateCategory;
