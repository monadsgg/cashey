import InputLabel from "@mui/material/InputLabel";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

type InputFieldProps = {
  label: string;
  value: string | number;
  name: string;
  type: string;
  placeholder?: string;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

function InputField({
  label,
  value,
  name,
  type,
  placeholder,
  required,
  error,
  helperText,
  onChange,
}: InputFieldProps) {
  return (
    <Stack>
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

export default InputField;
