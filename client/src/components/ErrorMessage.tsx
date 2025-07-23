import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface ErrorMessageProps {
  message: string;
}

function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <Box
      sx={{ display: "flex", alignContent: "center", justifyContent: "center" }}
    >
      <Typography>Uh-oh! Something went wrong: {message}</Typography>
    </Box>
  );
}

export default ErrorMessage;
