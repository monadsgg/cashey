import InputLabel from "@mui/material/InputLabel";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

type TextInputFieldProps = {
  label: string;
  value: string | number;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

function TextInputField({
  label,
  value,
  name,
  type = "text",
  placeholder,
  required,
  error,
  helperText,
  onChange,
}: TextInputFieldProps) {
  return (
    <Stack sx={{ marginBottom: 2 }}>
      <InputLabel
        sx={{ fontSize: 15, textTransform: "uppercase", fontWeight: 600 }}
      >
        {label}
      </InputLabel>
      <TextField
        hiddenLabel
        variant="outlined"
        size="small"
        value={value}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        error={error}
        helperText={helperText}
        onChange={onChange}
      />
    </Stack>
  );
}

export default TextInputField;
