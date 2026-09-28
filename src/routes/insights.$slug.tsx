import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/marketing/layout";
import { articles } from "@/content/site";

export const Route = createFileRoute("/insights/$slug")({
  loader: ({ params }) => {
    const article = articles.find((item) => item.slug === params.slug);
    if (!article) throw new Error("Article not found");
    return { article };
  },
  head: ({ loaderData }) => loaderData ? ({ meta: [
    { title: loaderData.article.title + ", Mackdish Solutions" },
    { name: "description", content: loaderData.article.excerpt },
    { property: "og:title", content: loaderData.article.title },
    { property: "og:description", content: loaderData.article.excerpt },
    { property: "og:type", content: "article" },
    { property: "og:url", content: "https://mackdish.store/insights/" + loaderData.article.slug },
  ], links: [{ rel: "canonical", href: "https://mackdish.store/insights/" + loaderData.article.slug }] }) : ({}),
  component: Page,
});

function Page() {
  const { article } = Route.useLoaderData();
  return <article className="py-20 sm:py-28"><Container className="max-w-3xl"><Link to="/insights" className="inline-flex items-center gap-2 text-sm font-semibold text-primary"><ArrowLeft className="size-4"/>Back to insights</Link><p className="mt-12 text-xs font-bold uppercase text-primary">{article.category} · {article.readTime}</p><h1 className="mt-5 font-display text-4xl font-semibold leading-tight sm:text-6xl">{article.title}</h1><p className="mt-6 text-xl leading-8 text-muted-foreground">{article.excerpt}</p><div className="prose prose-neutral mt-12 max-w-none"><p>{article.excerpt}</p><h2>Start with the customer journey</h2><p>Map how a prospective customer discovers the business, what information they need, which action you want them to take, and how you will follow up. The right channel mix depends on the commercial objective, audience and available evidence.</p><h2>Connect the channels</h2><p>Search, social media, landing pages, WhatsApp and advertising work better when each has a clear role. Avoid treating every channel as a separate content calendar without a shared goal.</p><h2>Measure useful signals</h2><p>Track meaningful outcomes such as enquiries, qualified leads and conversions rather than relying only on impressions or follower counts.</p><div className="mt-12 border-t pt-8"><p className="text-sm text-muted-foreground">Need help applying this to your business?</p><Link to="/digital-audit" className="mt-3 inline-flex text-sm font-semibold text-primary">Request a free digital audit</Link></div></div></Container></article>;
}
