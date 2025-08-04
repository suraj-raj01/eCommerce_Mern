import { Link, Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <div>
      <nav className='flex items-center justify-center gap-2 font-semibold h-15 shadow-md'>
        <Link to='/home'>Home</Link>
        <Link to='/about'>About</Link>
        <Link to='/dashboard'>Dashboard</Link>
      </nav>
        <Outlet/>
    </div>
  )
}

export default Layout