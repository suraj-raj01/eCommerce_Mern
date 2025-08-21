import { Outlet } from 'react-router-dom'
import { Navbar02 } from './components/ui/shadcn-io/navbar-02'

const Layout = () => {
  return (
    <div>
      <Navbar02 />
      <Outlet />
    </div>
  )
}

export default Layout