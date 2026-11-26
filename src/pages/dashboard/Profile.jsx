import { useState } from "react";
import { useOutletContext } from "react-router-dom";

const inputStyle =
  "mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500";

function Profile() {
  const { user, updateProfile } = useOutletContext();

  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || "",
    jobTitle: user.jobTitle || "",
  });

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function startEditing() {
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      jobTitle: user.jobTitle || "",
    });
    setMessage("");
    setIsEditing(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await updateProfile({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        jobTitle: formData.jobTitle.trim(),
      });
      setIsEditing(false);
      setMessage("Profile updated successfully.");
    } catch (err) {
      console.error(err);
      setMessage("Could not save your changes. Please try again.");
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
      <p className="text-gray-600">Your personal details.</p>

      {message && <p className="mt-4 text-green-600 text-sm">{message}</p>}

      <div className="mt-6 max-w-xl bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        {!isEditing ? (
          <div>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-semibold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-xl font-semibold text-gray-900">
                  {user.name}
                </p>
                <p className="text-gray-600">
                  {user.jobTitle || "No job title added"}
                </p>
              </div>
            </div>

            <dl className="mt-6 space-y-4">
              <div>
                <dt className="text-sm text-gray-500">Email</dt>
                <dd className="text-gray-900">{user.email}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Phone</dt>
                <dd className="text-gray-900">{user.phone || "-"}</dd>
              </div>
            </dl>

            <button
              onClick={startEditing}
              className="mt-6 bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700"
            >
              Edit profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Full name
              <input
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                className={inputStyle}
              />
            </label>

            <label className="block text-sm font-medium text-gray-700">
              Email
              <input
                name="email"
                type="email"
                value={formData.email}
                readOnly
                className={`${inputStyle} bg-gray-100 text-gray-500 cursor-not-allowed`}
              />
              <span className="block mt-1 text-xs font-normal text-gray-500">
                Email can't be changed because it determines your access level.
              </span>
            </label>

            <label className="block text-sm font-medium text-gray-700">
              Phone
              <input
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className={inputStyle}
              />
            </label>

            <label className="block text-sm font-medium text-gray-700">
              Job title
              <input
                name="jobTitle"
                type="text"
                value={formData.jobTitle}
                onChange={handleChange}
                className={inputStyle}
              />
            </label>

            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700"
              >
                Save changes
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="border border-gray-300 text-gray-700 px-5 py-2 rounded-lg font-medium hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default Profile;
