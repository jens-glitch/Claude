"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const apartmentSchema = z.object({
  address: z.string().min(1, "Adress krävs"),
  city: z.string().min(1, "Stad krävs"),
  postalCode: z.string().min(5, "Giltigt postnummer krävs"),
  rooms: z.string().min(1, "Antal rum krävs"),
  rent: z.string().min(1, "Hyra krävs"),
  size: z.string().optional(),
  description: z.string().optional(),
  hasBalcony: z.boolean().optional(),
  hasElevator: z.boolean().optional(),
  hasFireplace: z.boolean().optional(),
  hasParking: z.boolean().optional(),
  hasDishwasher: z.boolean().optional(),
  hasWashingMachine: z.boolean().optional(),
  petsAllowed: z.boolean().optional(),
});

type ApartmentFormData = z.infer<typeof apartmentSchema>;

export default function MyApartmentPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ApartmentFormData>({
    resolver: zodResolver(apartmentSchema),
    defaultValues: {
      hasBalcony: false,
      hasElevator: false,
      hasFireplace: false,
      hasParking: false,
      hasDishwasher: false,
      hasWashingMachine: false,
      petsAllowed: false,
    },
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchApartment();
    }
  }, [session]);

  const fetchApartment = async () => {
    try {
      const response = await fetch("/api/apartments");
      if (response.ok) {
        const data = await response.json();
        if (data) {
          reset({
            address: data.address,
            city: data.city,
            postalCode: data.postalCode,
            rooms: data.rooms.toString(),
            rent: data.rent.toString(),
            size: data.size?.toString() || "",
            description: data.description || "",
            hasBalcony: data.hasBalcony,
            hasElevator: data.hasElevator,
            hasFireplace: data.hasFireplace,
            hasParking: data.hasParking,
            hasDishwasher: data.hasDishwasher,
            hasWashingMachine: data.hasWashingMachine,
            petsAllowed: data.petsAllowed,
          });
        }
      }
    } catch (error) {
      console.error("Error fetching apartment:", error);
    } finally {
      setIsFetching(false);
    }
  };

  const onSubmit = async (data: ApartmentFormData) => {
    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("/api/apartments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Något gick fel");
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (error) {
      setError("Något gick fel vid sparande");
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading" || isFetching) {
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Min lägenhet</CardTitle>
            <CardDescription>
              Fyll i detaljer om din lägenhet för att hitta byten
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-50 text-green-700 text-sm p-3 rounded-md">
                  Lägenheten har sparats! Omdirigerar...
                </div>
              )}

              {/* Address Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Adress</h3>

                <div>
                  <Label htmlFor="address">Gatuadress *</Label>
                  <Input
                    id="address"
                    {...register("address")}
                    placeholder="Exempelgatan 123"
                  />
                  {errors.address && (
                    <p className="text-sm text-destructive mt-1">{errors.address.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="postalCode">Postnummer *</Label>
                    <Input
                      id="postalCode"
                      {...register("postalCode")}
                      placeholder="123 45"
                    />
                    {errors.postalCode && (
                      <p className="text-sm text-destructive mt-1">{errors.postalCode.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="city">Stad *</Label>
                    <Input
                      id="city"
                      {...register("city")}
                      placeholder="Stockholm"
                    />
                    {errors.city && (
                      <p className="text-sm text-destructive mt-1">{errors.city.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Details Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Detaljer</h3>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="rooms">Antal rum *</Label>
                    <Input
                      id="rooms"
                      type="number"
                      min="1"
                      {...register("rooms")}
                      placeholder="3"
                    />
                    {errors.rooms && (
                      <p className="text-sm text-destructive mt-1">{errors.rooms.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="rent">Hyra (kr/mån) *</Label>
                    <Input
                      id="rent"
                      type="number"
                      min="0"
                      {...register("rent")}
                      placeholder="8000"
                    />
                    {errors.rent && (
                      <p className="text-sm text-destructive mt-1">{errors.rent.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="size">Storlek (kvm)</Label>
                    <Input
                      id="size"
                      type="number"
                      min="0"
                      step="0.1"
                      {...register("size")}
                      placeholder="75"
                    />
                  </div>
                </div>
              </div>

              {/* Amenities Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Bekvämligheter</h3>

                <div className="grid grid-cols-2 gap-4">
                  <Checkbox
                    id="hasBalcony"
                    label="Balkong"
                    {...register("hasBalcony")}
                  />
                  <Checkbox
                    id="hasElevator"
                    label="Hiss"
                    {...register("hasElevator")}
                  />
                  <Checkbox
                    id="hasFireplace"
                    label="Eldstad"
                    {...register("hasFireplace")}
                  />
                  <Checkbox
                    id="hasParking"
                    label="Parkering"
                    {...register("hasParking")}
                  />
                  <Checkbox
                    id="hasDishwasher"
                    label="Diskmaskin"
                    {...register("hasDishwasher")}
                  />
                  <Checkbox
                    id="hasWashingMachine"
                    label="Tvättmaskin"
                    {...register("hasWashingMachine")}
                  />
                  <Checkbox
                    id="petsAllowed"
                    label="Husdjur tillåtna"
                    {...register("petsAllowed")}
                  />
                </div>
              </div>

              {/* Description Section */}
              <div>
                <Label htmlFor="description">Beskrivning</Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  placeholder="Beskriv din lägenhet, området, närhet till kommunikationer, etc..."
                  rows={5}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Skriv gärna om vad som gör din lägenhet speciell
                </p>
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sparar...
                    </>
                  ) : (
                    "Spara lägenhet"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/dashboard")}
                >
                  Avbryt
                </Button>
              </div>

              <p className="text-sm text-muted-foreground">
                Efter att du sparat kan du lägga till bilder och rita planlösning
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
