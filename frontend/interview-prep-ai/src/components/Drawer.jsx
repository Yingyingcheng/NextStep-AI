import React from "react";
import { LuX } from "react-icons/lu";

const Drawer = ({ isOpen, onClose, title, children }) => {
  return (
    <>
      {/* Backdrop on mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed z-40 overflow-y-auto transition-transform bg-white shadow-2xl shadow-cyan-800/10
          /* Mobile: slide up from bottom */
          inset-x-0 bottom-0 h-[75dvh] rounded-t-2xl p-4
          /* Desktop: slide in from right */
          md:inset-x-auto md:top-[96px] md:right-0 md:bottom-auto md:h-[calc(100dvh-96px)] md:w-[40vw] md:rounded-t-none md:border-l md:border-gray-200
          ${
            isOpen
              ? "translate-y-0 md:translate-y-0 md:translate-x-0"
              : "translate-y-full md:translate-y-0 md:translate-x-full"
          }`}
        tabIndex="-1"
        aria-labelledby="drawer-right-label"
      >
        {/* Drag handle on mobile */}
        <div className="flex justify-center mb-2 md:hidden">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h5
            id="drawer-right-label"
            className="flex items-center text-base font-semibold text-black"
          >
            {title}
          </h5>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex items-center justify-center cursor-pointer"
          >
            <LuX className="text-lg" />
          </button>
        </div>

        {/* Body Content */}
        <div className="text-sm mx-3 mb-6">{children}</div>
      </div>
    </>
  );
};

export default Drawer;
