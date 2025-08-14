import { useState } from "react";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { Payee } from "../../services/payees";
import { usePayees } from "../../hooks/payees/usePayees";
import { useAddPayee } from "../../hooks/payees/useAddPayee";

interface TransactionPayeeProps {
  label: string;
  selectedValue: Payee | null;
  onChange: (value: Payee) => void;
}

interface PayeeOptionType {
  inputValue?: string;
  name: string;
  id?: number;
}

type OptionType = string | Payee | PayeeOptionType;

const filter = createFilterOptions<OptionType>({
  matchFrom: "start",
});

function TransactionPayeeField({
  label,
  selectedValue,
  onChange,
}: TransactionPayeeProps) {
  const [inputValue, setInputValue] = useState("");
  const [value, setValue] = useState<Payee | PayeeOptionType | null>(
    selectedValue ?? null
  );
  const [open, setOpen] = useState(false);
  const { payees } = usePayees();
  const addPayeeMutation = useAddPayee();

  const handleChange = async (
    _event: React.SyntheticEvent,
    newValue: OptionType | null
  ) => {
    if (!newValue) {
      setValue(null);
      return;
    }

    if (
      typeof newValue === "string" ||
      ("inputValue" in newValue && newValue.inputValue)
    ) {
      const name =
        typeof newValue === "string" ? newValue : newValue.inputValue!;

      setValue({ ...value, name });

      // Create payee
      const result = await addPayeeMutation.mutateAsync({ name });
      onChange(result);
    } else {
      if (!newValue.id) return;
      setValue(newValue);
      onChange({ id: newValue.id, name: newValue.name });
    }
  };

  return (
    <Stack sx={{ marginBottom: 2 }}>
      <Typography variant="subtitle1">{label}</Typography>
      <Autocomplete
        autoHighlight
        open={open}
        onOpen={() => {
          if (inputValue.trim() !== "") {
            setOpen(true);
          }
        }}
        onClose={() => setOpen(false)}
        value={value}
        onChange={handleChange}
        filterOptions={(opts, params) => {
          const filtered = filter(opts, params);
          const { inputValue } = params;

          const isExisting = opts.some(
            (option) =>
              typeof option !== "string" &&
              "name" in option &&
              option.name.toLowerCase() === inputValue.toLowerCase()
          );

          if (inputValue !== "" && !isExisting) {
            filtered.push({
              inputValue,
              name: `Add "${inputValue}" payee`,
            });
          }

          return filtered;
        }}
        selectOnFocus
        clearOnBlur
        blurOnSelect
        handleHomeEndKeys
        options={payees}
        getOptionLabel={(option: string | Payee | PayeeOptionType) => {
          if (typeof option === "string") {
            return option;
          }

          // Add [name] option
          if ("inputValue" in option && option.inputValue) {
            return option.name;
          }

          return option.name;
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            name={label.toLocaleLowerCase()}
            hiddenLabel
            variant="outlined"
          />
        )}
        inputValue={inputValue}
        onInputChange={(_event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        freeSolo
      />
    </Stack>
  );
}

export default TransactionPayeeField;
