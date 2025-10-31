import React from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import FeaturesList from "./FeaturesList";
import TechStack from "./TechStack";
import DevelopmentMilestone from "./DevelopmentMilestone";
import milestoneData from "./data/milestone-logs.json";
import GitHubIcon from "@mui/icons-material/GitHub";
import LaunchIcon from "@mui/icons-material/Launch";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Overview from "./Overview";

export default function Docs() {
  const [tab, setTab] = React.useState(0);

  const redirect = () => {
    window.location.href = "https://github.com/monadsgg/cashey";
  };

  return (
    <Container sx={{ pt: 5, pb: 5 }}>
      <Stack spacing={3}>
        <Paper elevation={0} sx={{ p: 0 }}>
          <Stack
            direction="row"
            alignItems="start"
            justifyContent="space-between"
          >
            <Stack spacing={0.5} alignItems="flex-start">
              <Typography variant="h5" fontWeight={800}>
                Cashey Finance Tracker
              </Typography>

              <Stack direction="row" spacing={1}>
                <Chip
                  label={`v${milestoneData.versions[0].version}`}
                  size="medium"
                  color="primary"
                  sx={{
                    color: "#1976d2",
                    backgroundColor: "#e3f2fd",
                    fontWeight: 600,
                  }}
                />
                <Chip
                  label="Active development"
                  size="medium"
                  sx={{
                    backgroundColor: "#e8f5e9",
                    color: "#2e7d32",
                    fontWeight: 600,
                  }}
                />
              </Stack>
            </Stack>
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                startIcon={<GitHubIcon />}
                onClick={redirect}
              >
                GitHub
              </Button>
              <Button
                variant="outlined"
                startIcon={<LaunchIcon />}
                // onClick={redirect} TODO: update with app url
              >
                Live App
              </Button>
            </Stack>
          </Stack>

          <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mt: 2 }}>
            <Tab label="Overview" />
            <Tab label="Features" />
            <Tab label="Development Milestones" />
            <Tab label="Tech Stack" />
          </Tabs>
        </Paper>

        {tab === 0 && <Overview />}

        {tab === 1 && <FeaturesList />}

        {tab === 2 && <DevelopmentMilestone />}

        {tab === 3 && <TechStack />}
      </Stack>
    </Container>
  );
}
