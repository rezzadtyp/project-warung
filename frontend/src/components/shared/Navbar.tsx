import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { ThemeToggle } from "./ThemeToggle";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--background)]/80 backdrop-blur-sm border-b border-[var(--border)]">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#hero" className="flex items-center gap-2">
            <img
              src="src/assets/icon.svg"
              alt="Warung AI Logo"
              className="w-10 h-10 rounded-xl"
            />
            <span className="font-semibold text-xl text-[var(--foreground)]">
              WARUNG AI
            </span>
          </a>

          {/* Navigation Menu */}
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
            </NavigationMenuList>
          </NavigationMenu>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
