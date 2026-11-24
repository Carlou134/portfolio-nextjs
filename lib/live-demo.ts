// Live deploys can expire (e.g. student cloud credits). A demo with a
// liveUntil date stays visible through that day, then hides itself, so the
// portfolio never ships a dead button. Dates are ISO YYYY-MM-DD, which
// compare correctly as strings.
export function isLiveDemo(
  demo: { href: string; liveUntil?: string } | undefined,
  today: string,
): boolean {
  if (!demo) return false;
  return !demo.liveUntil || today <= demo.liveUntil;
}
