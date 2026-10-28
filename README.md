# mega-what-it-shows

MEGA.dev S01E03 'what it shows': tickets for the problems in #4471, and the kb page about them.

- The kb export (support desk) is in `src/`, its README in `KB-README.md`.
- The new page: [`src/routes/kb/incidents/4471/split/+page.svx`](src/routes/kb/incidents/4471/split/+page.svx),
  computed by `src/lib/kb/problems.ts`, `ProblemTable.svelte` and `ProblemReports.svelte`.
- The page as the desk sees it: [`rendered/kb-incidents-4471-split.html`](rendered/kb-incidents-4471-split.html)
  (built with `npm install && npm run build`, output in `build/kb/incidents/4471/split/`).
- One ticket per problem: the issues of this repo.
