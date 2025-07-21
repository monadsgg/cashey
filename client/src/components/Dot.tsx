import Box from "@mui/material/Box";

interface DotProps {
  color: string;
}

function Dot({ color }: DotProps) {
  return (
    <Box
      sx={{
        height: "10px",
        width: "10px",
        borderRadius: "50%",
        backgroundColor: color,
      }}
    ></Box>
  );
}

export default Dot;
