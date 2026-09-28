import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Container, PageHero, SectionHeading } from "@/components/marketing/layout";
import { articles } from "@/content/site";

export const Route = createFileRoute("/insights")({
  head: () => ({ meta: [
    { title: "Insights, Digital Marketing, SEO, Advertising & Technology | Mackdish" }, { name: "description", content: "Practical insights for Kenyan businesses on digital marketing, SEO, advertising, TradeMall and business technology." }, { property: "og:title", content: "Insights, Digital Marketing, SEO, Advertising & Technology | Mackdish" }, { property: "og:description", content: "Practical insights for Kenyan businesses on digital marketing, SEO, advertising, TradeMall and business technology." }, { property: "og:type", content: "website" }, { property: "og:url", content: "https://mackdish.store/insights" },
  ], links: [{ rel: "canonical", href: "https://mackdish.store/insights" }] }),
  component: Page,
});

function Page() {
  return <>
    <PageHero eyebrow="Insights" title="Practical ideas for growing in a digital market." description="Guides for Kenyan businesses covering digital marketing, advertising, SEO, WhatsApp, TradeMall and business technology." />
    <section className="py-20 sm:py-28"><Container><SectionHeading eyebrow="Latest insights" title="Useful before promotional." /><div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{articles.map((article)=><article key={article.slug} className="flex min-h-80 flex-col border p-7 sm:p-8"><p className="text-xs font-bold uppercase text-primary">{article.category}</p><h2 className="mt-4 font-display text-2xl font-semibold leading-tight">{article.title}</h2><p className="mt-4 text-sm leading-7 text-muted-foreground">{article.excerpt}</p><div className="mt-auto flex items-center justify-between pt-8"><span className="text-xs text-muted-foreground">{article.readTime}</span><Link to="/insights/$slug" params={{slug:article.slug}} className="inline-flex items-center gap-2 text-sm font-semibold text-primary">Read article<ArrowRight className="size-4"/></Link></div></article>)}</div></Container></section>
  </>;
}
