"use client";

import type { ReactNode } from "react";
import MuiThemeProvider from "@/app/theme/MuiThemeProvider";
import { SnackbarProvider } from 'notistack';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <MuiThemeProvider>
          <SnackbarProvider 
            maxSnack={3} 
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            autoHideDuration={3000}
          >
            {children}
          </SnackbarProvider>
        </MuiThemeProvider>
      </body>
    </html>
  );
}
