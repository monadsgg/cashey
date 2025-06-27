import { useState } from "react";
import Stack from "@mui/material/Stack";
import TextInputField from "../../components/TextInputField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router";
import Paper from "@mui/material/Paper";
import { login } from "../../services/auth";
import { isValidEmail } from "../../utils/validators";

type User = {
  email: string;
  password: string;
};

type Error = {
  email?: string;
  password?: string;
};

function Login() {
  const [user, setUser] = useState<User>({ email: "", password: "" });
  const [error, setError] = useState<Error>({});
  let navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const isValidated = () => {
    const { email, password } = user;
    const newError: Error = {
      email: email.trim()
        ? isValidEmail(email)
          ? ""
          : "Enter a valid email address"
        : "Email is required",
      password: password.trim() ? "" : "Password is required",
    };

    setError(newError);

    const isValid = Object.values(newError).every((err) => err === "");

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = isValidated();
    if (!isValid) {
      return;
    }

    try {
      const { email, password } = user;
      const { token, user: userData } = await login(email, password);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      navigate("/dashboard");
    } catch (error: any) {
      setError({ password: error.response.data.error });
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Stack spacing={2} sx={{ alignItems: "center" }}>
        <Typography variant="h3" color="primary">
          Cashey: Money Tracker App
        </Typography>
        <Paper
          elevation={6}
          sx={{
            width: 450,
            padding: 4,
            borderRadius: 6,
          }}
        >
          <Stack spacing={3}>
            <Typography variant="h2" sx={{ textAlign: "center" }}>
              Welcome back!
            </Typography>
            <Stack spacing={2}>
              <TextInputField
                label="email address"
                name="email"
                type="text"
                value={user.email}
                error={!!error.email}
                helperText={error.email}
                onChange={handleChange}
              />
              <TextInputField
                label="password"
                name="password"
                type="password"
                value={user.password}
                error={!!error.password}
                helperText={error.password}
                onChange={handleChange}
              />
            </Stack>
            <Button variant="contained" size="medium" onClick={handleSubmit}>
              Login
            </Button>
            <Stack
              direction="row"
              spacing={1}
              sx={{ justifyContent: "center", alignItems: "center" }}
            >
              <Typography>Don't have an account?</Typography>
              <Link
                sx={{ typography: "body1", cursor: "pointer" }}
                onClick={() => navigate("/register")}
              >
                Sign up
              </Link>
            </Stack>
          </Stack>
        </Paper>
      </Stack>
    </Box>
  );
}

export default Login;
