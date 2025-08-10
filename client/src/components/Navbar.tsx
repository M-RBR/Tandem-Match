/*

import TMLogo from "../assets/TM_logo.jpg";
import { useState } from "react";
import AuthModal from "./AuthModal";
import { useUser } from "../contexts/UserContext";

const Navbar = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { user, logout } = useUser();

  return (
    <>
      <nav className="flex items-center justify-between py-2 px-4">
        <div className="flex items-center">
          <img src={TMLogo} alt="Tandem Match Logo" className="h-10 w-auto" />
        </div>
        <div>
          {user ? (
            <button
              onClick={logout}
              className="bg-white hover:bg-red-50 text-green-900 font-bold text-xl py-2 px-4 rounded"
            >
              Log out
            </button>
          ) : (
            <button
              onClick={() => setShowLoginModal(true)}
              className="bg-white hover:bg-gray-50 text-green-900 font-bold text-xl py-2 px-4 rounded"
            >
              Log in
            </button>
          )}
        </div>
      </nav>

      {showLoginModal && (
        <AuthModal onClose={() => setShowLoginModal(false)} mode="login" />
      )}
    </>
  );
};

export default Navbar;

*/

import TMLogo from "../assets/TM_logo.jpg";
import { useState } from "react";
import AuthModal from "./AuthModal";
import { useUser } from "../contexts/UserContext";
import { User } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { user, logout } = useUser();

  return (
    <>
      <nav className="flex items-center justify-between py-2 px-4">
        <div className="flex items-center">
          <img src={TMLogo} alt="Tandem Match Logo" className="h-10 w-auto" />
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link
                to="/createprofile"
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                title="Edit profile"
              >
                <User className="text-green-700" size={24} />
              </Link>
              <button
                onClick={logout}
                className="bg-white hover:bg-red-50 text-green-900 font-bold text-xl py-2 px-4 rounded"
              >
                Log out
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowLoginModal(true)}
              className="bg-white hover:bg-gray-50 text-green-900 font-bold text-xl py-2 px-4 rounded"
            >
              Log in
            </button>
          )}
        </div>
      </nav>

      {showLoginModal && (
        <AuthModal onClose={() => setShowLoginModal(false)} mode="login" />
      )}
    </>
  );
};

export default Navbar;
