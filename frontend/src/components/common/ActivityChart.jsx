import { Box, Typography } from '@mui/material';

const CELL = 11;
const GAP = 3;
const DAY_LABELS = [null, 'Mon', null, 'Wed', null, 'Fri', null];

function cellColor(pages) {
  if (!pages || pages === 0) return '#ebedf0';
  if (pages < 20) return '#ddd6fe';
  if (pages < 40) return '#a78bfa';
  if (pages < 65) return '#7c3aed';
  return '#4c1d95';
}

export default function ActivityChart({ activityMap = {} }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(today);
  start.setDate(start.getDate() - 52 * 7);
  start.setDate(start.getDate() - start.getDay());

  const weeks = [];
  const cur = new Date(start);

  while (cur <= today) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      const dateStr = cur.toISOString().split('T')[0];
      week.push({
        date: dateStr,
        pages: cur > today ? 0 : (activityMap[dateStr] || 0),
        isToday: cur.getTime() === today.getTime(),
        isFuture: cur > today,
      });
      cur.setDate(cur.getDate() + 1);
    }
    weeks.push(week);
  }

  const monthSeen = new Set();
  const monthAt = {};
  weeks.forEach((week, wi) => {
    const d = new Date(week[0].date);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    if (!monthSeen.has(key)) {
      monthSeen.add(key);
      monthAt[wi] = d.toLocaleString('default', { month: 'short' });
    }
  });

  return (
    <Box sx={{ overflowX: 'auto' }}>
      <Box sx={{ display: 'inline-flex', gap: `${GAP}px` }}>
        {/* Day label column */}
        <Box
          sx={{
            display: 'flex', flexDirection: 'column', gap: `${GAP}px`,
            pt: `${CELL + GAP + 4}px`, pr: 0.5,
          }}
        >
          {DAY_LABELS.map((label, i) => (
            <Box key={i} sx={{ height: CELL, display: 'flex', alignItems: 'center' }}>
              {label && (
                <Typography sx={{ fontSize: 9, color: 'text.secondary', lineHeight: 1, whiteSpace: 'nowrap' }}>
                  {label}
                </Typography>
              )}
            </Box>
          ))}
        </Box>

        {/* Grid */}
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          {/* Month labels */}
          <Box sx={{ display: 'flex', gap: `${GAP}px`, height: CELL + 4, mb: '2px' }}>
            {weeks.map((_, wi) => (
              <Box key={wi} sx={{ width: CELL, flexShrink: 0 }}>
                {monthAt[wi] && (
                  <Typography sx={{ fontSize: 9, color: 'text.secondary', lineHeight: 1, whiteSpace: 'nowrap' }}>
                    {monthAt[wi]}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>

          {/* Week columns — native title for hover tooltip, no MUI Tooltip overhead */}
          <Box sx={{ display: 'flex', gap: `${GAP}px` }}>
            {weeks.map((week, wi) => (
              <Box key={wi} sx={{ display: 'flex', flexDirection: 'column', gap: `${GAP}px` }}>
                {week.map((day) => (
                  <Box
                    key={day.date}
                    component="span"
                    title={
                      day.isFuture ? undefined :
                      day.pages > 0 ? `${day.date}: ${day.pages} pages` :
                      `${day.date}: No activity`
                    }
                    sx={{
                      display: 'block',
                      width: CELL,
                      height: CELL,
                      borderRadius: '2px',
                      bgcolor: day.isFuture ? 'transparent' : cellColor(day.pages),
                      outline: day.isToday ? '2px solid' : 'none',
                      outlineColor: 'primary.main',
                      outlineOffset: '1px',
                      cursor: day.pages > 0 ? 'default' : 'default',
                    }}
                  />
                ))}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Legend */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1.5, justifyContent: 'flex-end' }}>
        <Typography sx={{ fontSize: 10, color: 'text.secondary' }}>Less</Typography>
        {['#ebedf0', '#ddd6fe', '#a78bfa', '#7c3aed', '#4c1d95'].map((color) => (
          <Box key={color} sx={{ width: CELL, height: CELL, borderRadius: '2px', bgcolor: color }} />
        ))}
        <Typography sx={{ fontSize: 10, color: 'text.secondary' }}>More</Typography>
      </Box>
    </Box>
  );
}
