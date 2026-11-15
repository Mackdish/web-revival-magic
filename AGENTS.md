<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep the migrated Mackdish marketing pages and CRM routes in TanStack Start; the source archive already uses this routing model, so preserving its paths avoids broken links.
- Use the generated Lovable Cloud client for CRM authentication and reads/writes, never the archived project URL; this keeps all customer data in the new project.
- Restrict CRM rows with membership-based database policies, and grant membership only after a verified identity import; public signup alone must never expose customer records. The original dashboard is admin-only, so keep that route admin-only.
- Store workspace display information in `public.profiles` separately from admin roles in `public.crm_members`; this prevents editable profile fields from granting access.
- Keep Open Graph types in leaf route heads, not the root; article previews must not inherit a website type.
- Treat audit form preparation and external WhatsApp sending as separate steps; a prepared message does not prove Mackdish received a request.
- Scope marketing theme overrides to `.marketing-site` so public-page redesigns do not change private CRM screens.
- Keep SEO schema helpers browser-safe and use the primary canonical origin for page identities; SSR and client navigation must emit consistent metadata.
- Maintain the static sitemap from all public route paths and built-in article slugs, without fabricated modification dates; this preserves the current deployment's static crawler-file support.
- Keep insight detail routes un-nested from the Insights listing via the trailing-underscore route convention; articles must render their own body and a single self-canonical rather than inherit the listing page.
- Keep scroll reveals in the shared marketing main wrapper as client-only progressive enhancement; preserve initial content visibility and disable reveals for reduced motion so public animations never affect CRM workflows.
- Exclude Bun test modules from the browser application's TypeScript program and run them with Bun separately; Bun's global fetch extensions otherwise conflict with generated Cloud clients.
