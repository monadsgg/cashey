import Typography from "@mui/material/Typography";

interface EmptyStateProps {
  message?: string;
}

function EmptyState({ message }: EmptyStateProps) {
  return <Typography mt={4}>{message}</Typography>;
}

export default EmptyState;
