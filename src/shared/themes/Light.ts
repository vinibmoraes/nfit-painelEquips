import { createTheme} from '@mui/material';
import { grey, purple } from '@mui/material/colors';

export const LightTheme = createTheme({
  palette: {
    primary: {
      main: purple[600],
      dark: purple[800],
      light: purple[400],
      contrastText: '#ffffff',
    },
    secondary: {
      main: grey[700],
      dark: grey[900],
      light: grey[500],
      contrastText: '#ffffff',
    },
    background: {
      default: '#f7f3f6',
      paper: '#ffffff',
    }
  }
});