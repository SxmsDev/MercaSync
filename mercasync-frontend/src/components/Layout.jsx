import Navbar from './Navbar'
import Sidebar from './Sidebar'

const Layout = ({ children }) => {
  return (
    <div className="flex">
      <Sidebar />

      <div className="ml-64 w-full">
        <Navbar />

        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Layout