import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-blue-600">🌱 Viveros Dashboard</h1>
      {user && (
        <div className="flex items-center gap-4">
          <span className="text-gray-700">{user.name}</span>
          <button onClick={logout} className="bg-red-500 text-white px-3 py-1 rounded">
            Cerrar sesión
          </button>
        </div>
      )}
    </header>
  );
}
