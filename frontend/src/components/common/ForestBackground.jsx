import { Box } from '@mui/material';

// Cartoony forest trees defined as SVG group data
const BACK_TREES = [
  { x: 60,   y: 540, s: 0.65, c: 0 },
  { x: 190,  y: 530, s: 0.70, c: 1 },
  { x: 340,  y: 545, s: 0.60, c: 0 },
  { x: 480,  y: 535, s: 0.72, c: 1 },
  { x: 620,  y: 540, s: 0.65, c: 2 },
  { x: 760,  y: 528, s: 0.68, c: 0 },
  { x: 900,  y: 542, s: 0.63, c: 1 },
  { x: 1040, y: 530, s: 0.70, c: 2 },
  { x: 1180, y: 538, s: 0.67, c: 0 },
  { x: 1320, y: 533, s: 0.64, c: 1 },
  { x: 1420, y: 545, s: 0.60, c: 2 },
];

const FRONT_TREES = [
  { x: 0,    y: 640, s: 1.1,  c: 3 },
  { x: 110,  y: 650, s: 1.0,  c: 4 },
  { x: 240,  y: 638, s: 1.2,  c: 3 },
  { x: 375,  y: 645, s: 1.05, c: 4 },
  { x: 505,  y: 636, s: 1.15, c: 3 },
  { x: 635,  y: 648, s: 1.0,  c: 4 },
  { x: 760,  y: 640, s: 1.1,  c: 3 },
  { x: 885,  y: 644, s: 1.08, c: 4 },
  { x: 1010, y: 637, s: 1.2,  c: 3 },
  { x: 1140, y: 648, s: 1.0,  c: 4 },
  { x: 1265, y: 640, s: 1.1,  c: 3 },
  { x: 1390, y: 646, s: 1.05, c: 4 },
  { x: 1450, y: 638, s: 1.15, c: 3 },
];

const FOLIAGE_COLORS = [
  '#52b788', // light green (back)
  '#40916c', // medium green (back)
  '#74c69d', // mint green (back)
  '#2d6a4f', // dark green (front)
  '#1b4332', // very dark green (front)
];

const TRUNK_COLORS = ['#a47551', '#8B5E3C'];

function Tree({ x, y, s, c }) {
  const foliage = FOLIAGE_COLORS[c];
  const foliage2 = c <= 2 ? FOLIAGE_COLORS[Math.min(c + 1, 2)] : FOLIAGE_COLORS[Math.min(c + 1, 4)];
  const trunk = TRUNK_COLORS[c % 2];

  return (
    <g transform={`translate(${x}, ${y}) scale(${s})`}>
      {/* Trunk */}
      <rect x="-9" y="-10" width="18" height="55" fill={trunk} rx="4" />
      {/* Shadow circle */}
      <ellipse cx="0" cy="-55" rx="48" ry="40" fill={foliage} opacity="0.6" />
      {/* Main foliage */}
      <circle cx="-15" cy="-55" r="40" fill={foliage} />
      <circle cx="18"  cy="-50" r="38" fill={foliage} />
      <circle cx="0"   cy="-80" r="36" fill={foliage2} />
      {/* Highlight */}
      <circle cx="-10" cy="-75" r="18" fill={foliage2} opacity="0.7" />
    </g>
  );
}

export default function ForestBackground() {
  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        background: `
          linear-gradient(
            180deg,
            #c8e8f5 0%,
            #a0d4ea 25%,
            #c5e8d0 52%,
            #6ab87c 62%,
            #3d9456 72%,
            #2a6e3f 82%,
            #1a4d2c 100%
          )
        `,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      {/* Clouds */}
      <svg
        viewBox="0 0 1440 300"
        preserveAspectRatio="xMidYMin meet"
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '300px', opacity: 0.7 }}
      >
        <ellipse cx="200"  cy="80"  rx="90" ry="40" fill="white" opacity="0.9" />
        <ellipse cx="260"  cy="65"  rx="70" ry="35" fill="white" opacity="0.9" />
        <ellipse cx="145"  cy="70"  rx="60" ry="30" fill="white" opacity="0.9" />

        <ellipse cx="900"  cy="60"  rx="80" ry="35" fill="white" opacity="0.85" />
        <ellipse cx="960"  cy="48"  rx="65" ry="30" fill="white" opacity="0.85" />
        <ellipse cx="845"  cy="55"  rx="55" ry="28" fill="white" opacity="0.85" />

        <ellipse cx="1300" cy="90"  rx="75" ry="32" fill="white" opacity="0.8" />
        <ellipse cx="1355" cy="76"  rx="58" ry="28" fill="white" opacity="0.8" />
        <ellipse cx="1248" cy="82"  rx="50" ry="26" fill="white" opacity="0.8" />
      </svg>

      {/* Trees SVG */}
      <svg
        viewBox="0 0 1440 800"
        preserveAspectRatio="xMidYMax slice"
        style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '70%' }}
      >
        {/* Ground */}
        <ellipse cx="720" cy="820" rx="900" ry="220" fill="#1a4d2c" />

        {/* Back row */}
        {BACK_TREES.map((t, i) => <Tree key={`b${i}`} {...t} />)}

        {/* Front row */}
        {FRONT_TREES.map((t, i) => <Tree key={`f${i}`} {...t} />)}

        {/* Ground overlay */}
        <rect x="0" y="720" width="1440" height="80" fill="#1a4d2c" />
        <ellipse cx="360"  cy="722" rx="280" ry="30" fill="#2a6e3f" />
        <ellipse cx="1000" cy="718" rx="320" ry="28" fill="#2a6e3f" />
      </svg>
    </Box>
  );
}
