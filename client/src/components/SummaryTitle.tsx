import Typography from "@mui/material/Typography";

interface SummaryTitleProps {
  title: string;
}

function SummaryTitle({ title }: SummaryTitleProps) {
  return (
    <Typography
      variant="subtitle1"
      sx={{ textTransform: "uppercase", textAlign: "center" }}
    >
      {title}
    </Typography>
  );
}

export default SummaryTitle;
