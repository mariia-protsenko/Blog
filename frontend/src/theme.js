import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  shadows: Array(2).fill('none'),
  palette: {
    primary: {
      main: '#4361ee',
    },
  },
  typography: {
    button: {
      textTransform: 'none',
      fontWeight: 400,
    },
  },
});
