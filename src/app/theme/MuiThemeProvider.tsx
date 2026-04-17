// "use client";

// import { ThemeProvider, CssBaseline } from "@mui/material";
// import { ReactNode } from "react";
// import theme from "./theme";

// export default function MuiThemeProvider({
//   children,
// }: {
//   children: ReactNode;
// }) {
//   return (
//     <ThemeProvider theme={theme}>
//       <CssBaseline />
//       {children}
//     </ThemeProvider>
//   );
// }

"use client";

import * as React from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import theme from "./theme";

export default function MuiThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cache] = React.useState(() =>
    createCache({ key: "mui", prepend: true })
  );

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}