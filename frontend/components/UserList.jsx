import React, { useEffect, useState } from 'react';
import { getAllUsers } from '../services/userService';

const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getAllUsers().then(setUsers).catch(console.error);
  }, []);

  return (
    <div className="w-full max-w-md mx-auto bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-4 text-center">Usuarios</h2>
      <ul className="space-y-2">
        {users.length === 0 ? (
          <p className="text-gray-500 text-center">No hay usuarios disponibles.</p>
        ) : (
          users.map((user) => (
            <li key={user.id} className="bg-gray-100 p-2 rounded">
              <strong>{user.name}</strong> – {user.email}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default UserList;
