import type { ReactNode } from "react";
import Stack from "@mui/material/Stack";
import SideBar from "../components/SideBar";
import Box from "@mui/material/Box";

type AppLayoutProps = {
  children: ReactNode;
};

function AppLayout({ children }: AppLayoutProps) {
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Stack direction="row" sx={{ width: "100%", p: 6 }}>
        <SideBar />
        <Box sx={{ width: "80%", ml: 2 }}>{children}</Box>
      </Stack>
    </Box>
  );
}

export default AppLayout;
