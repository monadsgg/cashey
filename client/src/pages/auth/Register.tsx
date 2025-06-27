import { useState } from "react";
import Stack from "@mui/material/Stack";
import TextInputField from "../../components/TextInputField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router";
import Paper from "@mui/material/Paper";
import { register } from "../../services/auth";
import { isValidEmail } from "../../utils/validators";

type User = {
  name: string;
  email: string;
  password: string;
};

type Error = {
  name?: string;
  email?: string;
  password?: string;
};

function Register() {
  const [user, setUser] = useState<User>({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Error>({});
  let navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const isValidated = () => {
    const { name, email, password } = user;
    const newErrors: Error = {
      name: name.trim() ? "" : "Name is required",
      email: email.trim()
        ? isValidEmail(email)
          ? ""
          : "Enter a valid email address"
        : "Email is required",
      password: password.trim() ? "" : "Password is required",
    };

    setErrors(newErrors);

    const isValid = Object.values(newErrors).every((err) => err === "");

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = isValidated();
    if (!isValid) {
      return;
    }

    try {
      const { name, email, password } = user;
      const { token, user: userData } = await register(name, email, password);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", token);
      navigate("/dashboard");
    } catch (error: any) {
      setErrors({ password: error.response.data.error });
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
              Welcome!
            </Typography>
            <Stack spacing={2}>
              <TextInputField
                required
                label="name"
                name="name"
                type="text"
                value={user.name}
                error={!!errors.name}
                helperText={errors.name}
                onChange={handleChange}
              />
              <TextInputField
                required
                label="email address"
                name="email"
                type="email"
                value={user.email}
                error={!!errors.email}
                helperText={errors.email}
                onChange={handleChange}
              />
              <TextInputField
                required
                label="password"
                name="password"
                type="password"
                value={user.password}
                error={!!errors.password}
                helperText={errors.password}
                onChange={handleChange}
              />
              <Button variant="contained" size="medium" onClick={handleSubmit}>
                sign up
              </Button>
            </Stack>

            <Stack
              direction="row"
              spacing={1}
              sx={{ justifyContent: "center", alignItems: "center" }}
            >
              <Typography>Already a user?</Typography>
              <Link
                sx={{ typography: "body1", cursor: "pointer" }}
                onClick={() => navigate("/login")}
              >
                Login to your account
              </Link>
            </Stack>
          </Stack>
        </Paper>
      </Stack>
    </Box>
  );
}

export default Register;
