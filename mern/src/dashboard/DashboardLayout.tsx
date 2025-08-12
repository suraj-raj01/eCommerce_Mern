import { Outlet } from "react-router-dom"
import { AppSidebar } from "../components/app-sidebar"
import {
  SidebarProvider,
} from "../components/ui/sidebar"
import Header from "./components/Header"

export default function Page() {
  return (
    <SidebarProvider>
      <div className="flex w-full h-screen overflow-hidden">
        <AppSidebar />

        <div className="flex flex-col flex-1">
          {/* Sticky Header */}
          <Header />

          {/* Scrollable Content Area */}
          <section className="flex-1 overflow-y-auto p-2 rounded-sm">
            <Outlet />
          </section>
        </div>
      </div>
    </SidebarProvider>

  )
}
