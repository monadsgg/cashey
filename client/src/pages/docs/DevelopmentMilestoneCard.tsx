import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import BuildIcon from "@mui/icons-material/Build";
import { ChangelogSection } from "./ChangeLogSection";

export interface Version {
  version: string;
  milestoneType: "major" | "minor" | "patch";
  completionDate: string | null;
  added: string[];
  improved: string[];
  fixed: string[];
}

const getMilestoneTypeColor = (type: string) => {
  switch (type) {
    case "major":
      return { bg: "#ffebee", color: "#c62828" };
    case "minor":
      return { bg: "#fff8e1", color: "#f57c00" };
    case "patch":
      return { bg: "#e8f5e9", color: "#2e7d32" };
    default:
      return { bg: "#f5f5f5", color: "#616161" };
  }
};

function DevelopmentMilestoneCard({
  version,
  milestoneType,
  completionDate,
  added,
  improved,
  fixed,
}: Version) {
  const typeColors = getMilestoneTypeColor(milestoneType);

  return (
    <Paper elevation={1} sx={{ p: 3 }}>
      <Stack spacing={2}>
        {/* Header */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Typography variant="h6" fontWeight={700}>
            Version {version}
          </Typography>
          <Stack alignItems="flex-end" spacing={0.5}>
            <Chip
              label={milestoneType}
              size="small"
              sx={{
                backgroundColor: typeColors.bg,
                color: typeColors.color,
                fontWeight: 600,
              }}
            />
            <Typography variant="caption" sx={{ opacity: 0.7 }}>
              {completionDate}
            </Typography>
          </Stack>
        </Stack>

        {/* Content Sections */}
        <Stack spacing={2}>
          {added && added.length > 0 && (
            <ChangelogSection
              title="Added"
              color="#4caf50"
              items={added}
              icon={<AddCircleOutlineIcon sx={{ fontSize: 20 }} />}
            />
          )}

          {improved && improved.length > 0 && (
            <ChangelogSection
              title="Improved"
              color="#ff9800"
              items={improved}
              icon={<ArrowUpwardIcon sx={{ fontSize: 20 }} />}
            />
          )}

          {fixed && fixed.length > 0 && (
            <ChangelogSection
              title="Fixed"
              color="#f44336"
              items={fixed}
              icon={<BuildIcon sx={{ fontSize: 20 }} />}
            />
          )}
        </Stack>
      </Stack>
    </Paper>
  );
}

export default DevelopmentMilestoneCard;
