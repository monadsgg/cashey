import { Box, Stack, Typography } from "@mui/material";

interface ChangelogSectionProps {
  title: string;
  color: string;
  icon: React.ReactNode;
  items: string[];
}

export function ChangelogSection({
  title,
  color,
  icon,
  items,
}: ChangelogSectionProps) {
  if (!items.length) return null;

  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
        <span style={{ color }}>{icon}</span>
        <Typography variant="subtitle1" fontWeight={600} sx={{ color }}>
          {title}
        </Typography>
      </Stack>

      <Stack component="ul" spacing={0.5} sx={{ pl: 2, m: 0 }}>
        {items.map((item, index) => (
          <Typography
            key={index}
            component="li"
            variant="body2"
            sx={{ opacity: 0.8 }}
          >
            {item}
          </Typography>
        ))}
      </Stack>
    </Box>
  );
}
