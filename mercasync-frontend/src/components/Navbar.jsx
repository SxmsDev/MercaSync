const Navbar = () => {
  return (
    <div className="w-full h-16 bg-white shadow flex items-center justify-between px-6">
      <h1 className="text-2xl font-bold text-black">
        MercaSync
      </h1>

      <div className="flex items-center gap-4">
        <img
          src="https://i.pravatar.cc/40"
          alt="user"
          className="rounded-full"
        />
      </div>
    </div>
  )
}

export default Navbar