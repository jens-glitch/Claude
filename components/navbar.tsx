"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Home, Search, Plus, MessageSquare, User, LogOut } from "lucide-react";

export function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Home className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">LägenhetsByte</span>
          </Link>

          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <Link href="/search">
                  <Button variant="ghost" size="sm">
                    <Search className="h-4 w-4 mr-2" />
                    Sök lägenheter
                  </Button>
                </Link>
                <Link href="/my-apartment">
                  <Button variant="ghost" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Min lägenhet
                  </Button>
                </Link>
                <Link href="/messages">
                  <Button variant="ghost" size="sm">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Meddelanden
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    {session.user?.name || "Profil"}
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut()}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logga ut
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Logga in
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">
                    Kom igång
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
