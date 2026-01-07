import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Home, MessageSquare, Shield, MapPin, Heart } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold tracking-tight mb-6">
              Hitta din drömlägenhet genom byte
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Enkel, trygg och smidig plattform för att byta lägenhet med andra i hela Sverige
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="text-lg px-8">
                  Kom igång gratis
                </Button>
              </Link>
              <Link href="/search">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  Sök lägenheter
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Så fungerar det
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card>
              <CardHeader>
                <Home className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Lägg upp din lägenhet</CardTitle>
                <CardDescription>
                  Fyll i detaljer, ladda upp bilder och rita din planlösning interaktivt
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Search className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Sök och filtrera</CardTitle>
                <CardDescription>
                  Hitta lägenheter som passar dina önskemål med karta och smarta filter
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <MessageSquare className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Matcha och chatta</CardTitle>
                <CardDescription>
                  Markera intresse och chatta när båda parter är intresserade
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Varför välja LägenhetsByte?
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="flex gap-4">
              <Shield className="h-8 w-8 text-primary flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Tryggt och säkert</h3>
                <p className="text-muted-foreground">
                  Verifierade användare och säker kommunikation mellan medlemmar
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <MapPin className="h-8 w-8 text-primary flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Interaktiv planlösning</h3>
                <p className="text-muted-foreground">
                  Rita och visa din planlösning med rumskoppling för bilder
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <Heart className="h-8 w-8 text-primary flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Smarta matchningar</h3>
                <p className="text-muted-foreground">
                  Se vem som är intresserad av din lägenhet och hitta perfekta byten
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <Search className="h-8 w-8 text-primary flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Kraftfulla sökfilter</h3>
                <p className="text-muted-foreground">
                  Sök på karta, antal rum, hyra, balkong och mycket mer
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Redo att hitta din nästa lägenhet?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Gå med idag och börja din bytesresa
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Skapa konto nu
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
