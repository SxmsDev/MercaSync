import { Link } from 'react-router-dom'

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-black text-white p-5 fixed">
      <h2 className="text-3xl font-bold mb-10">
        MercaSync
      </h2>

      <div className="flex flex-col gap-5">
        <Link
          to="/dashboard"
          className="hover:bg-gray-800 p-3 rounded-lg transition"
        >
          Dashboard
        </Link>

        <Link
          to="/products"
          className="hover:bg-gray-800 p-3 rounded-lg transition"
        >
          Productos
        </Link>
      </div>
    </div>
  )
}

export default Sidebar