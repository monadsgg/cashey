import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

interface LoadingProps {
  message?: string;
}

function Loading({ message }: LoadingProps) {
  return (
    <Stack alignItems="center" mt={4}>
      <CircularProgress />
      {message && <Typography mt={2}>{message}</Typography>}
    </Stack>
  );
}

export default Loading;
