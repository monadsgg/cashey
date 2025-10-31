import { useMemo } from "react";
import featuresData from "./data/features-data.json";
import milestoneData from "./data/milestone-logs.json";
import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";

function StatCard({
  icon,
  value,
  label,
  color,
}: {
  icon: React.ReactNode;
  value: number | string;
  label: string;
  color?: string;
}) {
  return (
    <Paper elevation={1} sx={{ p: 3, flex: 1 }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            background: color || "#e3f2fd",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
          }}
        >
          {icon}
        </Box>
        <Stack>
          <Typography variant="h5" fontWeight={700}>
            {value}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            {label}
          </Typography>
        </Stack>
      </Stack>
    </Paper>
  );
}

const CardGrid = styled("div")(() => ({
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(240px, 1fr))",
  gap: 16,
}));

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Paper elevation={1} sx={{ p: 3 }}>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
        {title}
      </Typography>
      {children}
    </Paper>
  );
}

function Overview() {
  const meta = useMemo(
    () => ({
      version: "v1.2.0",
      overallProgress: 85,
      startedOn: "2024-01-01",
      lastUpdate: "2024-12-19",
      stats: {
        completed: featuresData.sections[1].features.length,
        inProgress: featuresData.sections[0].features.length,
        futureEnhancement: featuresData.sections[2].features.length,
        milestones: milestoneData.versions.length,
      },
    }),
    []
  );
  return (
    <Stack spacing={2}>
      <CardGrid>
        <StatCard
          icon={"✅"}
          value={meta.stats.completed}
          label="Completed Features"
          color="#E8F5E9"
        />
        <StatCard
          icon={"🕒"}
          value={meta.stats.inProgress}
          label="In Progress"
          color="#FFF3E0"
        />
        <StatCard
          icon={"📅"}
          value={meta.stats.futureEnhancement}
          label="Future enhancements"
          color="#E3F2FD"
        />
        <StatCard
          icon={"🔁"}
          value={meta.stats.milestones}
          label="Milestones"
          color="#F3E5F5"
        />
      </CardGrid>

      <Section title="About the Project">
        <Typography variant="body2" sx={{ mb: 1 }}>
          A personal finance web application that helps track income, expenses,
          budgets, and investment contributions in one platform. Built with
          React, TypeScript, and Node.js.
        </Typography>
      </Section>
    </Stack>
  );
}

export default Overview;
