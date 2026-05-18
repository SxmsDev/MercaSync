const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96">
        <h1 className="text-3xl font-bold text-center mb-6">
          MercaSync
        </h1>

        <input
          type="email"
          placeholder="Correo"
          className="w-full border p-3 rounded-lg mb-4"
        />

        <input
          type="password"
          placeholder="Contraseña"
          className="w-full border p-3 rounded-lg mb-4"
        />

        <button className="w-full bg-black text-white p-3 rounded-lg hover:bg-gray-800 transition">
          Ingresar
        </button>
      </div>
    </div>
  );
};

export default Login;