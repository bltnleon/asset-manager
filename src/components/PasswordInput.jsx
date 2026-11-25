import { useState } from "react";

function EyeIcon({ slashed }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
      {slashed && <path strokeLinecap="round" d="M3 3l18 18" />}
    </svg>
  );
}

function PasswordInput({ label, name, value, onChange }) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>

      <div className="relative mt-1">
        <input
          id={name}
          name={name}
          type={visible ? "text" : "password"}
          value={value}
          onChange={onChange}
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-11 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={() => setVisible(!visible)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute inset-y-0 right-0 px-3 text-gray-500 hover:text-gray-700"
        >
          <EyeIcon slashed={visible} />
        </button>
      </div>
    </div>
  );
}

export default PasswordInput;
