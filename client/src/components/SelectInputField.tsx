import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import Stack from "@mui/material/Stack";

interface SelectInputFieldProps {
  name: string;
  label: string;
  value?: string;
  onChange: (e: SelectChangeEvent) => void;
  error?: string;
  children: React.ReactNode;
  disabled?: boolean;
}

function SelectInputField({
  name,
  label,
  value,
  error,
  onChange,
  children,
  disabled,
}: SelectInputFieldProps) {
  return (
    <Stack sx={{ marginBottom: 2 }}>
      <InputLabel
        sx={{ fontSize: 15, textTransform: "uppercase", fontWeight: 600 }}
      >
        {label}
      </InputLabel>
      <FormControl hiddenLabel fullWidth size="small">
        <Select
          variant="outlined"
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
        >
          {children}
        </Select>
        {error && <FormHelperText>{error}</FormHelperText>}
      </FormControl>
    </Stack>
  );
}

export default SelectInputField;
