// Section divider built from the convergence motif: three strokes from each
// side resolving into one node. Purely decorative, so it's hidden from
// assistive tech; colors come from the .converge classes in globals.css.
export default function ConvergeDivider() {
  return (
    <div
      aria-hidden="true"
      data-testid="converge-divider"
      className="max-w-6xl mx-auto px-6 pt-11 pb-2 flex justify-center"
    >
      <svg viewBox="0 0 560 60" className="converge max-w-[560px]">
        <path className="ln" d="M4 8 C 180 8, 236 30, 280 30" />
        <path className="ln ln-soft" d="M4 30 L 280 30" />
        <path className="ln" d="M4 52 C 180 52, 236 30, 280 30" />
        <path className="ln" d="M556 8 C 380 8, 324 30, 280 30" />
        <path className="ln ln-soft" d="M556 30 L 280 30" />
        <path className="ln" d="M556 52 C 380 52, 324 30, 280 30" />
        <circle className="halo" cx="280" cy="30" r="10" />
        <circle className="node" cx="280" cy="30" r="3.5" />
      </svg>
    </div>
  );
}
