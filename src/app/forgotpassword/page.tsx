"use client";
import { useState } from "react";
import { Box, Container, Paper, Typography, IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

// Import your sub-components
import ForgotStep from "./ForgotStep";
import VerifyStep from "./VerifyStep";
import ResetStep from "./ResetStep";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  // Logic to move forward
  const handleNext = (otpValue?: string) => {
    if (otpValue) {
      setOtp(otpValue);
    }
    setStep((prev) => prev + 1);
  };

  // Logic to move back
  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <Box sx={wrapperStyle}>
      <Container maxWidth="sm">
        <Paper elevation={0} sx={paperStyle}>

          {/* Real Back Button Logic */}
          {step < 3 && (
            <Box
              sx={{ mb: 3, display: "flex", alignItems: "center", cursor: "pointer", width: "fit-content" }}
              onClick={handleBack}
            >
              <ArrowBackIosNewIcon sx={{ fontSize: 14, color: "#6b7280", mr: 1 }} />
              <Typography sx={{ fontSize: "14px", color: "#6b7280", fontWeight: 500 }}>
                Back
              </Typography>
            </Box>
          )}

          {/* Step Renderer */}
          {step === 1 && (
            <ForgotStep
              email={email}
              setEmail={setEmail}
              onNext={handleNext}
            />
          )}

          {step === 2 && (
            <VerifyStep
              email={email}
              onNext={handleNext}
            />
          )}

          {step === 3 && (
            <ResetStep
              email={email}
              otp={otp}
            />
          )}

        </Paper>
      </Container>
    </Box>
  );
}

// Internal Styles (No CSS file needed)
const wrapperStyle = {
  minHeight: "100vh",
  background: "#ffffff", // Changed to white as requested
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};

const paperStyle = {
  padding: "48px 56px",
  borderRadius: "24px",
  backgroundColor: "#ffffff",
  boxShadow: "0px 24px 48px rgba(0, 0, 0, 0.15)",
  position: "relative",
  overflow: "hidden"
};