import DashboardLayout from "@/layout/DashboardLayout";

export default function ProductsAdminPage() {
  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold mb-4">📦 Lista de Productos</h2>
      {/* Aquí irán los productos mapeados con sus cards */}
      <p className="text-gray-600">Aquí se listarán los productos de la tienda con nombre, imagen, precio y categoría.</p>
    </DashboardLayout>
  );
}
