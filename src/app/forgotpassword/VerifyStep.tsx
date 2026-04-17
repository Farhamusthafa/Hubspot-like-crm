"use client";
import { useState, useEffect, useRef } from "react";
import { Box, Typography, TextField, Button, CircularProgress } from "@mui/material";
import { useSnackbar } from "notistack";
import { API } from "@/lib/api";

export default function VerifyStep({ email, onNext }: any) {
  const { enqueueSnackbar } = useSnackbar();
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<any[]>([]);

  useEffect(() => {
    const interval = setInterval(() => setTimer((t) => (t > 0 ? t - 1 : 0)), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (index: number, value: string) => {
    // Handle pasting of complete OTP
    if (value.length > 1 && value.length === 6) {
      // If pasting a 6-digit code, distribute it across all fields
      const digits = value.split('');
      const newOtp = ["", "", "", "", "", ""];

      for (let i = 0; i < 6 && i < digits.length; i++) {
        newOtp[i] = digits[i];
      }

      setOtp(newOtp);

      // Focus the last filled field
      setTimeout(() => {
        inputRefs.current[Math.min(5, digits.length - 1)]?.focus();
      }, 50);
      return;
    }

    // Handle single digit input
    if (value.length > 1) value = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input (but don't interfere with pasting)
    if (value && index < 5) {
      setTimeout(() => {
        inputRefs.current[index + 1]?.focus();
      }, 50); // Small delay to allow pasting
    }
  };

  const handleKeyDown = (index: number, e: any) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = async () => {
    if (otp.some(v => v === "")) {
      enqueueSnackbar("Please enter the full 6-digit code.", { variant: 'error' });
      return;
    }
    setLoading(true);

    try {
      // Call real backend API
      const response = await fetch(`${API}/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          otp: otp.join('')
        }),
      });

      const data = await response.json();

      if (response.ok) {
        enqueueSnackbar(data.message || "Code verified successfully!", { variant: 'success' });
        onNext(otp.join('')); // Pass the OTP value to next step
      } else {
        enqueueSnackbar(data.message || "Invalid verification code", { variant: 'error' });
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      enqueueSnackbar("Failed to verify code. Please try again.", { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography sx={{ fontSize: "28px", fontWeight: 700, mb: "12px", color: "#1D2939" }}>
        Enter verification code
      </Typography>
      <Typography sx={{ fontSize: "14px", color: "#667085", mb: "32px", lineHeight: "1.6" }}>
        The verification code has been sent to email <b style={{ color: "#1D2939" }}>{email || "johnwick@gmail.com"}</b>
      </Typography>

      <Box sx={{ display: "flex", gap: "12px", mb: "16px" }}>
        {otp.map((val, i) => (
          <TextField
            key={i}
            sx={otpInputStyle}
            inputRef={(el) => (inputRefs.current[i] = el)}
            value={val}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            inputProps={{
              maxLength: 6, // Allow up to 6 characters for pasting
              style: { textAlign: 'center', fontWeight: 700, fontSize: '18px' }
            }}
          />
        ))}
      </Box>

      <Typography sx={{ fontSize: "12px", color: "#667085", mb: 4 }}>
        {timer > 0 ? (
          <>Resend code in <span style={{ color: "#5948DB", fontWeight: 600 }}>{timer} seconds</span></>
        ) : (
          <span
            onClick={() => { setTimer(60); enqueueSnackbar("New code sent!", { variant: 'info' }); }}
            style={{ color: "#5948DB", fontWeight: 600, cursor: "pointer", textDecoration: "underline" }}
          >
            Resend code
          </span>
        )}
      </Typography>

      <Button
        fullWidth
        sx={brandButtonStyle}
        onClick={handleVerify}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : "Verify Code"}
      </Button>
    </Box>
  );
}

const otpInputStyle = {
  "& .MuiInputBase-root": {
    width: "60px",
    height: "60px",
    borderRadius: "12px",
    border: "1px solid #D0D5DD",
    backgroundColor: "#F9FAFB",
    transition: "all 0.2s",
    "&:hover": { borderColor: "#5948DB" },
    "&.Mui-focused": { borderColor: "#5948DB", boxShadow: "0px 0px 0px 4px rgba(89, 72, 219, 0.1)" }
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