import { useState, useContext } from "react";
import { APP_FEATURES } from "../utils/data";
import { Link, useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import Login from "./Auth/Login";
import SignUp from "./Auth/SignUp";
import { UserContext } from "../context/userContext";
import ProfileInfoCard from "../components/Cards/ProfileInfoCard";
import Typewriter from "typewriter-effect";
import LogoBar from "../components/LogoBar";
import { HiOutlineMenuAlt3, HiX } from "react-icons/hi";

const LandingPage = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [currentPage, setCurrentPage] = useState("login");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState(null);

  const handleCTA = () => {
    if (user) navigate("/dashboard");
    else setOpenAuthModal(true);
  };

  return (
    <>
      <div className="relative w-full min-h-screen bg-amber-100 text-[#2C2C2C] overflow-hidden">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full bg-[#fffaef]/90 backdrop-blur-sm border-b border-[#EBE9E4]">
          <div className="container mx-auto px-4 md:px-8 h-20 md:h-24 flex justify-between items-center">
            <Link
              to="/"
              className="text-amber-600 text-xl tracking-[0.2em] uppercase font-light no-underline"
            >
              NextStep <span className="font-bold">AI</span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-8">
              {user && (
                <Link
                  to="/dashboard"
                  className={`text-sm tracking-widest font-medium transition-opacity ${
                    activeNav === "dashboard"
                      ? "text-amber-600 border-b-2 border-amber-600 pb-1"
                      : "hover:opacity-50"
                  }`}
                  onClick={() => setActiveNav("dashboard")}
                >
                  Dashboard
                </Link>
              )}
              <button
                className={`text-sm tracking-widest font-medium transition-opacity cursor-pointer ${
                  activeNav === "method"
                    ? "text-amber-600 border-b-2 border-amber-600 pb-1"
                    : "hover:opacity-50"
                }`}
                onClick={() => {
                  setActiveNav("method");
                  document
                    .getElementById("features")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Method
              </button>
              {user ? (
                <ProfileInfoCard />
              ) : (
                <button
                  className="cursor-pointer border border-[#2C2C2C] px-8 py-3 text-sm tracking-widest font-medium hover:bg-[#2C2C2C] hover:text-white transition-all duration-500"
                  onClick={() => setOpenAuthModal(true)}
                >
                  Join
                </button>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden text-amber-600 cursor-pointer p-1"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
            >
              {mobileMenuOpen ? (
                <HiX size={24} />
              ) : (
                <HiOutlineMenuAlt3 size={24} />
              )}
            </button>
          </div>

          {/* Mobile nav dropdown */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-[#fffaef] border-t border-[#EBE9E4] px-4 pb-6 pt-4 flex flex-col gap-4">
              {user && (
                <Link
                  to="/dashboard"
                  className={`text-sm tracking-widest font-medium transition-opacity ${
                    activeNav === "dashboard"
                      ? "text-amber-600"
                      : "hover:opacity-50"
                  }`}
                  onClick={() => {
                    setActiveNav("dashboard");
                    setMobileMenuOpen(false);
                  }}
                >
                  Dashboard
                </Link>
              )}
              <button
                className={`text-sm tracking-widest font-medium transition-opacity cursor-pointer text-left ${
                  activeNav === "method" ? "text-amber-600" : "hover:opacity-50"
                }`}
                onClick={() => {
                  setActiveNav("method");
                  document
                    .getElementById("features")
                    ?.scrollIntoView({ behavior: "smooth" });
                  setMobileMenuOpen(false);
                }}
              >
                Method
              </button>
              <div className="border-t border-[#EBE9E4] pt-4 mt-1">
                {user ? (
                  <ProfileInfoCard />
                ) : (
                  <button
                    className="cursor-pointer border border-[#2C2C2C] px-6 py-3 hover:bg-[#2C2C2C] hover:text-white transition-all duration-500 w-fit"
                    onClick={() => {
                      setOpenAuthModal(true);
                      setMobileMenuOpen(false);
                    }}
                  >
                    Join
                  </button>
                )}
              </div>
            </div>
          )}
        </header>

        {/* Hero Section */}
        <main className="container mx-auto px-4 md:px-8 pt-10 md:pt-20 pb-10 md:pb-16">
          <div className="max-w-5xl">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-normal leading-[1.1] mb-8 md:mb-12 italic text-slate-800">
              Get ready for your
              <br />
              <div className="min-h-[1.2em] flex flex-col">
                <span className="not-italic font-light text-amber-600">
                  <Typewriter
                    options={{
                      strings: [
                        "SQL Interview",
                        "Software Engineer",
                        "System Design",
                      ],
                      autoStart: true,
                      loop: true,
                      delay: 75,
                      deleteSpeed: 50,
                    }}
                  />
                </span>
              </div>
            </h1>

            <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-start">
              <div className="w-full md:w-1/2 aspect-[4/5] bg-[#EBE9E4] relative group ">
                <img
                  src="hero-image.png"
                  alt="AI Interview Coach"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-700"></div>
                <div className="absolute bottom-0 left-0 md:bottom-[-20px] md:left-[-20px] p-6 md:p-8 bg-white shadow-xl max-w-xs hidden md:block">
                  <p className="text-sm italic">
                    "Practice doesn't make perfect. Perfect practice makes
                    perfect."
                  </p>
                </div>
              </div>

              <div className="w-full md:w-1/2 pt-4 md:pt-10">
                <p className="text-lg md:text-2xl leading-relaxed font-light mb-8 md:mb-12">
                  Role-specific questions and AI-guided mastery. We help you
                  transform your career narrative into a compelling story of
                  success.
                </p>
                <button
                  className="bg-[#2C2C2C] text-white px-8 md:px-12 py-4 md:py-5 text-sm uppercase tracking-[0.2em] md:tracking-[0.3em] hover:bg-amber-600 transition-opacity cursor-pointer"
                  onClick={handleCTA}
                >
                  Begin Your Journey
                </button>
              </div>
            </div>
          </div>
        </main>
        <LogoBar />

        {/* Features Section */}
        <section
          id="features"
          className="bg-white py-16 md:py-32 border-t border-[#EBE9E4]"
        >
          <div className="container mx-auto px-4 md:px-8">
            <p className="uppercase tracking-[0.4em] text-xs mb-10 md:mb-20 text-center">
              Core Capabilities
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 md:gap-x-20 gap-y-12 md:gap-y-32 max-w-6xl mx-auto">
              {APP_FEATURES.map((feature, idx) => (
                <div
                  key={feature.id}
                  className={`${idx % 2 !== 0 ? "md:pt-24" : ""}`}
                >
                  <span className="text-xs font-sans text-gray-400 mb-4 block">
                    0{idx + 1}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-light mb-4 md:mb-6 border-b border-[#2C2C2C] pb-4">
                    {feature.title}
                  </h3>
                  <p className="text-base md:text-lg text-gray-600 leading-relaxed font-light">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#F9F8F6]/80 py-12 md:py-20 text-center border-t border-[#EBE9E4]">
          <p className="uppercase tracking-[0.3em] md:tracking-[0.5em] text-xs md:text-sm text-gray-400 px-4">
            © 2026 NextStep AI
          </p>
        </footer>
      </div>

      <Modal
        isOpen={openAuthModal}
        onClose={() => setOpenAuthModal(false)}
        hideHeader
      >
        <div>
          {currentPage === "login" && <Login setCurrentPage={setCurrentPage} />}
          {currentPage === "signup" && (
            <SignUp setCurrentPage={setCurrentPage} />
          )}
        </div>
      </Modal>
    </>
  );
};

export default LandingPage;
