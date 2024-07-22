import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { Link } from "react-router-dom";

export default function Drawer({ isOpen, setIsOpen, navigation }) {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ease-in-out"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-64 bg-white shadow-lg transform ease-in-out transition-all duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-semibold text-gray-800">Menu</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <nav className="flex-grow py-6 px-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-white hover:bg-indigo-600 transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t">
            <SignedOut>
              <button className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200">
                <SignInButton />
              </button>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </div>
    </>
  );
}
