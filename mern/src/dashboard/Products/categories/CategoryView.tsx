import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "../../../components/ui/popover"
import api from "../../../API";
import { InfoIcon } from "lucide-react";

type Category = {
    _id: string;
    category: string;
    image: string;
    subcategories: Array<{
        _id: string;
        name: string;
    }>;
    createdAt: string;
    updatedAt: string;
};

const CategoryView = () => {
    const { id } = useParams();
    const [category, setCategory] = useState<Category | null>(null);

    const loadCategory = async () => {
        try {
            const response = await axios.get(`${api}/category/getcategorybyid/${id}`);
            setCategory(response.data.category || null);
        } catch (error) {
            console.error("Error loading category:", error);
        }
    };

    useEffect(() => {
        loadCategory();
    }, [id]);

    return (
        <div className="max-w-full mx-auto p-4 sm:p-6">
            <Card className="shadow-lg rounded-sm">
                {/* Header */}
                <CardHeader className="flex flex-col items-center text-center">
                    <Avatar className="w-20 h-20">
                        <AvatarImage src={category?.image || undefined} />
                        <AvatarFallback className="font-bold shadow-2xl">{category?.category?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <CardTitle className="mt-4 text-xl sm:text-2xl">
                        {category?.category}
                    </CardTitle>
                    <Badge variant="default" className="mt-2 rounded-xs">
                        {category?.subcategories.length} Subcategories
                    </Badge>
                </CardHeader>

                {/* Content */}
                <CardContent>
                    <h3 className="text-lg font-semibold mb-3 text-center sm:text-left">
                        
                        <Popover>
                            <PopoverTrigger className="flex items-center justify-center gap-1">Subcategories<InfoIcon size={16}/></PopoverTrigger>
                            <PopoverContent>
                                {/* Timestamps if needed */}
                                <div className="mt-6 text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
                                    <p>
                                        <strong>Created:</strong>{" "}
                                        {category ? new Date(category.createdAt).toLocaleString() : "N/A"}
                                    </p>
                                    <p>
                                        <strong>Updated:</strong>{" "}
                                        {category ? new Date(category.updatedAt).toLocaleString() : "N/A"}
                                    </p>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </h3>

                    {/* Responsive grid */}
                    <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {category?.subcategories.map((sub) => (
                            <Card
                                key={sub._id}
                                className="p-4 flex items-center gap-3 hover:shadow-md transition rounded-xs"
                            >
                                <Avatar>
                                    {/* <AvatarImage src={sub?.image || undefined} /> */}
                                    <AvatarFallback className="font-bold">{sub?.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className="font-medium text-sm sm:text-base">
                                    {sub?.name}
                                </span>
                            </Card>
                        ))}
                    </section>

                </CardContent>
            </Card>
        </div>
    );
};

export default CategoryView;
