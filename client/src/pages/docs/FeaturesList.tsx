import type { ReactNode } from "react";
import { Box, Chip, Paper, Stack, Typography } from "@mui/material";
import data from "./data/features-data.json";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

export interface Feature {
  title: string;
  description: string;
  tags: string[];
}

type Status = "completed" | "in progress" | "future enhancements";

export interface FeatureSection {
  title: string;
  icon: string;
  color: string;
  status: Status;
  statusColor: string;
  statusTextColor: string;
  features: Feature[];
}

export interface FeaturesData {
  sections: FeatureSection[];
}

interface FeatureCardProps {
  title: string;
  description: string;
  status: Status;
  statusColor: string;
  statusTextColor: string;
  tags: string[];
}

const featuresData = data as FeaturesData;

function FeatureCard({
  title,
  description,
  status,
  statusColor,
  statusTextColor,
  tags,
}: FeatureCardProps) {
  return (
    <Paper elevation={1} sx={{ p: 3 }}>
      <Stack>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Typography
            variant="subtitle1"
            fontWeight={600}
            sx={{ color: "#000" }}
          >
            {title}
          </Typography>
          <Stack direction="row" spacing={1}>
            <Chip
              label={status}
              size="small"
              sx={{
                backgroundColor: statusColor,
                color: statusTextColor,
                fontWeight: 500,
              }}
            />
            {tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                variant="outlined"
                sx={{ fontWeight: 500 }}
              />
            ))}
          </Stack>
        </Stack>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          {description}
        </Typography>
      </Stack>
    </Paper>
  );
}

export default function FeaturesList() {
  function getIcon(status: Status, color: string) {
    const iconSxProps = { mr: 1, color };

    const icons: Record<Status, ReactNode> = {
      completed: <CheckCircleOutlineIcon sx={iconSxProps} />,
      "in progress": <AccessAlarmIcon sx={iconSxProps} />,
      "future enhancements": <CalendarMonthIcon sx={iconSxProps} />,
    };

    return icons[status];
  }

  return (
    <Stack spacing={4}>
      {featuresData.sections.map((section: FeatureSection, idx) => {
        return (
          <Box key={idx}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: "flex", alignItems: "center" }}
            >
              {getIcon(section.status, section.color)}
              {section.title} ({section.features.length})
            </Typography>

            <Stack spacing={2}>
              {section.features.map((feature, i) => (
                <FeatureCard
                  key={i}
                  title={feature.title}
                  description={feature.description}
                  tags={feature.tags}
                  status={section.status}
                  statusColor={section.statusColor}
                  statusTextColor={section.statusTextColor}
                />
              ))}
            </Stack>
          </Box>
        );
      })}
    </Stack>
  );
}
