import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

interface DatePickerFieldProps {
  value: Date;
  onChange: (newValue: Date) => void;
}

function DatePickerField({ value, onChange }: DatePickerFieldProps) {
  return (
    <Stack sx={{ marginBottom: 2 }}>
      <Typography variant="subtitle1">Date</Typography>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DesktopDatePicker
          value={value}
          onChange={(newValue) => {
            if (newValue !== null) onChange(newValue);
          }}
          slotProps={{
            textField: {
              size: "small",
              fullWidth: true,
              variant: "outlined",
            },
          }}
        />
      </LocalizationProvider>
    </Stack>
  );
}

export default DatePickerField;
