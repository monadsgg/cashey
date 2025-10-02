import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

interface DatePickerFieldProps {
  name?: string;
  label?: string;
  value: Date;
  onChange: (newValue: Date, name?: string) => void;
  disabled?: boolean;
}

function DatePickerField({
  name,
  label = "Date",
  value,
  onChange,
  disabled,
}: DatePickerFieldProps) {
  return (
    <Stack sx={{ marginBottom: 2 }}>
      <Typography variant="subtitle1">{label}</Typography>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DesktopDatePicker
          disabled={disabled}
          value={value}
          onChange={(newValue) => {
            if (newValue !== null) onChange(newValue, name);
          }}
          slotProps={{
            textField: {
              size: "small",
              fullWidth: true,
              variant: "outlined",
              name,
            },
          }}
        />
      </LocalizationProvider>
    </Stack>
  );
}

export default DatePickerField;
