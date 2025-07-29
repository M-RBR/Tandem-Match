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
