import React, { useState } from "react";
import ProfileInfoCard from "../Cards/ProfileInfoCard";
import { Link, useLocation } from "react-router-dom";
import { HiOutlineMenuAlt3, HiX } from "react-icons/hi";

const NAV_LINKS = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/profile", label: "Profile" },
];

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full bg-[#fffaef]/90 backdrop-blur-sm border-b border-[#EBE9E4]">
      <div className="container mx-auto px-4 md:px-8 h-20 md:h-24 flex justify-between items-center">
        <Link to="/">
          <div className="text-amber-600 text-xl tracking-[0.2em] uppercase font-light">
            NextStep <span className="font-bold">AI</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`text-sm tracking-widest font-medium transition-opacity ${
                pathname === to
                  ? "text-amber-600 border-b-2 border-amber-600 pb-1"
                  : "hover:opacity-50"
              }`}
            >
              {label}
            </Link>
          ))}
          <ProfileInfoCard />
        </div>

        {/* Mobile hamburger */}
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

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#fffaef] border-t border-[#EBE9E4] px-4 pb-6 pt-4 flex flex-col gap-4">
          {NAV_LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`text-sm tracking-widest font-medium transition-opacity ${
                pathname === to ? "text-amber-600" : "hover:opacity-50"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {label}
            </Link>
          ))}

          <div className="border-t border-[#EBE9E4] pt-4 mt-1">
            <ProfileInfoCard />
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
