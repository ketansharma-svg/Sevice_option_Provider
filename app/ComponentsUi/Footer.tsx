import React from "react";

export default function Footer() {
  return (
    <footer className="w-full bg-gray-800 text-gray-300 py-6 text-center">
      <p>© {new Date().getFullYear()} MyBrand. All rights reserved.</p>
    </footer>
  );
}
