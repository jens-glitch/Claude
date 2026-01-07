"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, MapPin, Home as HomeIcon } from "lucide-react";
import Link from "next/link";

// Dynamically import map component (client-side only)
const ApartmentMap = dynamic(
  () => import("@/components/map/apartment-map").then((mod) => mod.ApartmentMap),
  { ssr: false, loading: () => <div className="h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">Laddar karta...</div> }
);

interface Apartment {
  id: string;
  address: string;
  city: string;
  postalCode: string;
  rooms: number;
  rent: number;
  size: number | null;
  latitude: number;
  longitude: number;
  hasBalcony: boolean;
  hasElevator: boolean;
  hasFireplace: boolean;
  hasParking: boolean;
  hasDishwasher: boolean;
  hasWashingMachine: boolean;
  petsAllowed: boolean;
  description: string | null;
  user: {
    name: string | null;
    id: string;
  };
  images: Array<{
    url: string;
  }>;
}

export default function SearchPage() {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [filteredApartments, setFilteredApartments] = useState<Apartment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showMap, setShowMap] = useState(true);

  // Filter states
  const [filters, setFilters] = useState({
    city: "",
    minRooms: "",
    maxRooms: "",
    minRent: "",
    maxRent: "",
    hasBalcony: false,
    hasElevator: false,
    hasFireplace: false,
    hasParking: false,
    hasDishwasher: false,
    hasWashingMachine: false,
    petsAllowed: false,
  });

  useEffect(() => {
    fetchApartments();
  }, []);

  const fetchApartments = async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          queryParams.append(key, value.toString());
        }
      });

      const response = await fetch(`/api/apartments/search?${queryParams}`);
      if (response.ok) {
        const data = await response.json();
        setApartments(data);
        setFilteredApartments(data);
      }
    } catch (error) {
      console.error("Error fetching apartments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    fetchApartments();
  };

  const resetFilters = () => {
    setFilters({
      city: "",
      minRooms: "",
      maxRooms: "",
      minRent: "",
      maxRent: "",
      hasBalcony: false,
      hasElevator: false,
      hasFireplace: false,
      hasParking: false,
      hasDishwasher: false,
      hasWashingMachine: false,
      petsAllowed: false,
    });
    fetchApartments();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Sök lägenheter</h1>
          <p className="text-muted-foreground">
            Hitta din drömlägenhet att byta till
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Filters */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Filter</CardTitle>
                <CardDescription>Förfina din sökning</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="city">Stad</Label>
                  <Input
                    id="city"
                    value={filters.city}
                    onChange={(e) => handleFilterChange("city", e.target.value)}
                    placeholder="T.ex. Stockholm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="minRooms">Min rum</Label>
                    <Input
                      id="minRooms"
                      type="number"
                      min="1"
                      value={filters.minRooms}
                      onChange={(e) => handleFilterChange("minRooms", e.target.value)}
                      placeholder="1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxRooms">Max rum</Label>
                    <Input
                      id="maxRooms"
                      type="number"
                      min="1"
                      value={filters.maxRooms}
                      onChange={(e) => handleFilterChange("maxRooms", e.target.value)}
                      placeholder="5"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="minRent">Min hyra</Label>
                    <Input
                      id="minRent"
                      type="number"
                      min="0"
                      value={filters.minRent}
                      onChange={(e) => handleFilterChange("minRent", e.target.value)}
                      placeholder="5000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxRent">Max hyra</Label>
                    <Input
                      id="maxRent"
                      type="number"
                      min="0"
                      value={filters.maxRent}
                      onChange={(e) => handleFilterChange("maxRent", e.target.value)}
                      placeholder="15000"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Bekvämligheter</Label>
                  <div className="space-y-2">
                    <Checkbox
                      id="hasBalcony"
                      label="Balkong"
                      checked={filters.hasBalcony}
                      onChange={(e) => handleFilterChange("hasBalcony", e.target.checked)}
                    />
                    <Checkbox
                      id="hasElevator"
                      label="Hiss"
                      checked={filters.hasElevator}
                      onChange={(e) => handleFilterChange("hasElevator", e.target.checked)}
                    />
                    <Checkbox
                      id="hasParking"
                      label="Parkering"
                      checked={filters.hasParking}
                      onChange={(e) => handleFilterChange("hasParking", e.target.checked)}
                    />
                    <Checkbox
                      id="petsAllowed"
                      label="Husdjur"
                      checked={filters.petsAllowed}
                      onChange={(e) => handleFilterChange("petsAllowed", e.target.checked)}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Button onClick={applyFilters} className="w-full">
                    Sök
                  </Button>
                  <Button onClick={resetFilters} variant="outline" className="w-full">
                    Rensa filter
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-3 space-y-6">
            {/* Map/List Toggle */}
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                {apartments.length} lägenhet{apartments.length !== 1 ? "er" : ""} hittad{apartments.length !== 1 ? "e" : ""}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMap(!showMap)}
              >
                {showMap ? "Visa lista" : "Visa karta"}
              </Button>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <>
                {showMap ? (
                  <div className="h-[600px] rounded-lg overflow-hidden border">
                    <ApartmentMap apartments={filteredApartments} />
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {apartments.map((apartment) => (
                      <Link key={apartment.id} href={`/apartments/${apartment.id}`}>
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div>
                                <CardTitle className="text-lg">{apartment.address}</CardTitle>
                                <CardDescription>
                                  <MapPin className="h-3 w-3 inline mr-1" />
                                  {apartment.city}
                                </CardDescription>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold">{apartment.rent} kr/mån</p>
                                <p className="text-sm text-muted-foreground">
                                  {apartment.rooms} rum
                                  {apartment.size && ` • ${apartment.size} kvm`}
                                </p>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            {apartment.description && (
                              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                {apartment.description}
                              </p>
                            )}
                            <div className="flex flex-wrap gap-2">
                              {apartment.hasBalcony && (
                                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                                  Balkong
                                </span>
                              )}
                              {apartment.hasElevator && (
                                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                                  Hiss
                                </span>
                              )}
                              {apartment.hasParking && (
                                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                                  Parkering
                                </span>
                              )}
                              {apartment.petsAllowed && (
                                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                                  Husdjur OK
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-3">
                              Uthyrare: {apartment.user.name || "Okänd"}
                            </p>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}

                    {apartments.length === 0 && (
                      <div className="col-span-2 text-center py-12">
                        <HomeIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-lg font-semibold mb-2">Inga lägenheter hittades</p>
                        <p className="text-muted-foreground">
                          Prova att ändra dina filter eller sök i en annan stad
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
