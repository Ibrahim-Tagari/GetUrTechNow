"use client";

import type React from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Menu, User, LogOut, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { CartDrawer } from "@/components/cart-drawer";
import { useTheme } from "@/contexts/theme-context";

export function SiteHeader() {
  const { user, logout, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = () => {
    logout();
    router.push("/login");
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => pathname === path;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/logo.png"
              alt="GetUrTechNow Logo"
              width={350}
              height={200}
              className="h-12 w-auto"
              style={{ width: "auto" }}
            />
          </Link>

          {/* Search bar - hidden on mobile */}
          <form onSubmit={handleSearch} className="hidden flex-1 max-w-xl md:flex">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for products..."
                className="w-full pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* Theme toggle button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="hidden md:inline-flex"
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>

            {/* Desktop User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="hidden md:flex items-center gap-2 px-3"
                  >
                    <User className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {isAdmin && <span className="text-primary">Admin: </span>}
                      {user.name}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                      {isAdmin && (
                        <span className="text-xs font-semibold text-primary">
                          Admin Account
                        </span>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/orders">My Orders</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account">My Account</Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">Admin Dashboard</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-destructive focus:text-destructive cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="hidden md:inline-flex"
                asChild
              >
                <Link href="/login">
                  <User className="mr-2 h-4 w-4" />
                  Sign In
                </Link>
              </Button>
            )}

            {/* Cart Drawer */}
            <CartDrawer />

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
             <SheetContent className="w-[300px] sm:w-[400px] sm:max-w-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[side=right]:slide-in-from-right">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>

                <div className="flex flex-col gap-4 mt-8">
                  {/* Theme toggle in mobile menu */}
                  <div className="pb-4 border-b">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={toggleTheme}
                      className="w-full justify-start bg-transparent"
                    >
                      {theme === "light" ? (
                        <>
                          <Moon className="mr-2 h-4 w-4" />
                          Dark Mode
                        </>
                      ) : (
                        <>
                          <Sun className="mr-2 h-4 w-4" />
                          Light Mode
                        </>
                      )}
                    </Button>
                  </div>

                  {/* User menu in mobile */}
                  {user ? (
                    <div className="pb-4 border-b">
                      <div className="flex flex-col space-y-1 mb-4">
                        <p className="text-sm font-medium">
                          {isAdmin && <span className="text-primary">Admin: </span>}
                          {user.name}
                        </p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="justify-start bg-transparent"
                        >
                          <Link href="/orders" onClick={() => setMobileMenuOpen(false)}>
                            My Orders
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="justify-start bg-transparent"
                        >
                          <Link href="/account" onClick={() => setMobileMenuOpen(false)}>
                            My Account
                          </Link>
                        </Button>
                        {isAdmin && (
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="justify-start bg-transparent"
                          >
                            <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                              Admin Dashboard
                            </Link>
                          </Button>
                        )}
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={handleLogout}
                          className="justify-start"
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Logout
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="pb-4 border-b">
                      <Button
                        variant="default"
                        size="sm"
                        asChild
                        className="w-full"
                      >
                        <Link
                          href="/login"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <User className="mr-2 h-4 w-4" />
                          Sign In
                        </Link>
                      </Button>
                    </div>
                  )}

                  {/* Navigation Links */}
                  <nav className="flex flex-col gap-2">
                    {[
                      { path: "/", label: "Home" },
                      { path: "/laptops", label: "Laptops" },
                      { path: "/desktops", label: "Desktops" },
                      { path: "/smartphones", label: "Smartphones" },
                      { path: "/tablets", label: "Tablets" },
                      { path: "/accessories", label: "Accessories" },
                      { path: "/deals", label: "Special Deals" },
                      { path: "/contact", label: "Contact" },
                    ].map((link) => (
                      <Link
                        key={link.path}
                        href={link.path}
                        className={`text-lg font-medium py-2 transition-colors ${
                          isActive(link.path)
                            ? "text-primary"
                            : "hover:text-primary"
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex h-12 items-center gap-6 text-sm">
          {[
            { path: "/", label: "Home" },
            { path: "/laptops", label: "Laptops" },
            { path: "/desktops", label: "Desktops" },
            { path: "/smartphones", label: "Smartphones" },
            { path: "/tablets", label: "Tablets" },
            { path: "/accessories", label: "Accessories" },
            { path: "/deals", label: "Special Deals" },
            { path: "/contact", label: "Contact" },
          ].map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`font-medium transition-colors ${
                isActive(link.path) ? "text-primary" : "hover:text-primary"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
