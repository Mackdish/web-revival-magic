import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  useLocation,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { SiteHeader } from "@/components/marketing/header";
import { SiteFooter } from "@/components/marketing/footer";
import logoAsset from "@/assets/mackdish-logo.svg.asset.json";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Mackdish Solutions — Digital Growth & Technology Partner" },
      { name: "description", content: "Digital marketing, advertising, software and automation for businesses in Kenya." },
      { name: "author", content: "Mackdish Solutions" },
      { property: "og:site_name", content: "Mackdish Solutions" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: logoAsset.url, type: "image/svg+xml" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "@id": "https://mackdish.store/#organization",
              "name": "Mackdish Solutions",
              "url": "https://mackdish.store",
              "logo": "https://mackdish.store/mackdish-logo.svg",
              "email": "info@mackdish.store",
              "telephone": "+254705186502",
              "sameAs": [
                "https://facebook.com/mackdishsolutions",
                "https://www.linkedin.com/company/mackdish-solutions",
                "https://instagram.com/mackdishsolutions"
              ]
            },
            {
              "@type": "LocalBusiness",
              "@id": "https://mackdish.store/#localbusiness",
              "name": "Mackdish Solutions",
              "url": "https://mackdish.store",
              "telephone": "+254705186502",
              "email": "info@mackdish.store",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Nairobi",
                "addressCountry": "KE"
              },
              "parentOrganization": { "@id": "https://mackdish.store/#organization" }
            },
            {
              "@type": "Service",
              "@id": "https://mackdish.store/#digital-services",
              "name": "Digital marketing, advertising, web development, software development and automation",
              "provider": { "@id": "https://mackdish.store/#organization" },
              "areaServed": { "@type": "Country", "name": "Kenya" },
              "url": "https://mackdish.store/services"
            }
          ]
        }) }} />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const location = useLocation();
  const isPrivate = location.pathname.startsWith("/dashboard") || location.pathname.startsWith("/login") || location.pathname.startsWith("/signup");

  if (isPrivate) {
    return (
      <QueryClientProvider client={queryClient}>
        <Outlet />
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-background focus:p-3">Skip to content</a>
      <SiteHeader />
      <main id="main-content" className="pb-16 sm:pb-0"><Outlet /></main>
      <SiteFooter />
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 p-2 shadow-lg backdrop-blur sm:hidden">
        <div className="mx-auto grid max-w-lg grid-cols-2 gap-2">
          <a href="tel:+254705186502" className="inline-flex h-11 items-center justify-center rounded-md border bg-background px-3 text-sm font-semibold text-foreground">Call 0705 186 502</a>
          <a href="https://wa.me/254705186502?text=Hi%20Mackdish%2C%20I%27d%20like%20to%20discuss%20my%20business." target="_blank" rel="noreferrer" className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-3 text-sm font-semibold text-primary-foreground">WhatsApp us</a>
        </div>
      </div>
    </QueryClientProvider>
  );
}
