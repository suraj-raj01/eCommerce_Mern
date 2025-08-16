import { useEffect, useState } from "react";
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../components/ui/select";
import axios from "axios";
import { Button } from "../../../components/ui/button";
import { Skeleton } from "../../../components/ui/skeleton";
import { useNavigate, useParams } from "react-router-dom";
import { User } from "lucide-react";
import Swal from "sweetalert2";

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
import api from "../../../API";

const Edituser = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        roleId: '',
        profile: '',
    });

    const [profileimg, setProfileimg] = useState<File | null>(null);
    const [roles, setRole] = useState<Users[]>([]);
    const [loading, setLoading] = useState(false);

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        console.log(formData, "formdata");
    };

    const handleRoleChange = (value: string) => {
        setFormData((prev) => ({
            ...prev,
            roleId: value,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setProfileimg(file);
        }
    };

    const fetchRoles = async () => {
        setLoading(true)
        try {
            const response = await axios.get(`${api}/roles/getrole`);
            setRole(response?.data?.data || []);
        } catch (error) {
            console.error('Error fetching roles:', error);
        }
        setLoading(false)
    };

    const params = useParams();
    const id = params.id;

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${api}/users/getuserbyid/${id}`);
            setFormData(response?.data?.data || {});
            // console.log(response.data?.data)
        } catch (error) {
            console.error('Error fetching users:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchRoles();
        fetchUsers();
    }, []);

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent default form submission

        const formDataToSend = new FormData();
        formDataToSend.append("name", formData.name);
        formDataToSend.append("email", formData.email);
        formDataToSend.append("password", formData.password);
        formDataToSend.append("roleId", formData.roleId);
        if (profileimg) {
            formDataToSend.append("profile", profileimg);
        }

        try {
            console.log(formDataToSend, "Formdatatosend");
            const res = await axios.patch(`${api}/users/updateuser/${id}`, formDataToSend);
            Swal.fire({
                title: res.data.message || "User updated successfully!",
                icon: "success",
                confirmButtonText: "OK"
            });
            setFormData({ name: '', email: '', password: '', roleId: '', profile:''});
            setProfileimg(null);
            window.location.href = "/dashboard/user";
        } catch (error) {
            console.error("Error creating user:", error);
            // alert("Failed to create user");
        }
    };

    return (
        <section className="p-3">
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
                    <Button onClick={() => { navigate("/dashboard/user") }}>
                        <User />
                        See All Users
                    </Button>
                )}
            </div>

            <div className="flex items-center justify-center w-full gap-2">
                <form className="grid gap-4 w-full border p-5 mt-3 rounded-md" onSubmit={handleSubmit}>
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            name="name"
                            placeholder="Enter name"
                            value={formData.name}
                            onChange={handleInput}
                            required
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
                            required
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
                            required
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="profile">Profile Image</Label>
                        <Input
                            id="profile"
                            name="profile"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                        {(profileimg || formData.profile) && (
                            <img
                                src={
                                    profileimg
                                        ? URL.createObjectURL(profileimg)
                                        : `${api}/uploads/${formData.profile}`
                                }
                                alt="Profile Preview"
                                height={50}
                                width={50}
                                className="mt-2 rounded-md"
                            />
                        )}

                    </div>

                    <div className="grid gap-2">
                        <Label>Select role</Label>
                        <Select value={formData.roleId} onValueChange={handleRoleChange} required>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                                {roles.map((role, index) => (
                                    <SelectItem key={index} value={role._id.toString()}>
                                        {role.role}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                    </div>

                    <Button type="submit" variant="default">
                        Submit
                    </Button>
                </form>
            </div>
        </section>
    );
};

export default Edituser;
