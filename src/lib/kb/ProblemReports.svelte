<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import { splitTicket, type Problem } from '#lib/kb/problems';
  import { tenantOf } from '#lib/kb/locales';
  import type { Report } from '#lib/kb/causes';

  // Every report of one problem, as the reporter wrote it.
  let { ticket, problem }: { ticket: number; problem: Problem } = $props();

  const rows = $derived(
    splitTicket(reports as Report[], ticket, tenantOf, notes.oneDayMove).groups.find((g) => g.problem === problem)
      ?.reports ?? [],
  );
</script>

<table>
  <thead><tr><th>report</th><th>tenant</th><th>channel</th><th>what they wrote</th></tr></thead>
  <tbody>
    {#each rows as r (r.id)}
      <tr><td><code>{r.id}</code></td><td>{r.tenant}</td><td>{r.channel}</td><td>{r.body}</td></tr>
    {/each}
  </tbody>
</table>
