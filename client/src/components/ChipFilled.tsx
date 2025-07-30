import Chip from "@mui/material/Chip";

interface ChipFilledProps {
  label: string;
  textColor: string;
  bgColor: string;
}

function ChipFilled({ label, textColor, bgColor }: ChipFilledProps) {
  return (
    <Chip
      variant="filled"
      label={label}
      sx={{
        width: "100px",
        borderRadius: "6px",
        padding: 0,
        height: "25px",
        fontWeight: 500,
        color: `${textColor}`,
        backgroundColor: `${bgColor}`,
      }}
    />
  );
}

export default ChipFilled;
