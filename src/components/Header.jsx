import React from "react";
import { Landmark } from "lucide-react";

function Header() {
  return (
    <nav className="h-16 sm:h-20 bg-gradient-to-r from-indigo-950 via-indigo-900 to-blue-900 shadow-xl flex items-center justify-between px-4 sm:px-6 border-b border-indigo-700">
      
      <div className="flex items-center gap-3 sm:gap-4">
        
        {/* EMBLEM */}
        <div className="w-10 pl-3 h-10 sm:w-12 sm:h-12 rounded-full bg-white flex items-center justify-center shadow-md">
          <Landmark className="text-indigo-900 w-5 h-5 sm:w-7 sm:h-7" />
        </div>

        {/* TITLE */}
        <div>
          <h1 className="text-white text-sm sm:text-2xl font-bold tracking-wide">
            Bank Information GIS
          </h1>

          <p className="text-indigo-200 text-[10px] sm:text-sm">
            Interactive Banking Visualization System
          </p>
        </div>
      </div>
    </nav>
  );
}

export default Header;