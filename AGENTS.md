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
