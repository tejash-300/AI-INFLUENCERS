"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// Navbar links configuration
const NAV_LINKS = {
  Home: "/",
  Dashboard: "/dashboard",
  Features: "/#features",
  Testimonials: "/#testimonials",
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-[#0D1117] border-b border-gray-800 z-50">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-white">
          Influencer<span className="text-blue-400">GPT</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          {Object.entries(NAV_LINKS).map(([label, path]) => (
            <NavLink key={label} href={path}>
              {label}
            </NavLink>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "✖" : "☰"}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="md:hidden bg-[#161B22] border-t border-gray-800"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col items-center py-4">
              {Object.entries(NAV_LINKS).map(([label, path]) => (
                <NavLink key={label} href={path} onClick={() => setIsOpen(false)}>
                  {label}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

// Reusable NavLink Component
function NavLink({ href, children, onClick }: { href: string; children: string; onClick?: () => void }) {
  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Link href={href} className="text-gray-300 hover:text-white transition" onClick={onClick}>
        {children}
      </Link>
    </motion.div>
  );
}