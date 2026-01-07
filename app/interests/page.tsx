"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Heart, MapPin, MessageSquare } from "lucide-react";

interface ApartmentInterest {
  id: string;
  apartment: {
    id: string;
    address: string;
    city: string;
    rooms: number;
    rent: number;
    size: number | null;
    user: {
      id: string;
      name: string | null;
    };
  };
}

interface UserInterest {
  id: string;
  user: {
    id: string;
    name: string | null;
  };
  apartment: {
    id: string;
    user: {
      id: string;
      name: string | null;
    };
  };
}

export default function InterestsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [myInterests, setMyInterests] = useState<ApartmentInterest[]>([]);
  const [interestedInMe, setInterestedInMe] = useState<UserInterest[]>([]);
  const [mutualMatches, setMutualMatches] = useState<ApartmentInterest[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchInterests();
    }
  }, [status, router]);

  const fetchInterests = async () => {
    try {
      const response = await fetch("/api/interests");
      if (response.ok) {
        const data = await response.json();
        setMyInterests(data.myInterests);
        setInterestedInMe(data.interestedInMyApartment);
        setMutualMatches(data.mutualMatches);
      }
    } catch (error) {
      console.error("Error fetching interests:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Intressen & Matchningar</h1>
          <p className="text-muted-foreground">
            Se dina intressen och vem som är intresserad av din lägenhet
          </p>
        </div>

        <div className="space-y-8">
          {/* Mutual Matches */}
          {mutualMatches.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Heart className="h-6 w-6 mr-2 text-red-500 fill-current" />
                Ömsesidiga matchningar ({mutualMatches.length})
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mutualMatches.map((interest) => (
                  <Card key={interest.id} className="border-primary">
                    <CardHeader>
                      <CardTitle className="text-lg">{interest.apartment.address}</CardTitle>
                      <CardDescription>
                        <MapPin className="h-3 w-3 inline mr-1" />
                        {interest.apartment.city}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 mb-4">
                        <p className="text-sm">
                          <span className="font-medium">{interest.apartment.rooms} rum</span> •{" "}
                          <span className="font-medium">{interest.apartment.rent} kr/mån</span>
                          {interest.apartment.size && (
                            <> • <span>{interest.apartment.size} kvm</span></>
                          )}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Uthyrare: {interest.apartment.user.name || "Okänd"}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/apartments/${interest.apartment.id}`} className="flex-1">
                          <Button variant="outline" className="w-full" size="sm">
                            Se lägenhet
                          </Button>
                        </Link>
                        <Link href={`/messages?user=${interest.apartment.user.id}`} className="flex-1">
                          <Button className="w-full" size="sm">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Chatta
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* My Interests */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              Lägenheter jag är intresserad av ({myInterests.length})
            </h2>
            {myInterests.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground mb-4">
                    Du har inte markerat intresse för några lägenheter ännu
                  </p>
                  <Link href="/search">
                    <Button>Sök lägenheter</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {myInterests.map((interest) => (
                  <Link key={interest.id} href={`/apartments/${interest.apartment.id}`}>
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                      <CardHeader>
                        <CardTitle className="text-lg">{interest.apartment.address}</CardTitle>
                        <CardDescription>
                          <MapPin className="h-3 w-3 inline mr-1" />
                          {interest.apartment.city}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">
                          <span className="font-medium">{interest.apartment.rooms} rum</span> •{" "}
                          <span className="font-medium">{interest.apartment.rent} kr/mån</span>
                          {interest.apartment.size && (
                            <> • <span>{interest.apartment.size} kvm</span></>
                          )}
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                          Uthyrare: {interest.apartment.user.name || "Okänd"}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Interested in My Apartment */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              Intresserade av min lägenhet ({interestedInMe.length})
            </h2>
            {interestedInMe.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">
                    Ingen har visat intresse för din lägenhet ännu
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {interestedInMe.map((interest) => (
                  <Card key={interest.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{interest.user.name || "Okänd användare"}</CardTitle>
                      <CardDescription>
                        Visar intresse för din lägenhet
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Link href="/my-apartment">
                        <Button variant="outline" className="w-full" size="sm">
                          Se min lägenhet
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
