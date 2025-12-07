import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { useAuth } from "@/providers/AuthProvider";
import { useTheme } from "@/utils/themeUtils";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();

  // Detect system theme
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";

  // Final theme value
  const currentTheme = theme === "system" ? systemTheme : theme;

  // Logo path
  const logoSrc =
    currentTheme === "dark"
      ? "/warung-white.svg"
      : "/warung-black.svg";
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-[var(--background)]/80 backdrop-blur-sm border-b border-[var(--border)]"
    >
      <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.a
            href="#hero"
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.img
              src={logoSrc}
              alt="Warung AI Logo"
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl"
              initial={{ rotate: -180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            />
            <span className="hidden md:inline font-semibold text-lg sm:text-xl text-[var(--foreground)]">
              WARUNG AI
            </span>
          </motion.a>

          {/* Desktop Navigation Menu */}
          <motion.div
            className="hidden md:block"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <NavigationMenu>
              <NavigationMenuList>
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      href="#demos"
                      className="text-[var(--foreground)]/70 hover:text-[var(--foreground)] transition-colors"
                    >
                      DEMOS
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.35 }}
                >
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      href="#docs"
                      className="text-[var(--foreground)]/70 hover:text-[var(--foreground)] transition-colors"
                    >
                      DOCS
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                </motion.div>

                {isAuthenticated && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                  >
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
                  </motion.div>
                )}
              </NavigationMenuList>
            </NavigationMenu>
          </motion.div>

          {/* Desktop Theme Toggle */}
          <motion.div
            className="hidden md:block"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <ThemeToggle />
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-[var(--foreground)]"
            aria-label="Toggle menu"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileTap={{ scale: 0.9 }}
          >
            <motion.svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              animate={{ rotate: isMenuOpen ? 90 : 0 }}
              transition={{ duration: 0.3 }}
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
            </motion.svg>
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="md:hidden mt-4 pb-4 space-y-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.a
                href="#demos"
                onClick={() => setIsMenuOpen(false)}
                className="block text-[var(--foreground)]/70 hover:text-[var(--foreground)] transition-colors py-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                DEMOS
              </motion.a>
              <motion.a
                href="#docs"
                onClick={() => setIsMenuOpen(false)}
                className="block text-[var(--foreground)]/70 hover:text-[var(--foreground)] transition-colors py-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.15 }}
              >
                DOCS
              </motion.a>
              {isAuthenticated && (
                <motion.a
                  href="/dashboard"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/dashboard");
                    setIsMenuOpen(false);
                  }}
                  className="block text-[var(--foreground)]/70 hover:text-[var(--foreground)] transition-colors py-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  DASHBOARD
                </motion.a>
              )}
              <motion.div
                className="pt-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.25 }}
              >
                <ThemeToggle />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
