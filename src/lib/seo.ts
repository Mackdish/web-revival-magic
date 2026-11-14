export const SITE_URL = "https://mackdish.store";

export function pageSchema(path: string, name: string, description: string, type = "WebPage") {
  const url = `${SITE_URL}${path}`;
  return [{
    type: "application/ld+json",
    children: JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        { "@type": type, "@id": `${url}#page`, url, name, description,
          isPartOf: { "@id": `${SITE_URL}/#website` },
          ...(type === "Service" ? { provider: { "@id": `${SITE_URL}/#organization` }, areaServed: { "@type": "Country", name: "Kenya" } } : {}),
        },
        ...(path === "/" ? [] : [{ "@type": "BreadcrumbList", itemListElement: [
          { "@type": "ListItem", position: 1, name: "Mackdish Solutions", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name, item: url },
        ] }]),
      ],
    }),
  }];
}

export function articleSchema(article: { slug: string; title: string; excerpt: string }) {
  const url = `${SITE_URL}/insights/${article.slug}`;
  return [{ type: "application/ld+json", children: JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Article", headline: article.title, description: article.excerpt, url,
        mainEntityOfPage: url, author: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: "Mackdish Solutions" },
        publisher: { "@id": `${SITE_URL}/#organization` }, inLanguage: "en-KE" },
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Mackdish Solutions", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Insights", item: `${SITE_URL}/insights` },
        { "@type": "ListItem", position: 3, name: article.title, item: url },
      ] },
    ],
  }) }];
}