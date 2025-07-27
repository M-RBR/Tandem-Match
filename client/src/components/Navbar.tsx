import TMLogo from "../assets/TM_logo.jpg";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between  py-2 px-4">
      <div className="flex items-center">
        <img src={TMLogo} alt="Tandem Match Logo" className="h-10 w-auto" />
      </div>
      <div>
        <button className="bg-white hover:bg-gray-50 text-green-900 font-bold text-xl py-2 px-4 rounded">
          Log in
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
