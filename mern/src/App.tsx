import {BrowserRouter,Routes,Route} from "react-router-dom"
import Layout from "./Layout"
import Home from "./pages/Home"
import About from "./pages/About"
import DashboardLayout from "./dashboard/DashboardLayout"
import DashboardHome from "./dashboard/components/DashboardHome"
import Roles from "./dashboard/components/Authentication/Roles"
import Permission from "./dashboard/components/Authentication/Permission"
const App = () => {
  return (
    <main>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout/>}>
          <Route index element={<Home/>}/>
          <Route path="home" element={<Home/>}/>
          <Route path="about" element={<About/>}/>
        </Route>

         <Route path="/dashboard" element={<DashboardLayout/>}>
          <Route index element={<DashboardHome/>}/>
          <Route path="home" element={<DashboardHome/>}/>
          <Route path="roles" element={<Roles/>}/>
          <Route path="permission" element={<Permission/>}/>
        </Route>
      </Routes>
      </BrowserRouter>
    </main>
  )
}

export default App