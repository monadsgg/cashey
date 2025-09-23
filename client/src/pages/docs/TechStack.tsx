import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Chip, Paper } from "@mui/material";
import data from "./data/techstack.json";

const boxSxProps = {
  width: "100%",
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: 3,
};

interface TechStackData {
  techStack: {
    name: string;
    version: string;
    dotColor: string;
    category: string;
  }[];
  metadata: {
    lastUpdated: string;
    categories: string[];
  };
}

const techStackData = data as TechStackData;

function TechStackCard({
  name,
  category,
  version,
  dotColor,
}: {
  name: string;
  category: string;
  version: string;
  dotColor: string;
}) {
  return (
    <Paper elevation={1} sx={{ p: 2 }}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Box
          sx={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            backgroundColor: dotColor,
          }}
        />
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            {name}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            {category}
          </Typography>
        </Box>
        <Chip
          label={version}
          size="small"
          sx={{
            backgroundColor: "#e3f2fd",
            color: "#1976d2",
            fontWeight: 500,
          }}
        />
      </Stack>
    </Paper>
  );
}

function TechStack() {
  return (
    <Box>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
        Technology Stack
      </Typography>
      <Box sx={boxSxProps}>
        {techStackData.techStack.map((t) => (
          <TechStackCard
            name={t.name}
            category={t.category}
            version={t.version}
            dotColor={t.dotColor}
          />
        ))}
      </Box>
    </Box>
  );
}

export default TechStack;
