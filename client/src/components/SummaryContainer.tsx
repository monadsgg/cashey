import Stack from "@mui/material/Stack";

interface SummaryContainerProps {
  children: React.ReactNode;
}

function SummaryContainer({ children }: SummaryContainerProps) {
  return (
    <Stack
      spacing={3}
      flex={1}
      sx={{
        width: 400,
        border: "1px solid #ccc",
        p: 4,
        borderRadius: 4,
      }}
    >
      {children}
    </Stack>
  );
}

export default SummaryContainer;
