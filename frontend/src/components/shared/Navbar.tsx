import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { ThemeToggle } from "./ThemeToggle";
import { useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--background)]/80 backdrop-blur-sm border-b border-[var(--border)]">
      <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#hero" className="flex items-center gap-2">
            <img
              src="src/assets/icon.svg"
              alt="Warung AI Logo"
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl"
            />
            <span className="hidden md:inline font-semibold text-lg sm:text-xl text-[var(--foreground)]">
              WARUNG AI
            </span>
          </a>

          {/* Desktop Navigation Menu */}
          <div className="hidden md:block">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    href="#demos"
                    className="text-[var(--foreground)]/70 hover:text-[var(--foreground)] transition-colors"
                  >
                    DEMOS
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink
                    href="#docs"
                    className="text-[var(--foreground)]/70 hover:text-[var(--foreground)] transition-colors"
                  >
                    DOCS
                  </NavigationMenuLink>
                </NavigationMenuItem>

                {isAuthenticated && (
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      href="/dashboard"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate("/dashboard");
                      }}
                      className="text-[var(--foreground)]/70 hover:text-[var(--foreground)] transition-colors"
                    >
                      DASHBOARD
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                )}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Desktop Theme Toggle */}
          <div className="hidden md:block">
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-[var(--foreground)]"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4">
            <a
              href="#demos"
              onClick={() => setIsMenuOpen(false)}
              className="block text-[var(--foreground)]/70 hover:text-[var(--foreground)] transition-colors py-2"
            >
              DEMOS
            </a>
            <a
              href="#docs"
              onClick={() => setIsMenuOpen(false)}
              className="block text-[var(--foreground)]/70 hover:text-[var(--foreground)] transition-colors py-2"
            >
              DOCS
            </a>
            {isAuthenticated && (
              <a
                href="/dashboard"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/dashboard");
                  setIsMenuOpen(false);
                }}
                className="block text-[var(--foreground)]/70 hover:text-[var(--foreground)] transition-colors py-2"
              >
                DASHBOARD
              </a>
            )}
            <div className="pt-2"></div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
