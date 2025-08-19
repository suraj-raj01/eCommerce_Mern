import {BrowserRouter,Routes,Route} from "react-router-dom"
import Layout from "./Layout"
import Home from "./pages/Home"
import About from "./pages/About"
import DashboardLayout from "./dashboard/DashboardLayout"
import DashboardHome from "./dashboard/components/DashboardHome"
import Roles from "./dashboard/Authentication/Roles"
import Permission from "./dashboard/Authentication/Permission"
import LoginPage from "./Auth/Login"
import User from "./dashboard/Authentication/User"
import Category from "./dashboard/Products/categories/Categories"
import Products from "./dashboard/Products/Products"
import CategoryView from "./dashboard/Products/categories/CategoryView"
import CreateCategory from "./dashboard/Products/categories/CreateCategory"
import EditCategory from "./dashboard/Products/categories/EditCategory"
import CreateProduct from "./dashboard/Products/CreateProduct"
import Createuser from "./dashboard/Authentication/Users/Createuser"
import Edituser from "./dashboard/Authentication/Users/Edituser"
import Managepermission from "./dashboard/Authentication/Managepermission"
import PageNotFound from "./PageNotFound"
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
          <Route path="*" element={<PageNotFound/>}/>
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
          <Route path="*" element={<PageNotFound/>}/>
        </Route>
      </Routes>
      </BrowserRouter>
    </main>
  )
}

export default App