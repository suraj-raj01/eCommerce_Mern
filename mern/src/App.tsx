import {BrowserRouter,Routes,Route} from "react-router-dom"
import Layout from "./Layout"
import Home from "./pages/Home"
import About from "./pages/About"
import DashboardLayout from "./dashboard/DashboardLayout"
import DashboardHome from "./dashboard/components/DashboardHome"
import Roles from "./dashboard/components/Authentication/Roles"
import Permission from "./dashboard/components/Authentication/Permission"
import LoginPage from "./dashboard/components/Authentication/Users/Login"
import User from "./dashboard/components/Authentication/User"
import Category from "./dashboard/components/Products/Categories"
import Products from "./dashboard/components/Products/Products"
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
          <Route path="user" element={<User/>}/>
          <Route path="login" element={<LoginPage/>}/>
          <Route path="categories" element={<Category/>}/>
          <Route path="products" element={<Products/>}/>
        </Route>
      </Routes>
      </BrowserRouter>
    </main>
  )
}

export default App