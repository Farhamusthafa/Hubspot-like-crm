"use client";
import { useState } from "react";
import { Box, Typography, TextField, Button, Grid, CircularProgress } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { API } from "@/lib/api";

export default function ResetStep({ email, otp }: any) {
  const { enqueueSnackbar } = useSnackbar();
  const [isDone, setIsDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleReset = async () => {
    if (password.length < 8) {
      enqueueSnackbar("Password must be at least 8 characters.", { variant: 'error' });
      return;
    }
    setLoading(true);

    try {
      // Call real backend API
      const response = await fetch(`${API}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          otp: otp, // Use the actual OTP from previous step
          password: password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsDone(true);
        enqueueSnackbar(data.message || "Password reset successfully!", { variant: 'success' });
      } else {
        enqueueSnackbar(data.message || "Failed to reset password", { variant: 'error' });
      }
    } catch (error) {
      console.error('Password reset error:', error);
      enqueueSnackbar("Failed to reset password. Please try again.", { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (isDone) {
    return (
      <Box sx={{ textAlign: "center" }}>
        <Typography sx={{ fontSize: "28px", fontWeight: 700, mb: 1, color: "#1D2939" }}>
          Success!
        </Typography>
        <Typography sx={{ fontSize: "14px", color: "#667085", mb: 4 }}>
          Your password has been changed successfully.
        </Typography>

        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12}>
            <TextField fullWidth disabled value={email} sx={finalInputStyle} />
          </Grid>
          <Grid item xs={12} sx={{ position: "relative" }}>
            <TextField fullWidth disabled value="********" type="password" sx={finalInputStyle} />
            <Box sx={badgeStyle}>
              <CheckCircleOutlineIcon sx={{ fontSize: 16, mr: 0.5 }} /> Password changed!
            </Box>
          </Grid>
        </Grid>

        <Button
          fullWidth
          sx={brandButtonStyle}
          onClick={() => router.push("/login")}
        >
          Login
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Typography sx={{ fontSize: "28px", fontWeight: 700, mb: "12px", color: "#1D2939" }}>
        Set password
      </Typography>
      <Typography sx={{ fontSize: "14px", color: "#667085", mb: "32px", lineHeight: "1.6" }}>
        Password requires a minimum of 8 characters and contains a cap letter, numbers and symbols.
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography sx={{ fontSize: "14px", fontWeight: 500, color: "#344054", mb: 1 }}>
          New Password
        </Typography>
        <TextField
          fullWidth
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={inputStyle}
        />
      </Box>

      <Button
        fullWidth
        sx={brandButtonStyle}
        onClick={handleReset}
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

const finalInputStyle = {
  "& .MuiInputBase-root": {
    height: "48px",
    backgroundColor: "#F2F4F7",
    borderRadius: "10px",
    color: "#667085"
  },
  "& fieldset": { border: "none" }
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

const badgeStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "#ECFDF3",
  color: "#027A48",
  padding: "8px 16px",
  borderRadius: "8px",
  display: "flex",
  alignItems: "center",
  fontSize: "14px",
  fontWeight: 600,
  border: "1px solid #ABEFC6",
  zIndex: 2,
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.05)"
};