import { useState } from 'react';
import {
  IconButton, Menu, MenuItem, ListItemIcon, ListItemText, Tooltip,
} from '@mui/material';
import PaletteIcon from '@mui/icons-material/Palette';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import ForestIcon from '@mui/icons-material/Forest';
import CheckIcon from '@mui/icons-material/Check';
import useThemeStore from '../../store/themeStore';

const OPTIONS = [
  { value: 'default', label: 'Default', icon: <LightModeIcon fontSize="small" /> },
  { value: 'dark',    label: 'Dark',    icon: <DarkModeIcon fontSize="small" /> },
  { value: 'nature',  label: 'Nature',  icon: <ForestIcon fontSize="small" /> },
];

export default function ThemeSelector() {
  const [anchor, setAnchor] = useState(null);
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);

  return (
    <>
      <Tooltip title="Change theme">
        <IconButton onClick={(e) => setAnchor(e.currentTarget)} size="small" sx={{ color: 'text.secondary' }}>
          <PaletteIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {OPTIONS.map((opt) => (
          <MenuItem
            key={opt.value}
            onClick={() => { setTheme(opt.value); setAnchor(null); }}
            selected={theme === opt.value}
          >
            <ListItemIcon>{opt.icon}</ListItemIcon>
            <ListItemText>{opt.label}</ListItemText>
            {theme === opt.value && <CheckIcon fontSize="small" sx={{ ml: 1, color: 'primary.main' }} />}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
