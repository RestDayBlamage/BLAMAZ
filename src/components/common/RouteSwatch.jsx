// Próbka linii trasy (kolor + wzór kreski) – ta sama co na mapie; legenda na pigułkach i w galerii wypraw.
// Wzór (dash) w jednostkach SVG jak w Leaflecie, przy grubości linii 2.5 (TripsMap.jsx).
export default function RouteSwatch({ color, dash, width = 28, className = "" }) {
  return (
    <svg className={`route-swatch ${className}`} width={width} height="6" viewBox={`0 0 ${width} 6`} aria-hidden="true">
      <line x1="2" y1="3" x2={width - 2} y2="3" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeDasharray={dash} />
    </svg>
  );
}
