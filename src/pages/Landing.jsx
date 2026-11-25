import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const features = [
  {
    icon: "📦",
    title: "Track every asset",
    description:
      "Keep a clear record of all your equipment, tools, and devices in one place.",
  },
  {
    icon: "📍",
    title: "Know where things are",
    description: "See the location and status of each asset at a glance.",
  },
  {
    icon: "🛠️",
    title: "Stay on top of upkeep",
    description:
      "Never lose track of what needs repair, servicing, or replacement.",
  },
];

function Landing() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero section */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
          Manage your physical assets with ease
        </h1>
        <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
          Track, organize, and monitor everything your business owns, from
          laptops to machinery, in one simple dashboard.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            to="/signup"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700"
          >
            Get started
          </Link>
          <Link
            to="/login"
            className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-100"
          >
            Log in
          </Link>
        </div>
      </section>

      {/* Features section */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
            >
              <div className="text-3xl">{feature.icon}</div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900">
                {feature.title}
              </h3>
              <p className="mt-2 text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-6 text-center text-gray-500">
        © 2026 AssetTrack. All rights reserved.
      </footer>
    </div>
  );
}

export default Landing;
