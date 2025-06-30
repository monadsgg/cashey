// src/theme.ts
import { createTheme } from "@mui/material/styles";
import { fontSize } from "@mui/system";

const theme = createTheme({
  palette: {
    primary: {
      main: "#26CA99",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#FF7A59",
      contrastText: "#ffffff",
    },
    background: {
      default: "#f9f9f9",
      paper: "#ffffff",
    },
    text: {
      primary: "#1A1A1A",
      secondary: "#555555",
    },
  },
  typography: {
    fontFamily: ['"Helvetica Neue"', "Arial", "sans-serif"].join(","),
    fontSize: 14,
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 600,
    },
    h3: {
      fontSize: "1.5rem",
      fontWeight: 500,
    },
    body1: {
      fontSize: "1.2rem",
      fontWeight: 400,
    },
    button: {
      fontSize: "1rem",
      fontWeight: 600,
    },
    subtitle1: {
      fontSize: 15,
      textTransform: "uppercase",
      fontWeight: 600,
      color: "#555555",
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableFocusRipple: true,
        disableRipple: true,
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          marginLeft: 0,
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          "&:hover": {
            cursor: "pointer",
          },
        },
      },
    },
  },

  shape: {
    borderRadius: 4,
  },
});

export default theme;
