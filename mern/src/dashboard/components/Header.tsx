import { LogOut } from "lucide-react"
import { Separator } from "../../components/ui/separator"
import {
    SidebarTrigger,
} from "../../components/ui/sidebar"
import { ModeToggle } from "../../Theme"
// import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import Swal from "sweetalert2"
import { Avatar, AvatarImage } from "../../components/ui/avatar"
import api from "../../API"
const Header = () => {
    const [email, setEmail] = useState('')
    const [image, setImage] = useState('')

    // const router = useNavigate();
    const logout = () => {
        localStorage.clear();
        Swal.fire({
            title: "Are you sure?",
            text: "You will be logged out of your account.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, logout",
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.clear(); 
                window.location.href = "/"; 
            }
        });
    }
    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            const parsedUser = JSON.parse(user);
            setEmail(parsedUser?.user.name)
            setImage(parsedUser?.user.profile)
            // console.log(parsedUser, "User from localStorage");
        } else {
            console.log("No user in localStorage");
        }
    }, []);

    return (
        <section>
            <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b-1 px-4">
                <section className="flex items-center justify-center gap-2">
                    <SidebarTrigger className="-ml-1" />
                    <Separator
                        orientation="vertical"
                        className="mr-2 data-[orientation=vertical]:h-4"
                    />
                    {/* <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem className="hidden md:block">
                                <BreadcrumbLink href="#">
                                    Dashbaord
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden md:block" />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Data Analyzer</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb> */}
                </section>
                <section className="flex items-center justify-center gap-2">
                    <Avatar className="w-7 h-7">
                        <AvatarImage src={`${api}/uploads/${image}`} />
                    </Avatar>
                    {email}
                    <ModeToggle />
                    <LogOut onClick={logout} className=" dark:bg-white cursor-pointer dark:text-red-600 bg-red-600 text-white h-8 w-8 p-2 rounded-full border-1" />
                </section>
            </header>
        </section>
    )
}

export default Header