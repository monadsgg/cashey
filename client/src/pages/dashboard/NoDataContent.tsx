import Box from "@mui/material/Box";
import charts_illustration from "../../assets/charts illustration.svg";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

function NoDataContent() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 3,
      }}
    >
      <img src={charts_illustration} width="500px" alt="charts illustration" />
      <Stack sx={{ alignItems: "center" }}>
        <Typography variant="body1" sx={{ mt: "10px" }}>
          No data available for this month.
        </Typography>
        <Typography variant="body1" sx={{ mt: "10px" }}>
          Add transactions and budget data to generate spending reports and
          charts.
        </Typography>
      </Stack>
    </Box>
  );
}

export default NoDataContent;
