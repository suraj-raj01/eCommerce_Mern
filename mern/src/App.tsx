import {BrowserRouter,Routes,Route} from "react-router-dom"
import Layout from "./Layout"
import Home from "./pages/Home"
import About from "./pages/About"
import DashboardLayout from "./dashboard/DashboardLayout"
import DashboardHome from "./dashboard/components/DashboardHome"
import Roles from "./dashboard/components/Authentication/Roles"
import Permission from "./dashboard/components/Authentication/Permission"
import LoginPage from "./Auth/Login"
import User from "./dashboard/components/Authentication/User"
import Category from "./dashboard/components/Products/categories/Categories"
import Products from "./dashboard/components/Products/Products"
import CategoryView from "./dashboard/components/Products/categories/CategoryView"
import CreateCategory from "./dashboard/components/Products/categories/CreateCategory"
import EditCategory from "./dashboard/components/Products/categories/EditCategory"
import CreateProduct from "./dashboard/components/Products/CreateProduct"
import Createuser from "./dashboard/components/Authentication/Users/Createuser"
import Edituser from "./dashboard/components/Authentication/Users/Edituser"
import Managepermission from "./dashboard/components/Authentication/Managepermission"
const App = () => {
  return (
    <main>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout/>}>
          <Route index element={<Home/>}/>
          <Route path="home" element={<Home/>}/>
          <Route path="about" element={<About/>}/>
          <Route path="login" element={<LoginPage/>}/>
        </Route>

         <Route path="/dashboard" element={<DashboardLayout/>}>
          <Route index element={<DashboardHome/>}/>
          <Route path="home" element={<DashboardHome/>}/>
          <Route path="roles" element={<Roles/>}/>
          <Route path="permission" element={<Permission/>}/>
          <Route path="managepermission" element={<Managepermission/>}/>
          <Route path="user" element={<User/>}/>
          <Route path="edituser/:id" element={<Edituser/>}/>
          <Route path="createuser" element={<Createuser/>}/>
          <Route path="categories" element={<Category/>}/>
          <Route path="createcategory" element={<CreateCategory/>}/>
          <Route path="editcategory/:id" element={<EditCategory/>}/>
          <Route path="categoryview/:id" element={<CategoryView/>}/>
          <Route path="products" element={<Products/>}/>
          <Route path="createproduct" element={<CreateProduct/>}/>
        </Route>
      </Routes>
      </BrowserRouter>
    </main>
  )
}

export default App