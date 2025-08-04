import { Outlet } from "react-router-dom"
import { AppSidebar } from "../components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "../components/ui/sidebar"
import Header from "./components/Header"

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <section >
          <Outlet />
        </section>
      </SidebarInset>
    </SidebarProvider>
  )
}
