"use client";

import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { useSnackbar } from "notistack";

import { login } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange =
    (field: keyof typeof form) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [field]: e.target.value });
        setErrors({ ...errors, [field]: "" });
      };

  /* ================= VALIDATION ================= */
  const validate = () => {
    const newErrors: Record<string, string> = {};

    // ✅ Email validation
    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Email is invalid";
    }

    // ✅ Password required
    if (!form.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // const handleSubmit = () => {
  //   if (!validate()) return;

  //   enqueueSnackbar("Login successful!", { variant: 'success' });
  //   setTimeout(() => {
  //     router.push("/dashboard");
  //   }, 1500);
  // };
  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      const data = await login(form.email, form.password);

      if (data.token) {
        enqueueSnackbar("Login successful!", { variant: "success" });
        // Store token in localStorage for future API calls
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push("/dashboard");
      } else {
        enqueueSnackbar(data.message || "Login failed", {
          variant: "error",
        });
      }
    } catch (error: any) {
      enqueueSnackbar(error.message || "Something went wrong!", { variant: "error" });
      console.error(error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f7f8fc",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            padding: "40px 48px",
            borderRadius: "8px",
            border: "1px solid #e6e8f0",
          }}
        >
          <Typography
            align="center"
            sx={{
              fontSize: "24px",
              fontWeight: 600,
              fontFamily: "'Inter', sans-serif",
              marginBottom: "28px",
              color: "#111827",
            }}
          >
            Log in
          </Typography>

          <Grid container spacing={3}>
            {/* EMAIL */}
            <Grid item xs={12}>
              <Typography sx={labelStyle}>Email</Typography>
              <TextField
                fullWidth
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange("email")}
                autoComplete="off"
                error={!!errors.email}
                helperText={errors.email}
                sx={{
                  ...inputStyle,
                  ...(form.email && {
                    "& .MuiInputBase-root": {
                      backgroundColor: "#f0f4ff",
                    },
                  }),
                }}
              />
            </Grid>

            {/* PASSWORD */}
            <Grid item xs={12}>
              <Box sx={passwordHeaderStyle}>
                <Typography sx={labelStyle}>Password</Typography>
                <Link href="/forgotpassword" style={forgotStyle}>
                  Forgot password?
                </Link>
              </Box>

              <TextField
                fullWidth
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange("password")}
                sx={{
                  ...inputStyle,
                  ...(form.password && {
                    "& .MuiInputBase-root": {
                      backgroundColor: "#f0f4ff",
                    },
                  }),
                  "& input[type=password]::-ms-reveal": {
                    display: "none",
                  },
                  "& input[type=password]::-webkit-credentials-auto-fill-button": {
                    display: "none",
                  },
                  "& input[type=password]::-webkit-caps-lock-indicator": {
                    display: "none",
                  },
                  "& input[type=password]::-webkit-reveal-password-button": {
                    display: "none",
                  },
                }}
                autoComplete="new-password"
                error={!!errors.password}
                helperText={errors.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        onClick={() => setShowPassword(!showPassword)}
                        sx={{ padding: "8px" }}
                      >
                        {showPassword ? (
                          <VisibilityOffOutlinedIcon fontSize="small" />
                        ) : (
                          <VisibilityOutlinedIcon fontSize="small" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Button fullWidth sx={buttonStyle} onClick={handleSubmit}>
                Log in
              </Button>
            </Grid>
          </Grid>
        </Paper>

        <Typography align="center" sx={footerStyle}>
          Don’t have an account?{" "}
          <Link
            href="/register"
            style={{
              color: "#5948DB",
              textDecoration: "none",
              fontFamily: "'Inter', sans-serif",
              fontWeight: 500,
            }}
          >
            Sign up
          </Link>
        </Typography>
      </Container>
    </Box>
  );
}

/* ================= STYLES ================= */

const labelStyle = {
  fontSize: "14px",
  fontWeight: 400,
  fontFamily: "'Inter', sans-serif",
  marginBottom: "6px",
  color: "#374151",
};

const passwordHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "6px",
};

const inputStyle = {
  "& .MuiInputBase-root": {
    height: "44px",
    fontSize: "14px",
    borderRadius: "8px",
    fontWeight: 400,
    fontFamily: "'Inter', sans-serif",
    color: "#111827",
    backgroundColor: "#ffffff",
  },
  "& input": {
    padding: "10px 12px",
  },
  "& input::placeholder": {
    color: "#94A3B8",
    opacity: 1,
  },
  "& input[type=password]::-webkit-credentials-auto-fill-button": {
    display: "none",
  },
  "& input[type=password]::-webkit-caps-lock-indicator": {
    display: "none",
  },
  "& input[type=password]::-webkit-reveal-password-button": {
    display: "none",
  },
  "& fieldset": {
    borderColor: "#d1d5db",
  },
  "&:hover fieldset": {
    borderColor: "#9ca3af",
  },
  "&.Mui-focused fieldset": {
    borderColor: "#5948DB",
  },
};

const buttonStyle = {
  height: "48px",
  marginTop: "10px",
  backgroundColor: "#5948DB",
  borderRadius: "8px",
  textTransform: "none",
  fontSize: "15px",
  fontWeight: 500,
  fontFamily: "'Inter', sans-serif",
  color: "#ffffff",
  boxShadow: "none",
  "&:hover": {
    backgroundColor: "#4a3bc7",
    boxShadow: "none",
  },
};

const forgotStyle = {
  fontSize: "14px",
  fontFamily: "'Inter', sans-serif",
  fontWeight: 400,
  color: "#5948DB",
  textDecoration: "none",
};

const footerStyle = {
  marginTop: "20px",
  fontSize: "14px",
  fontFamily: "'Inter', sans-serif",
  color: "#6b7280",
};
