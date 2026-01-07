"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Search, MessageSquare, Heart } from "lucide-react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Laddar...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Välkommen, {session.user?.name || "Användare"}!
          </h1>
          <p className="text-muted-foreground">
            Hantera din lägenhet och hitta byten
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link href="/my-apartment">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <Home className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Min lägenhet</CardTitle>
                <CardDescription>
                  Lägg upp eller redigera din lägenhet
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/search">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <Search className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Sök lägenheter</CardTitle>
                <CardDescription>
                  Hitta lägenheter att byta till
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/interests">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <Heart className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Mina intressen</CardTitle>
                <CardDescription>
                  Se dina matchningar och intressen
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/messages">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <MessageSquare className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Meddelanden</CardTitle>
                <CardDescription>
                  Chatta med potentiella byten
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Kom igång</CardTitle>
            <CardDescription>
              Följ dessa steg för att börja byta lägenhet
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Lägg upp din lägenhet</h3>
                  <p className="text-sm text-muted-foreground">
                    Fyll i detaljer om din lägenhet, ladda upp bilder och rita planlösningen
                  </p>
                  <Link href="/my-apartment">
                    <Button variant="link" className="px-0">
                      Börja här →
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Sök efter lägenheter</h3>
                  <p className="text-sm text-muted-foreground">
                    Använd kartan och filter för att hitta lägenheter som passar dig
                  </p>
                  <Link href="/search">
                    <Button variant="link" className="px-0">
                      Sök nu →
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Markera intresse</h3>
                  <p className="text-sm text-muted-foreground">
                    Klicka på hjärtat för lägenheter du är intresserad av. När båda markerat intresse kan ni chatta!
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
