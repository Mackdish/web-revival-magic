import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { Brand } from "./brand";
import { navigation } from "@/content/site";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 lg:px-8">
        <Brand />
        <nav className="hidden items-center gap-6 xl:flex" aria-label="Primary navigation">
          {navigation.map((item) => <Link key={item.to} to={item.to} activeProps={{ className: "text-primary" }} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">{item.label}</Link>)}
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild className="hidden h-10 sm:inline-flex"><Link to="/digital-audit">Get a Free Digital Audit</Link></Button>
          <Sheet>
            <SheetTrigger asChild><Button variant="outline" size="icon" className="xl:hidden" aria-label="Open navigation"><Menu /></Button></SheetTrigger>
            <SheetContent className="w-[min(88vw,24rem)]">
              <SheetHeader><SheetTitle><Brand /></SheetTitle></SheetHeader>
              <nav className="mt-10 grid gap-1" aria-label="Mobile navigation">
                {navigation.map((item) => <SheetClose asChild key={item.to}><Link to={item.to} className="border-b py-4 text-lg font-semibold">{item.label}</Link></SheetClose>)}
              </nav>
              <SheetClose asChild><Button asChild size="lg" className="mt-8 w-full"><Link to="/digital-audit">Get a Free Digital Audit</Link></Button></SheetClose>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
