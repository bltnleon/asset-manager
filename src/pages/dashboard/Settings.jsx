import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { auth } from "../../firebase";
import { useState } from "react";
import { useOutletContext } from "react-router-dom";

const inputStyle =
  "mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500";

const emptyPasswords = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

function Settings() {
  const { assets, clearAssets } = useOutletContext();

  const [passwords, setPasswords] = useState(emptyPasswords);
  const [passwordMessage, setPasswordMessage] = useState(null);
  const [dataMessage, setDataMessage] = useState("");

  function handleChange(e) {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  }

  async function handlePasswordSubmit(e) {
    e.preventDefault();

    if (passwords.newPassword.length < 6) {
      setPasswordMessage({
        type: "error",
        text: "New password must be at least 6 characters.",
      });
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordMessage({
        type: "error",
        text: "New passwords do not match.",
      });
      return;
    }

    try {
      const currentUser = auth.currentUser;
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        passwords.currentPassword,
      );
      await reauthenticateWithCredential(currentUser, credential);
      await updatePassword(currentUser, passwords.newPassword);

      setPasswords(emptyPasswords);
      setPasswordMessage({
        type: "success",
        text: "Password changed successfully.",
      });
    } catch (err) {
      if (
        err.code === "auth/invalid-credential" ||
        err.code === "auth/wrong-password"
      ) {
        setPasswordMessage({
          type: "error",
          text: "Current password is incorrect.",
        });
      } else {
        setPasswordMessage({
          type: "error",
          text: `Could not change password (${err.code}).`,
        });
      }
    }
  }

  function handleClearAssets() {
    if (
      window.confirm(
        `This will permanently delete all ${assets.length} assets. Continue?`,
      )
    ) {
      clearAssets();
      setDataMessage("All assets have been deleted.");
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      <p className="text-gray-600">Manage your account and data.</p>

      {/* Change password */}
      <div className="mt-6 max-w-xl bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Change password</h2>

        <form onSubmit={handlePasswordSubmit} className="mt-4 space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Current password
            <input
              name="currentPassword"
              type="password"
              value={passwords.currentPassword}
              onChange={handleChange}
              required
              className={inputStyle}
            />
          </label>

          <label className="block text-sm font-medium text-gray-700">
            New password
            <input
              name="newPassword"
              type="password"
              value={passwords.newPassword}
              onChange={handleChange}
              required
              className={inputStyle}
            />
          </label>

          <label className="block text-sm font-medium text-gray-700">
            Confirm new password
            <input
              name="confirmPassword"
              type="password"
              value={passwords.confirmPassword}
              onChange={handleChange}
              required
              className={inputStyle}
            />
          </label>

          {passwordMessage && (
            <p
              className={`text-sm ${
                passwordMessage.type === "error"
                  ? "text-red-600"
                  : "text-green-600"
              }`}
            >
              {passwordMessage.text}
            </p>
          )}

          <button
            type="submit"
            className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700"
          >
            Update password
          </button>
        </form>
      </div>

      {/* Danger zone */}
      <div className="mt-6 max-w-xl bg-white p-6 rounded-xl border border-red-200 shadow-sm">
        <h2 className="text-lg font-semibold text-red-700">Danger zone</h2>
        <p className="mt-1 text-gray-600">
          You currently have {assets.length} registered assets. Deleting them
          cannot be undone.
        </p>

        {dataMessage && (
          <p className="mt-3 text-green-600 text-sm">{dataMessage}</p>
        )}

        <button
          onClick={handleClearAssets}
          disabled={assets.length === 0}
          className="mt-4 border border-red-300 text-red-600 px-5 py-2 rounded-lg font-medium hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Delete all assets
        </button>
      </div>
    </div>
  );
}

export default Settings;
