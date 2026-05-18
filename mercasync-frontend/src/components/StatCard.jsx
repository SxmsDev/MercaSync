const StatCard = ({ title, value }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-300">
      <h2 className="text-gray-500 text-lg">
        {title}
      </h2>

      <p className="text-4xl font-bold mt-3">
        {value}
      </p>
    </div>
  )
}

export default StatCard