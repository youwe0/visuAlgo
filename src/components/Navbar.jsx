import React from "react";

const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-wide">
          Algorithm Visualizer
        </h1>
        <div className="flex gap-4 text-sm">
          <a
            href="#github"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            GitHub
          </a>
          <a href="#about" className="hover:underline">
            About
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;