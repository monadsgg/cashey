import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { getMonth } from "../utils/dateUtils";
import { getYear } from "date-fns";

interface MonthNavigationHeaderProps {
  currentDate: Date | string;
  goToPrevMonth: () => void;
  goToNextMonth: () => void;
}

function MonthNavigationHeader({
  currentDate,
  goToNextMonth,
  goToPrevMonth,
}: MonthNavigationHeaderProps) {
  return (
    <Stack direction="row" sx={{ alignItems: "center" }}>
      <Tooltip title="Previous month">
        <NavigateBeforeIcon onClick={goToPrevMonth} />
      </Tooltip>
      <Typography variant="h4">
        {getMonth(currentDate, "MMM")} {getYear(currentDate)}
      </Typography>
      <Tooltip title="Next month">
        <NavigateNextIcon onClick={goToNextMonth} />
      </Tooltip>
    </Stack>
  );
}

export default MonthNavigationHeader;
