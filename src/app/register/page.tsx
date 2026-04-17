"use client";

import {
  Box,
  Button,
  Container,
  Grid,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { register } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    company: "",
    industry: "",
    country: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange =
    (field: keyof typeof form) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [field]: e.target.value });
        setErrors({ ...errors, [field]: "" });
      };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    Object.entries(form).forEach(([key, value]) => {
      if (!value) newErrors[key] = "This field is required";
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    setSubmitted(true);

    if (!validate()) return;

    try {
      const userData = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        phone: form.phone,
        companyName: form.company,
        industryType: form.industry,
        countryRegion: form.country,
      };

      const data = await register(userData);

      if (data.user || data.token) {
        enqueueSnackbar("Registration successful! ", { variant: 'success' });

        // Store token if returned (for auto-login)
        if (data.token) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          setTimeout(() => {
            router.push("/dashboard");
          }, 2000);
        } else {
          // Redirect to login if no token returned
          setTimeout(() => {
            router.push("/login");
          }, 2000);
        }
      } else {
        enqueueSnackbar(data.message || "Registration failed", {
          variant: "error",
        });
      }
    } catch (error: any) {
      enqueueSnackbar(error.message || "Registration failed", { variant: "error" });
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
      <Container maxWidth="md">
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
            Register
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography sx={labelStyle}>First Name</Typography>
              <TextField
                fullWidth
                placeholder="Enter your first name"
                value={form.firstName}
                onChange={handleChange("firstName")}
                sx={inputStyle}
                error={!!errors.firstName}
                helperText={errors.firstName}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography sx={labelStyle}>Last Name</Typography>
              <TextField
                fullWidth
                placeholder="Enter your last name"
                value={form.lastName}
                onChange={handleChange("lastName")}
                sx={inputStyle}
                error={!!errors.lastName}
                helperText={errors.lastName}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography sx={labelStyle}>Email</Typography>
              <TextField
                fullWidth
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange("email")}
                sx={inputStyle}
                autoComplete="off"
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography sx={labelStyle}>Password</Typography>
              <TextField
                fullWidth
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange("password")}
                sx={inputStyle}
                autoComplete="new-password"
                error={!!errors.password}
                helperText={errors.password}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography sx={labelStyle}>Phone Number</Typography>
              <TextField
                fullWidth
                placeholder="Enter your phone number"
                value={form.phone}
                onChange={handleChange("phone")}
                sx={inputStyle}
                error={!!errors.phone}
                helperText={errors.phone}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography sx={labelStyle}>Company Name</Typography>
              <TextField
                fullWidth
                placeholder="Enter your company name"
                value={form.company}
                onChange={handleChange("company")}
                sx={inputStyle}
                error={!!errors.company}
                helperText={errors.company}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography sx={labelStyle}>Industry Type</Typography>
              <TextField
                select
                fullWidth
                value={form.industry}
                onChange={handleChange("industry")}
                sx={form.industry ? { ...inputStyle, "& .MuiInputBase-root": { ...inputStyle["& .MuiInputBase-root"], backgroundColor: "#f0f4ff" } } : inputStyle}
                error={submitted && !!errors.industry}
                helperText={submitted ? errors.industry : ""}
                SelectProps={{
                  displayEmpty: true,
                  renderValue: (selected) => {
                    const value = selected as string;
                    if (value === "") {
                      return <span style={{ color: "#94A3B8" }}>Choose</span>;
                    }
                    return value;
                  },
                }}
              >
                <MenuItem value="">
                  <span style={{ color: "#94A3B8" }}>Choose</span>
                </MenuItem>
                <MenuItem value="IT">IT</MenuItem>
                <MenuItem value="Finance">Finance</MenuItem>
                <MenuItem value="Healthcare">Healthcare</MenuItem>
                <MenuItem value="Education">Education</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography sx={labelStyle}>Country or Region</Typography>
              <TextField
                fullWidth
                placeholder="Enter your country or region"
                value={form.country}
                onChange={handleChange("country")}
                sx={inputStyle}
                error={!!errors.country}
                helperText={errors.country}
              />
            </Grid>

            <Grid item xs={12}>
              <Button fullWidth onClick={handleSubmit} sx={buttonStyle}>
                Register
              </Button>
            </Grid>
          </Grid>
        </Paper>

        <Typography align="center" sx={footerStyle}>
          Already have an account?{" "}
          <Link
            href="/login"
            style={{ color: "#5948DB", textDecoration: "none" }}
          >
            Login
          </Link>
        </Typography>
      </Container>
    </Box>
  );
}

/* ===== Styles ===== */
const labelStyle = {
  fontSize: "14px",
  fontWeight: 400,
  fontFamily: "'Inter', sans-serif",
  marginBottom: "6px",
  color: "#374151",
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
  "& .MuiInputBase-root.filled": {
    backgroundColor: "#f0f4ff",
  },
  "& input": {
    padding: "10px 12px",
  },
  "& input::placeholder": {
    color: "#94A3B8",
    opacity: 1,
  },
};

const buttonStyle = {
  height: "48px",
  backgroundColor: "#5948DB",
  borderRadius: "8px",
  textTransform: "none",
  fontSize: "15px",
  fontWeight: 500,
  fontFamily: "'Inter', sans-serif",
  color: "#ffffff",
  marginTop: "10px",
  boxShadow: "none",
  "&:hover": {
    backgroundColor: "#4a3bc7",
    boxShadow: "none",
  },
};

const footerStyle = {
  marginTop: "20px",
  fontSize: "14px",
  fontFamily: "'Inter', sans-serif",
  color: "#6b7280",
};
