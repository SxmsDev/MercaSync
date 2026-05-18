const Dashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-6">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold">Ventas</h2>
          <p className="text-3xl mt-4">$2.500.000</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold">Productos</h2>
          <p className="text-3xl mt-4">325</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold">Órdenes</h2>
          <p className="text-3xl mt-4">89</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;