import { useState } from "react";
import AuthModal from "../components/AuthModal";
import StarBackground from "../components/StarBackground";

const Home = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="relative min-h-screen">
      <StarBackground />

      <div className="relative z-10">
        <div className="flex flex-col text-center">
          <h1 className="text-6xl text-green-700 font-bold p-14">
            Tandem Match<span className="text-lg align-super ml-1">™</span>
          </h1>
          <p className="text-2xl text-green-600 font-bold italic p-4">
            Find your language partner. Start talking.
          </p>
        </div>
        <div className="flex flex-col justify-center items-center p-20">
          <button
            onClick={() => setShowModal(true)}
            className="bg-green-500 hover:bg-green-600 text-white text-lg font-bold py-2 px-4 rounded-full transition-colors duration-200"
          >
            Sign up
          </button>
          {showModal && (
            <AuthModal onClose={() => setShowModal(false)} mode="signup" />
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
