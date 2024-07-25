import React, { useState, useEffect } from "react";
import {
  useUser,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  ClerkLoading,
} from "@clerk/clerk-react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Drawer from "./Drawer";
import logo from "../assets/logo.svg";
import { Link } from "react-router-dom";
import NavLink from "./NavLink";
import Spinner from "./Spinner";
import { useLoading } from "../contexts/LoadingContext";
import { useDashboard } from "../contexts/DashboardContext";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Postings", href: "/jobs" },
  { name: "features", href: "/features" },
];
const postDetails = async (clerk_id, name, email, setIsLoading) => {
  try {
    setIsLoading(true);
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/user/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          clerk_id,
          email,
        }),
      }
    );
    const data = await response.json();
    if (data?.message === "ok") {
      localStorage.setItem("token", data?.token);
      return true;
    } else {
      throw new Error(data.message);
    }
  } catch (e) {
    console.log(e);
    return false;
  } finally {
    setIsLoading(false);
  }
};

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isSignedIn, isLoaded } = useUser();
  const { setIsLoading } = useLoading();
  const { fetchDashboardData } = useDashboard();

  React.useEffect(() => {
    const handleAuth = async () => {
      if (isSignedIn) {
        const token = localStorage.getItem("token");
        if (!token) {
          const clerk_id = user?.id;
          const name = user?.firstName;
          const email = user?.emailAddresses[0].emailAddress;
          const success = await postDetails(
            clerk_id,
            name,
            email,
            setIsLoading
          );
          if (success) {
            fetchDashboardData();
          }
        } else {
          fetchDashboardData();
        }
      } else {
        localStorage.removeItem("token");
      }
    };

    if (isLoaded) {
      handleAuth();
    }
  }, [isSignedIn, isLoaded, user]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center">
                <img className="h-8 w-auto" src={logo} alt="Your Company" />
                <span className="ml-2 text-xl font-bold text-gray-800">
                  ATF
                </span>
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navigation.map((item) => (
                  <NavLink key={item.name} to={item.href}>
                    {item.name}
                  </NavLink>
                ))}
              </div>
            </div>
            <div className="hidden md:block">
              <SignedOut>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <SignInButton />
                </button>
              </SignedOut>
              <ClerkLoading>
                <Spinner size={25} thickness={3} />
              </ClerkLoading>

              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              >
                <span className="sr-only">Open main menu</span>
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </div>
        </nav>
        <Drawer
          isOpen={mobileMenuOpen}
          setIsOpen={setMobileMenuOpen}
          navigation={navigation}
        />
      </header>
    </>
  );
}
