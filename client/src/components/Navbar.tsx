import TMLogo from "../assets/TM_logo3.png";
import AuthModal from "./AuthModal";
import { User, LogOut } from "lucide-react";
import { useState } from "react";
import { useUser } from "../contexts/useUser";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { user, logout } = useUser();
  const location = useLocation();

  const showUserIcon = user && location.pathname === "/dashboard";

  return (
    <>
      <nav className="flex items-center justify-between py-2 px-4">
        <div className="flex items-center">
          {showUserIcon ? (
            <Link
              to="/createprofile"
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              title="Go to profile"
            >
              <User className="text-green-700" size={28} />
            </Link>
          ) : (
            <img src={TMLogo} alt="Tandem Match Logo" className="h-10 w-auto" />
          )}
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <button
              onClick={logout}
              className="flex items-center gap-2 bg-white hover:bg-gray-50 text-green-700 font-bold text-xl py-2 px-4 rounded"
            >
              Log out
              <LogOut className="text-green-700" size={26} />
            </button>
          ) : (
            <button
              onClick={() => setShowLoginModal(true)}
              className="bg-white hover:bg-gray-50 text-green-700 font-bold text-xl py-2 px-4 rounded"
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
