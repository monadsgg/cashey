import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import SpendingByCategoryList from "./SpendingByCategoryList";
import Box from "@mui/material/Box";
import CategorySpendingChart from "./CategorySpendingChart";

interface SpendingByCategoryWidgetProps {
  data: {
    id: number;
    name: string;
    amount: number;
    color: string;
  }[];
}

function SpendingByCategoryWidget({ data }: SpendingByCategoryWidgetProps) {
  return (
    <Paper elevation={1} sx={{ p: 4, width: "50%" }}>
      <Typography sx={{ textAlign: "center", fontWeight: 600 }}>
        Spending By Category
      </Typography>
      <Typography sx={{ textAlign: "center", opacity: 0.6 }}>
        This month's expense breakdown
      </Typography>

      <Stack
        direction="column-reverse"
        spacing={6}
        sx={{ p: 6, alignItems: "center" }}
      >
        <SpendingByCategoryList data={data} />
        <Box
          sx={{
            width: "40%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <CategorySpendingChart data={data} />
        </Box>
      </Stack>
    </Paper>
  );
}

export default SpendingByCategoryWidget;
