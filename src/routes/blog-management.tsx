import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { FileText, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { Container, PageHero } from "@/components/marketing/layout";
import { articles as defaultArticles } from "@/content/site";

type ManagedArticle = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  readTime: string;
  content: string;
};

const STORAGE_KEY = "mackdish_blog_articles";

const initialArticles: ManagedArticle[] = defaultArticles.map((article) => ({
  ...article,
  content: article.excerpt,
}));

export const Route = createFileRoute("/blog-management")({
  component: BlogManagementPage,
});

function BlogManagementPage() {
  const [articles, setArticles] = useState<ManagedArticle[]>(initialArticles);
  const [editing, setEditing] = useState<ManagedArticle | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setArticles(parsed);
      }
    } catch {
      // Keep the built-in articles if local storage is unavailable.
    } finally {
      setLoaded(true);
    }
  }, []);

  const saveArticles = (next: ManagedArticle[]) => {
    setArticles(next);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const deleteArticle = (slug: string) => {
    if (!window.confirm("Delete this article from this browser?")) return;
    saveArticles(articles.filter((article) => article.slug !== slug));
    if (editing?.slug === slug) setEditing(null);
  };

  const createArticle = () => {
    setEditing({
      slug: "",
      category: "Business Growth",
      title: "",
      excerpt: "",
      readTime: "5 min read",
      content: "",
    });
  };

  const saveArticle = () => {
    if (!editing?.title.trim()) return;
    const slug =
      editing.slug.trim() ||
      editing.title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    const article = { ...editing, slug };
    const exists = articles.some((item) => item.slug === slug);
    const next = exists
      ? articles.map((item) => (item.slug === slug ? article : item))
      : [article, ...articles];

    saveArticles(next);
    setEditing(null);
  };

  const countLabel = useMemo(
    () => `${articles.length} ${articles.length === 1 ? "article" : "articles"}`,
    [articles.length],
  );

  if (!loaded) {
    return (
      <main className="py-20">
        <Container>
          <p className="text-sm text-muted-foreground">Loading blog management...</p>
        </Container>
      </main>
    );
  }

  return (
    <>
      <PageHero
        eyebrow="Blog management"
        title="Manage your Mackdish insights."
        description="Create, edit and remove articles from this browser without a database or migration."
      />

      <section className="py-16 sm:py-24">
        <Container>
          <div className="mb-8 flex flex-col gap-4 border-b pb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-primary">{countLabel}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Changes are saved locally in this browser.
              </p>
            </div>
            <button
              type="button"
              onClick={createArticle}
              className="inline-flex items-center justify-center gap-2 bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
            >
              <Plus className="size-4" /> New article
            </button>
          </div>

          <div className="grid gap-4">
            {articles.map((article) => (
              <article
                key={article.slug}
                className="flex flex-col gap-5 border p-6 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase text-primary">
                    <FileText className="size-4" />
                    {article.category}
                  </div>
                  <h2 className="mt-2 font-display text-xl font-semibold">{article.title}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">{article.excerpt}</p>
                  <p className="mt-3 text-xs text-muted-foreground">{article.readTime} · /insights/{article.slug}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => setEditing(article)}
                    className="inline-flex items-center gap-2 border px-4 py-2 text-sm font-semibold"
                  >
                    <Pencil className="size-4" /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteArticle(article.slug)}
                    className="inline-flex items-center gap-2 border px-4 py-2 text-sm font-semibold text-destructive"
                    aria-label={`Delete ${article.title}`}
                  >
                    <Trash2 className="size-4" /> Delete
                  </button>
                </div>
              </article>
            ))}
          </div>

          {editing && (
            <div className="fixed inset-0 z-50 overflow-y-auto bg-background/95 p-4 sm:p-8">
              <div className="mx-auto max-w-3xl border bg-background p-6 shadow-xl sm:p-8">
                <div className="mb-8 flex items-center justify-between border-b pb-5">
                  <div>
                    <p className="text-xs font-bold uppercase text-primary">Article editor</p>
                    <h2 className="mt-1 font-display text-2xl font-semibold">
                      {editing.title ? "Edit article" : "New article"}
                    </h2>
                  </div>
                  <button type="button" onClick={() => setEditing(null)} aria-label="Close editor">
                    <X className="size-5" />
                  </button>
                </div>

                <div className="grid gap-5">
                  <label className="grid gap-2 text-sm font-semibold">
                    Title
                    <input
                      value={editing.title}
                      onChange={(event) => setEditing({ ...editing, title: event.target.value })}
                      className="border px-4 py-3 font-normal outline-none focus:border-primary"
                      placeholder="Article title"
                    />
                  </label>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <label className="grid gap-2 text-sm font-semibold">
                      Category
                      <input
                        value={editing.category}
                        onChange={(event) => setEditing({ ...editing, category: event.target.value })}
                        className="border px-4 py-3 font-normal outline-none focus:border-primary"
                        placeholder="SEO"
                      />
                    </label>
                    <label className="grid gap-2 text-sm font-semibold">
                      Reading time
                      <input
                        value={editing.readTime}
                        onChange={(event) => setEditing({ ...editing, readTime: event.target.value })}
                        className="border px-4 py-3 font-normal outline-none focus:border-primary"
                        placeholder="5 min read"
                      />
                    </label>
                  </div>

                  <label className="grid gap-2 text-sm font-semibold">
                    Excerpt
                    <textarea
                      value={editing.excerpt}
                      onChange={(event) => setEditing({ ...editing, excerpt: event.target.value })}
                      className="min-h-28 border px-4 py-3 font-normal outline-none focus:border-primary"
                      placeholder="Short description shown on the insights page."
                    />
                  </label>

                  <label className="grid gap-2 text-sm font-semibold">
                    Article content
                    <textarea
                      value={editing.content}
                      onChange={(event) => setEditing({ ...editing, content: event.target.value })}
                      className="min-h-72 border px-4 py-3 font-normal outline-none focus:border-primary"
                      placeholder="Write the article content here."
                    />
                  </label>

                  <div className="flex flex-col gap-3 border-t pt-5 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={() => setEditing(null)}
                      className="border px-5 py-3 text-sm font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={saveArticle}
                      className="inline-flex items-center justify-center gap-2 bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
                    >
                      <Save className="size-4" /> Save article
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
