import { LogOut } from "lucide-react"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "../../components/ui/breadcrumb"
import { Separator } from "../../components/ui/separator"
import {
    SidebarTrigger,
} from "../../components/ui/sidebar"
import { ModeToggle } from "../../Theme"
import { useNavigate } from "react-router-dom"
const Header = () => {

    const router = useNavigate();
    const logout = () =>{
        router("/")
    }

    return (
        <section>
            <header className="flex h-14 shrink-0 items-center justify-between gap-2 border border-l-0 px-4">
                <section className="flex items-center justify-center gap-2">
                    <SidebarTrigger className="-ml-1" />
                    <Separator
                        orientation="vertical"
                        className="mr-2 data-[orientation=vertical]:h-4"
                    />
                    <Breadcrumb>
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
                    </Breadcrumb>
                </section>
                <section className="flex items-center justify-center gap-2">
                    <ModeToggle/>
                    <LogOut onClick={logout} className=" dark:bg-white cursor-pointer dark:text-red-600 bg-red-600 text-white h-8 w-8 p-2 rounded-full border-1"/>
                </section>
            </header>
        </section>
    )
}

export default Header