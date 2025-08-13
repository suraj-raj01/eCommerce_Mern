import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../../API";

type Category = {
    _id: string;
    name: string;
    image: string;
    subcategories: Array<{
        _id: string;
        name: string;
    }>;
}

const CategoryView = () => {
    const { id } = useParams();
    const [category, setCategory] = useState<Category | null>(null);

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

    return (
        <div>
            <h1>Category Details</h1>
            <pre>
                {JSON.stringify(category, null, 2)}
            </pre>
        </div>
    );
};

export default CategoryView;