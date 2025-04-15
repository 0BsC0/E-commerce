import Link from 'next/link';

export default function Sidebar() {
  return (
    <aside className="w-60 bg-gray-100 h-screen p-4">
      <nav className="flex flex-col gap-4">
        <Link href="/admin/products" className="hover:text-blue-600 font-medium">Productos</Link>
        <Link href="/admin/categories" className="hover:text-blue-600 font-medium">Categorías</Link>
      </nav>
    </aside>
  );
}
