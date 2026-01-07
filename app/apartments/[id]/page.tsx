"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, MapPin, Home as HomeIcon, Loader2, ArrowLeft } from "lucide-react";

interface Apartment {
  id: string;
  address: string;
  city: string;
  postalCode: string;
  rooms: number;
  rent: number;
  size: number | null;
  hasBalcony: boolean;
  hasElevator: boolean;
  hasFireplace: boolean;
  hasParking: boolean;
  hasDishwasher: boolean;
  hasWashingMachine: boolean;
  petsAllowed: boolean;
  description: string | null;
  user: {
    id: string;
    name: string | null;
  };
}

export default function ApartmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [apartment, setApartment] = useState<Apartment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInterested, setIsInterested] = useState(false);
  const [isTogglingInterest, setIsTogglingInterest] = useState(false);

  useEffect(() => {
    fetchApartment();
  }, [params.id]);

  const fetchApartment = async () => {
    try {
      const response = await fetch(`/api/apartments/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setApartment(data);
      }
    } catch (error) {
      console.error("Error fetching apartment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleInterest = async () => {
    if (!session) {
      router.push("/login");
      return;
    }

    setIsTogglingInterest(true);
    try {
      const response = await fetch("/api/interests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ apartmentId: params.id }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsInterested(data.interested);
      }
    } catch (error) {
      console.error("Error toggling interest:", error);
    } finally {
      setIsTogglingInterest(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!apartment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <HomeIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-lg font-semibold mb-2">Lägenheten hittades inte</p>
          <Button onClick={() => router.push("/search")}>
            Tillbaka till sökning
          </Button>
        </div>
      </div>
    );
  }

  const isOwnApartment = session?.user?.id === apartment.user.id;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Tillbaka
        </Button>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl">{apartment.address}</CardTitle>
                    <CardDescription className="text-base">
                      <MapPin className="h-4 w-4 inline mr-1" />
                      {apartment.postalCode} {apartment.city}
                    </CardDescription>
                  </div>
                  {!isOwnApartment && (
                    <Button
                      variant={isInterested ? "default" : "outline"}
                      size="icon"
                      onClick={toggleInterest}
                      disabled={isTogglingInterest}
                    >
                      <Heart
                        className={`h-5 w-5 ${isInterested ? "fill-current" : ""}`}
                      />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {apartment.description && (
                  <div>
                    <h3 className="font-semibold mb-2">Beskrivning</h3>
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {apartment.description}
                    </p>
                  </div>
                )}

                <div>
                  <h3 className="font-semibold mb-3">Detaljer</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Antal rum</p>
                      <p className="font-medium">{apartment.rooms} rum</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Hyra</p>
                      <p className="font-medium">{apartment.rent} kr/mån</p>
                    </div>
                    {apartment.size && (
                      <div>
                        <p className="text-sm text-muted-foreground">Storlek</p>
                        <p className="font-medium">{apartment.size} kvm</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-muted-foreground">Uthyrare</p>
                      <p className="font-medium">{apartment.user.name || "Okänd"}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Bekvämligheter</h3>
                  <div className="flex flex-wrap gap-2">
                    {apartment.hasBalcony && (
                      <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                        Balkong
                      </span>
                    )}
                    {apartment.hasElevator && (
                      <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                        Hiss
                      </span>
                    )}
                    {apartment.hasFireplace && (
                      <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                        Eldstad
                      </span>
                    )}
                    {apartment.hasParking && (
                      <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                        Parkering
                      </span>
                    )}
                    {apartment.hasDishwasher && (
                      <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                        Diskmaskin
                      </span>
                    )}
                    {apartment.hasWashingMachine && (
                      <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                        Tvättmaskin
                      </span>
                    )}
                    {apartment.petsAllowed && (
                      <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                        Husdjur tillåtna
                      </span>
                    )}
                    {!apartment.hasBalcony &&
                      !apartment.hasElevator &&
                      !apartment.hasFireplace &&
                      !apartment.hasParking &&
                      !apartment.hasDishwasher &&
                      !apartment.hasWashingMachine &&
                      !apartment.petsAllowed && (
                        <span className="text-sm text-muted-foreground">
                          Inga bekvämligheter angivna
                        </span>
                      )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Kontakt</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isOwnApartment ? (
                  <p className="text-sm text-muted-foreground">
                    Detta är din lägenhet
                  </p>
                ) : (
                  <>
                    <p className="text-sm text-muted-foreground">
                      För att kontakta {apartment.user.name || "uthyraren"}, markera intresse först.
                      Om båda markerat intresse kan ni chatta!
                    </p>
                    <Button
                      className="w-full"
                      onClick={toggleInterest}
                      variant={isInterested ? "outline" : "default"}
                      disabled={isTogglingInterest}
                    >
                      {isTogglingInterest ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sparar...
                        </>
                      ) : isInterested ? (
                        <>
                          <Heart className="mr-2 h-4 w-4 fill-current" />
                          Intresserad
                        </>
                      ) : (
                        <>
                          <Heart className="mr-2 h-4 w-4" />
                          Markera intresse
                        </>
                      )}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
