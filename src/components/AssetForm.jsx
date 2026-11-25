import { useState } from "react";
import { CATEGORIES, CONDITIONS, STATUSES } from "../constants";

const emptyForm = {
  name: "",
  serialNumber: "",
  location: "",
  cost: "",
  category: CATEGORIES[0],
  condition: "New",
  purchaseDate: "",
  department: "",
  status: "Available",
  assignedTo: "",
};

const inputStyle =
  "mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500";

function Field({ label, children }) {
  return (
    <label className="block text-sm font-medium text-gray-700">
      {label}
      {children}
    </label>
  );
}

function AssetForm({ initialData, onSave, onCancel }) {
  const [formData, setFormData] = useState(initialData || emptyForm);
  const [error, setError] = useState("");

  const isEditing = Boolean(initialData);

  function handleChange(e) {
    const { name, value } = e.target;

    if (name === "status" && value !== "Assigned") {
      setFormData({ ...formData, status: value, assignedTo: "" });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    const message = onSave(formData);
    if (message) setError(message);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
    >
      <h2 className="text-lg font-semibold text-gray-900">
        {isEditing ? "Edit asset" : "Register a new asset"}
      </h2>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Field label="Asset name">
          <input
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
            className={inputStyle}
          />
        </Field>

        <Field label="Serial no. / registration no.">
          <input
            name="serialNumber"
            type="text"
            value={formData.serialNumber}
            onChange={handleChange}
            required
            className={inputStyle}
          />
        </Field>

        <Field label="Category">
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={inputStyle}
          >
            {CATEGORIES.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </Field>

        <Field label="Current location">
          <input
            name="location"
            type="text"
            value={formData.location}
            onChange={handleChange}
            required
            className={inputStyle}
          />
        </Field>

        <Field label="Cost of purchase">
          <input
            name="cost"
            type="number"
            min="0"
            step="0.01"
            value={formData.cost}
            onChange={handleChange}
            required
            className={inputStyle}
          />
        </Field>

        <Field label="Date of purchase">
          <input
            name="purchaseDate"
            type="date"
            value={formData.purchaseDate}
            onChange={handleChange}
            required
            className={inputStyle}
          />
        </Field>

        <Field label="Condition when purchased">
          <select
            name="condition"
            value={formData.condition}
            onChange={handleChange}
            className={inputStyle}
          >
            {CONDITIONS.map((condition) => (
              <option key={condition}>{condition}</option>
            ))}
          </select>
        </Field>

        <Field label="Department allocated to">
          <input
            name="department"
            type="text"
            value={formData.department}
            onChange={handleChange}
            required
            className={inputStyle}
          />
        </Field>

        <Field label="Status">
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className={inputStyle}
          >
            {STATUSES.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
        </Field>

        {formData.status === "Assigned" && (
          <Field label="Assigned to">
            <input
              name="assignedTo"
              type="text"
              value={formData.assignedTo}
              onChange={handleChange}
              required
              className={inputStyle}
            />
          </Field>
        )}
      </div>

      {error && <p className="mt-4 text-red-600 text-sm">{error}</p>}

      <div className="mt-6 flex gap-3">
        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700"
        >
          {isEditing ? "Save changes" : "Register asset"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="border border-gray-300 text-gray-700 px-5 py-2 rounded-lg font-medium hover:bg-gray-100"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default AssetForm;
