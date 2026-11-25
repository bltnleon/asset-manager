import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-blue-600">
          AssetTrack
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/login" className="text-gray-700 hover:text-blue-600">
            Log in
          </Link>
          <Link
            to="/signup"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Sign up
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
