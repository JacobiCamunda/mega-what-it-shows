// The problems a merged ticket really holds. causes.ts files a report by its tenant; that is right
// for a flipped month, but it also files reports that show no flip at all. The desk read those as a
// one-day move (desk-notes.json): a different bug, so a different problem. Like the desk's own view
// (CauseTable), a one-day report stays counted where it is filed, and is counted again under one-day.
import { causeOf, uniqueById, type Report, type Tenant } from '#lib/kb/causes';

export type Problem = 'parser' | 'hint' | 'one-day' | 'unplaced';

export type ProblemGroup = {
  problem: Problem;
  reports: Report[];
  tenants: string[];
  channels: Record<string, number>;
  firstSeen: string;
  lastSeen: string;
};

function group(problem: Problem, rs: Report[]): ProblemGroup {
  const days = rs.map((r) => r.receivedAt.slice(0, 10)).sort();
  return {
    problem,
    reports: rs,
    tenants: [...new Set(rs.map((r) => r.tenant))].sort(),
    channels: rs.reduce<Record<string, number>>((n, r) => ({ ...n, [r.channel]: (n[r.channel] ?? 0) + 1 }), {}),
    firstSeen: days[0],
    lastSeen: days[days.length - 1],
  };
}

export function splitTicket(
  all: Report[],
  ticket: number,
  tenantOf: (r: Report) => Tenant | undefined,
  oneDayMove: readonly string[],
): { merged: Report[]; groups: ProblemGroup[]; oneDayFiledAs: Problem[] } {
  const merged = uniqueById(all).filter((r) => r.mergedInto === ticket);
  const byCause = new Map<Problem, Report[]>();
  for (const r of merged) {
    const p = causeOf(r, tenantOf(r)) ?? 'unplaced';
    byCause.set(p, [...(byCause.get(p) ?? []), r]);
  }
  const oneDay = merged.filter((r) => oneDayMove.includes(r.id));
  const groups = [...byCause.entries()].map(([p, rs]) => group(p, rs)).sort((a, b) => b.reports.length - a.reports.length);
  if (oneDay.length) groups.push(group('one-day', oneDay));
  const oneDayFiledAs = [...new Set(oneDay.map((r) => causeOf(r, tenantOf(r)) ?? 'unplaced'))];
  return { merged, groups, oneDayFiledAs };
}
