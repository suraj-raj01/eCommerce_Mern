import { useState } from "react";
import axios from "axios";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

export default function FileUpload(){
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Handle file selection + generate previews
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(selectedFiles);

      // Generate preview URLs
      const previewUrls = selectedFiles.map((file) =>
        URL.createObjectURL(file)
      );
      setPreviews(previewUrls);
    }
  };

  // Upload single file
  const handleUpload = async () => {
    if (files.length === 0) return alert("Please select a file");

    const formData = new FormData();
    formData.append("file", files[0]); // only first file for single upload

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:8000/api/uploadcloudinary/single",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setImageUrl(res.data.url);
      console.log(res.data);
    } catch (err: any) {
      console.error("Upload failed:", err.response?.data || err.message);
      alert("Upload failed, check console for details");
    } finally {
      setLoading(false);
    }
  };

  // Upload multiple files
  const handleUploadMultiple = async () => {
    if (files.length === 0) return alert("Please select files");

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file); // must match multer.array("files")
    });

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:8000/api/uploadcloudinary/multiple",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setImageUrls(res.data.files.map((f: any) => f.url));
      console.log(res.data);
    } catch (err: any) {
      console.error("Upload failed:", err.response?.data || err.message);
      alert("Upload failed, check console for details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Input type="file" multiple onChange={handleFileChange} />

      {/* Live preview before upload */}
      {previews.length > 0 && (
        <div className="flex flex-wrap gap-3 mt-3">
          {previews.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`preview-${index}`}
              width="150"
              className="rounded-md border"
            />
          ))}
        </div>
      )}

      <div className="flex gap-2 mt-3">
        <Button onClick={handleUpload} disabled={loading}>
          {loading ? "Uploading..." : "Upload Single"}
        </Button>

        <Button onClick={handleUploadMultiple} disabled={loading}>
          {loading ? "Uploading..." : "Upload Multiple"}
        </Button>
      </div>

      {/* Single uploaded image */}
      {imageUrl && (
        <div className="mt-3">
          <p className="text-sm text-gray-500">Uploaded Image:</p>
          <img src={imageUrl} alt="uploaded" width="200" />
        </div>
      )}

      {/* Multiple uploaded images */}
      {imageUrls.length > 0 && (
        <div className="flex flex-wrap gap-3 mt-3">
          {imageUrls.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`uploaded-${index}`}
              width="200"
              className="rounded-md border"
            />
          ))}
        </div>
      )}
    </div>
  );
}


