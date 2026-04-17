"use client";
import { useState } from "react";
import { Typography, TextField, Button, Box, CircularProgress } from "@mui/material";
import { useSnackbar } from "notistack";
import { API } from "@/lib/api";

export default function ForgotStep({ email, setEmail, onNext }: any) {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      enqueueSnackbar("Please enter an email or phone number.", { variant: 'error' });
      return;
    }
    setLoading(true);

    try {
      // Call real backend API
      const response = await fetch(`${API}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        enqueueSnackbar("Reset code sent to your email!", { variant: 'success' });
        onNext();
      } else {
        enqueueSnackbar(data.message || "Failed to send reset code", { variant: 'error' });
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      enqueueSnackbar("Failed to send reset code. Please try again.", { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography sx={{ fontSize: "28px", fontWeight: 700, mb: "12px", color: "#1D2939" }}>
        Forgot password
      </Typography>
      <Typography sx={{ fontSize: "14px", color: "#667085", mb: "32px", lineHeight: "1.6" }}>
        Enter the email or number associated with your account, and we will email you a verification code to reset your password.
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography sx={{ fontSize: "14px", fontWeight: 500, color: "#344054", mb: 1 }}>
          Email / Phone number
        </Typography>
        <TextField
          fullWidth
          placeholder="e.g. john@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={inputStyle}
        />
      </Box>

      <Button
        fullWidth
        sx={brandButtonStyle}
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : "Continue"}
      </Button>
    </Box>
  );
}

const inputStyle = {
  "& .MuiInputBase-root": {
    height: "48px",
    borderRadius: "10px",
    backgroundColor: "#F9FAFB",
    border: "1px solid #D0D5DD",
    fontSize: "14px",
    "&:hover": { borderColor: "#5948DB" },
    "&.Mui-focused": { borderColor: "#5948DB", boxShadow: "0px 0px 0px 4px rgba(89, 72, 219, 0.1)" }
  },
  "& fieldset": { border: "none" },
};

const brandButtonStyle = {
  height: "52px",
  backgroundColor: "#5948DB",
  color: "#fff",
  textTransform: "none",
  borderRadius: "10px",
  fontSize: "16px",
  fontWeight: 600,
  transition: "all 0.2s",
  "&:hover": { backgroundColor: "#4738b0", transform: "translateY(-1px)", boxShadow: "0px 4px 12px rgba(89, 72, 219, 0.25)" },
  "&:disabled": { backgroundColor: "#9E94EC", color: "#fff" }
};