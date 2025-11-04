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
import { getZodIssueObj } from "../../utils/validators";
import { useQueryClient } from "@tanstack/react-query";
import { invalidateUserQueries } from "../../utils/invalidateUserQueries";
import type z from "zod";
import { UserLoginSchema } from "../../schemas/userSchema";

export type UserFormData = z.infer<typeof UserLoginSchema>;

function Login() {
  const [user, setUser] = useState<UserFormData>({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // validate data
    const result = UserLoginSchema.safeParse(user);

    if (result.success) {
      const { email, password } = result.data;

      try {
        const { token, user: userData } = await login(email, password);

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));

        invalidateUserQueries(queryClient);

        navigate("/dashboard");
      } catch (error: any) {
        setErrors({ password: error.response.data.error });
      }
    } else {
      result.error.issues.forEach((issue) => {
        const newError = getZodIssueObj(issue);
        setErrors({ ...errors, ...newError });
      });
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
                error={!!errors.email}
                helperText={errors.email}
                onChange={handleChange}
              />
              <TextInputField
                label="password"
                name="password"
                type="password"
                value={user.password}
                error={!!errors.password}
                helperText={errors.password}
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
