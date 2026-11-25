import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { getUsers, saveUsers, MAX_ADMINS, MAX_VIEWERS } from "../../auth";

const roleStyles = {
  admin: "bg-purple-100 text-purple-700",
  viewer: "bg-blue-100 text-blue-700",
};

const roleLabels = {
  admin: "Admin",
  viewer: "View only",
};

function Users() {
  const { user } = useOutletContext();
  const [users, setUsers] = useState(getUsers);

  const adminCount = users.filter((u) => u.role === "admin").length;
  const viewerCount = users.filter((u) => u.role === "viewer").length;

  function handleDelete(target) {
    if (target.id === user.id) return;

    if (
      window.confirm(
        `Delete ${target.name} (${target.email})? They will no longer be able to log in.`,
      )
    ) {
      const remaining = users.filter((u) => u.id !== target.id);
      saveUsers(remaining);
      setUsers(remaining);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Users</h1>
      <p className="text-gray-600">Manage who can access the system.</p>

      <div className="mt-6 grid gap-4 grid-cols-2 max-w-xl">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500">Admins</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">
            {adminCount}{" "}
            <span className="text-base font-normal text-gray-500">
              of {MAX_ADMINS}
            </span>
          </p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500">View-only users</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">
            {viewerCount}{" "}
            <span className="text-base font-normal text-gray-500">
              of {MAX_VIEWERS}
            </span>
          </p>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-sm text-gray-500">
              <tr>
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Role</th>
                <th className="px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((target) => (
                <tr
                  key={target.id}
                  className="border-t border-gray-100 whitespace-nowrap"
                >
                  <td className="px-5 py-3 font-medium text-gray-900">
                    {target.name}
                  </td>
                  <td className="px-5 py-3 text-gray-600">{target.email}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${roleStyles[target.role]}`}
                    >
                      {roleLabels[target.role]}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    {target.id === user.id ? (
                      <span className="text-gray-400">You</span>
                    ) : (
                      <button
                        onClick={() => handleDelete(target)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Users;
