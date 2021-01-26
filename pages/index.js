import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { FileDrop } from "react-file-drop";
import * as Vibrant from "node-vibrant";
import { ThemeProvider } from "@material-ui/core/styles";
import bestContrast from "get-best-contrast-color";
import { createMuiTheme } from "@material-ui/core/styles";
import isDarkColor from 'is-dark-color'
import { kea, useActions, useValues } from "kea";
import defaultTheme from "../src/theme";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

function loadImageFromFile(file) {
  let reader = new FileReader();
  reader.readAsDataURL(file);
  return new Promise((resolve, reject) => {
    reader.onloadend = function () {
      let img = document.createElement("img");
      img.src = reader.result;
      resolve(img);
    };
  });
}

const getColorsFromImage = async (img) => {
  const palette = await Vibrant.from(img).getPalette();
  const bodyTextColor = palette.Vibrant.getBodyTextColor();
  const themeType = isDarkColor(palette.Vibrant.getBodyTextColor()) ? "light" : "dark";

  return {
    palette: {
      type: themeType,
      primary: {
        light: palette.LightVibrant.getHex(),
        main: palette.Vibrant.getHex(),
        dark: palette.DarkVibrant.getHex(),
        contrastText: palette.Vibrant.getBodyTextColor(),
      },
      secondary: {
        main: palette.LightVibrant.getHex(),
      },
      text: {
        /*
        primary: palette.Vibrant.getBodyTextColor(),
        secondary: palette.Vibrant.getTitleTextColor(),
*/
      },
    },
  };
};
const logic = kea({
  actions: () => ({
    setTheme: (theme) => ({ theme }),
    setBackground: (background) => ({ background }),
  }),
  reducers: () => ({
    theme: [
      defaultTheme,
      {
        setTheme: (state, { theme }) => theme,
      },
    ],
    background: [
      "images/glitchy.jpg",
      {
        setBackground: (state, { background }) => background,
      },
    ],
  }),
});

function Drop({ children }) {
  const { setTheme, setBackground } = useActions(logic);
  return (
    <FileDrop
      onDrop={async (files, event) => {
        const img = await loadImageFromFile(files[0]);
        const colors = await getColorsFromImage(img);
        console.log(colors);
        setTheme(colors);
        setBackground(img.src);
      }}
    >
      {children}
    </FileDrop>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: ({ palette }) => palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const bgStyles = makeStyles({
  bg: {
    background: ({ background }) =>
      `url(${background}) no-repeat center center fixed`,
    backgroundSize: "cover",
    minHeight: "100vh",
  },
});

const Background = ({ background = "", children }) => {
  const classes = bgStyles({ background });

  return (
    <Drop>
      <div className={classes.bg}>{children}</div>
    </Drop>
  );
};

const Theme = ({ theme, children }) => {
  const builtTheme = createMuiTheme(theme);
  return <ThemeProvider theme={builtTheme}>{children}</ThemeProvider>;
};

function SignUp() {
  const { theme, background } = useValues(logic);
  const classes = useStyles(theme);
  return (
    <Theme theme={theme}>
      <CssBaseline />
      <Background background={background}>
        <Container component="main" maxWidth="xs">
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            <form className={classes.form} noValidate>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    autoComplete="fname"
                    name="firstName"
                    variant="outlined"
                    required
                    fullWidth
                    id="firstName"
                    label="Name"
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox value="allowExtraEmails" color="primary" />
                    }
                    label="I want to receive inspiration, marketing promotions and updates via email."
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Sign Up
              </Button>
              <Grid container justify="flex-end">
                <Grid item>
                  <Link href="#" variant="body2">
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </form>
          </div>
          <Box mt={5}>
            <Copyright />
          </Box>
        </Container>
      </Background>
    </Theme>
  );
}

export default logic(SignUp);
