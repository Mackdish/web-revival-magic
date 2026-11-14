/// <reference types="bun" />
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { articles } from "../content/site";
import { articleSchema, pageSchema, SITE_URL } from "./seo";

describe("primary website search identity", () => {
  test("page identity uses the owner’s mackdish.store domain", () => {
    expect(SITE_URL).toBe("https://mackdish.store");
    const schema = JSON.parse(pageSchema("/seo", "SEO services", "SEO for Kenya", "Service")[0]?.children ?? "{}");
    expect(schema["@graph"][0].url).toBe("https://mackdish.store/seo");
    expect(schema["@graph"][0].provider["@id"]).toBe("https://mackdish.store/#organization");
  });

  test("the sitemap lists only canonical mackdish.store URLs and every published article", () => {
    const xml = readFileSync("public/sitemap.xml", "utf8");
    const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
    expect(urls.length).toBe(23);
    expect(urls.every(url => url?.startsWith("https://mackdish.store/"))).toBe(true);
    for (const article of articles) expect(urls).toContain(`https://mackdish.store/insights/${article.slug}`);
    expect(urls).toContain("https://mackdish.store/solutions");
    expect(urls).toContain("https://mackdish.store/web-software-development");
    expect(new Set(urls).size).toBe(urls.length);
  });

  test("crawler discovery points to the primary domain sitemap", () => {
    const robots = readFileSync("public/robots.txt", "utf8");
    expect(robots.match(/^Sitemap: (.+)$/m)?.[1]).toBe("https://mackdish.store/sitemap.xml");
  });

  test("article identities and breadcrumbs reference the same public article", () => {
    const schema = JSON.parse(articleSchema({ slug: "local-seo-kenyan-businesses", title: "Local SEO", excerpt: "Local discovery" })[0]?.children ?? "{}");
    expect(schema["@graph"][0].mainEntityOfPage).toBe("https://mackdish.store/insights/local-seo-kenyan-businesses");
    expect(schema["@graph"][1].itemListElement[2].item).toBe(schema["@graph"][0].url);
  });
});