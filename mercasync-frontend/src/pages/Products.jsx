const Products = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Productos</h1>

        <button className="bg-black text-white px-4 py-2 rounded-lg">
          Nuevo Producto
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow p-4">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-3">Nombre</th>
              <th className="text-left p-3">Stock</th>
              <th className="text-left p-3">Precio</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td className="p-3">Arroz Diana</td>
              <td className="p-3">52</td>
              <td className="p-3">$4.500</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;