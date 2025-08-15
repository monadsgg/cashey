import { useState } from "react";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { Tag } from "../../services/tags";
import { useTags } from "../../hooks/tags/useTags";
import { useAddTag } from "../../hooks/tags/useAddTag";
import { TAG_DEFAULT_COLOR } from "../../constants";
import Chip from "@mui/material/Chip";

interface TransactionTagProps {
  label: string;
  selectedValue: Tag[] | [];
  onChange: (value: Tag[]) => void;
}

type TagOptionType = Tag | { inputValue?: string; name: string };

const filter = createFilterOptions<TagOptionType>({
  matchFrom: "start",
});

function TransactionTagField({
  label,
  selectedValue,
  onChange,
}: TransactionTagProps) {
  const [inputValue, setInputValue] = useState("");
  const [value, setValue] = useState<TagOptionType[] | []>(selectedValue || []);
  const [open, setOpen] = useState(false);
  const { tags } = useTags();
  const addTagMutation = useAddTag();

  const handleChange = async (
    _event: React.SyntheticEvent,
    newValue: (string | TagOptionType)[]
  ) => {
    let finalValues: Tag[] = [];

    for (const option of newValue) {
      if (
        typeof option === "string" ||
        ("inputValue" in option && option.inputValue)
      ) {
        const name = typeof option === "string" ? option : option.inputValue!;

        // Create Tag
        const result = await addTagMutation.mutateAsync({
          name,
          color: TAG_DEFAULT_COLOR,
        });
        finalValues.push(result);
      } else {
        finalValues.push(option as Tag);
      }
    }
    setValue(finalValues);
    onChange(finalValues);
  };

  return (
    <Stack sx={{ marginBottom: 2 }}>
      <Typography variant="subtitle1">{label}</Typography>
      <Autocomplete
        id="tag-autocomplete-field"
        multiple
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

          const isExisting = [...opts].some(
            (option) =>
              typeof option !== "string" &&
              "name" in option &&
              option.name.toLowerCase() === inputValue.toLowerCase()
          );

          if (inputValue !== "" && !isExisting) {
            filtered.push({
              inputValue,
              name: `Add "${inputValue}" Tag`,
            });
          }

          return filtered as TagOptionType[];
        }}
        selectOnFocus
        clearOnBlur
        blurOnSelect
        disableClearable
        handleHomeEndKeys
        options={[...tags] as TagOptionType[]}
        isOptionEqualToValue={(option, value) => {
          if ("id" in option && "id" in value) {
            return option.id === value.id;
          } else {
            return option.name === value.name;
          }
        }}
        renderValue={(values, getItemProps) =>
          values.map((option, index) => {
            const { key, ...itemProps } = getItemProps({ index });

            return (
              <Chip
                key={key}
                label={typeof option === "string" ? option : option.name}
                sx={{ backgroundColor: TAG_DEFAULT_COLOR, minWidth: "60px" }}
                variant="filled"
                size="small"
                {...itemProps}
              />
            );
          })
        }
        getOptionLabel={(option) => {
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
            name={label.toLowerCase()}
            hiddenLabel
            variant="outlined"
            size="small"
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

export default TransactionTagField;
