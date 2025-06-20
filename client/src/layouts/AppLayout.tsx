import type { ReactNode } from "react";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import SideBar from "../components/SideBar";

type AppLayoutProps = {
  children: ReactNode;
};

function AppLayout({ children }: AppLayoutProps) {
  return (
    <Container>
      <Stack direction="row">
        <SideBar />
        <main>{children}</main>
      </Stack>
    </Container>
  );
}

export default AppLayout;
