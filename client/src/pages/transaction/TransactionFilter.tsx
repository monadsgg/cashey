import { useState } from "react";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import DialogContent from "@mui/material/DialogContent";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import ListSubheader from "@mui/material/ListSubheader";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import DatePickerField from "../../components/DatePickerField";
import { useCategories } from "../../hooks/categories/useCategories";
import { useTags } from "../../hooks/tags/useTags";

interface TransactionFilterProps {
  onClose: () => void;
}

type CustomDate = {
  from: Date;
  to: Date;
};

interface FilterCriteria {
  id: string;
  type: string;
  rule: string;
  value: string;
}

const FILTER_GROUPS = {
  field: {
    label: "BY FIELD",
    options: [
      { value: "payee", label: "Payee" },
      { value: "category", label: "Category" },
      { value: "description", label: "Description" },
      { value: "tag", label: "Tag" },
    ],
  },
  amount: {
    label: "BY AMOUNT",
    options: [
      { value: "income", label: "Income" },
      { value: "expense", label: "Expense" },
    ],
  },
};

const RULE_OPERATORS: Record<string, { value: string; label: string }[]> = {
  search: [{ value: "contains", label: "contains" }],
  payee: [
    { value: "contains", label: "contains" },
    { value: "exact", label: "matches exactly" },
  ],
  category: [
    { value: "is", label: "is" },
    { value: "isNot", label: "is not" },
  ],
  description: [
    { value: "contains", label: "contains" },
    { value: "exact", label: "matches exactly" },
  ],
  tag: [
    { value: "is", label: "is" },
    { value: "isNot", label: "is not" },
  ],
  income: [
    { value: "exact", label: "exactly" },
    { value: "greaterThan", label: "greater than" },
    { value: "lessThan", label: "less than" },
  ],
  expense: [
    { value: "exact", label: "exactly" },
    { value: "greaterThan", label: "greater than" },
    { value: "lessThan", label: "less than" },
  ],
};

function getDefaultRuleForType(type: string) {
  const ops = RULE_OPERATORS[type];
  if (ops && ops.length > 0) return ops[0].value;
  return "contains";
}

function getFilterLabel(val: string | undefined) {
  if (!val) return "";
  if (val === "search") return "General search";

  for (const [, group] of Object.entries(FILTER_GROUPS)) {
    const found = group.options.find((o) => o.value === val);
    if (found) return found.label;
  }

  return String(val);
}

// mock data
const TIMEFRAME_OPTIONS = [
  { value: "august2025", label: "August 2025" },
  { value: "september2025", label: "September 2025" },
  { value: "october2025", label: "October 2025" },
  { value: "2025", label: "2025" },
  { value: "2024", label: "2024" },
  { value: "allTime", label: "All Time" },
  { value: "custom", label: "Custom" },
];

function TransactionFilter({ onClose }: TransactionFilterProps) {
  const [matchType, setMatchType] = useState<number>(0);
  const [filters, setFilters] = useState<FilterCriteria[]>([
    {
      id: Date.now().toString(),
      type: "",
      rule: "",
      value: "",
    },
  ]);
  const [timeframe, setTimeframe] = useState<string>(
    TIMEFRAME_OPTIONS[0].value
  );
  const [customDate, setCustomDate] = useState<CustomDate>({
    from: new Date(),
    to: new Date(),
  });

  const { categories } = useCategories();
  const { tags } = useTags();

  const FILTER_VALUE_OPTIONS: Record<
    string,
    { value: string; label: string }[]
  > = {
    category: (categories ?? []).map((c) => ({
      value: c.id.toString(),
      label: c.name,
    })),
    tag: (tags ?? []).map((c) => ({ value: c.id.toString(), label: c.name })),
  };

  const handleChangeFilter = (id: string, e: SelectChangeEvent) => {
    const value = e.target.value;
    setFilters((prev) =>
      prev.map((f) =>
        f.id === id
          ? {
              ...f,
              type: value,
              rule: getDefaultRuleForType(value),
              value: FILTER_VALUE_OPTIONS[value]?.[0]?.value ?? "",
            }
          : f
      )
    );
  };

  const handleAddFilter = () => {
    setFilters([
      ...filters,
      {
        id: Date.now().toString(),
        type: "",
        rule: "",
        value: "",
      },
    ]);
  };

  const handleDuplicateFilter = (id: string) => {
    const target = filters.find((f) => f.id === id);
    if (target) {
      setFilters([...filters, { ...target, id: Date.now().toString() }]);
    }
  };

  const handleDeleteFilter = (id: string) => {
    setFilters(filters.filter((f) => f.id !== id));
  };

  const handleChangeRule = (id: string, e: SelectChangeEvent) => {
    const rule = e.target.value;
    setFilters((prev) => prev.map((f) => (f.id === id ? { ...f, rule } : f)));
  };

  const handleChangeValue = (id: string, val: string) => {
    setFilters((prev) =>
      prev.map((f) => (f.id === id ? { ...f, value: val } : f))
    );
  };

  const handleApplyFilters = () => {
    // const payload = {
    //   matchType,
    //   filters,
    //   timeframe,
    //   custom:
    //     timeframe === "custom"
    //       ? { from: customDate.from, to: customDate.to }
    //       : undefined,
    // };
    // console.log("apply filters", payload);
    // onClose();
  };

  const handleChangeCustomDate = (value: Date, name?: string) => {
    if (!name) return;
    setCustomDate({ ...customDate, [name]: value });
  };

  const groupedOptions = Object.entries(FILTER_GROUPS).flatMap(
    ([key, group]) => {
      const header = (
        <ListSubheader key={`header-${key}`} disableSticky>
          {group.label}
        </ListSubheader>
      );
      const items = group.options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ));
      return [header, ...items];
    }
  );

  return (
    <>
      <DialogContent>
        <Stack spacing={2} mt={2}>
          <Box component="div" fontSize={18}>
            Match
            <Select
              value={matchType}
              onChange={(e) => setMatchType(Number(e.target.value))}
              size="small"
              sx={{ ml: 1, mr: 1, p: 0, width: 80 }}
            >
              <MenuItem value={0}>all</MenuItem>
              <MenuItem value={1}>any</MenuItem>
            </Select>
            of the following filters:
          </Box>
          <Divider />
          {filters.map((filter) => {
            const operators =
              RULE_OPERATORS[filter.type] || RULE_OPERATORS["search"] || null;
            const valueOptions = FILTER_VALUE_OPTIONS[filter.type] || [];

            return (
              <Stack
                key={filter.id}
                direction="row"
                mt={2}
                bgcolor="#efefefff"
                spacing={1}
                borderRadius={2}
                p={2}
              >
                <Select
                  value={filter.type || ""}
                  onChange={(e) => handleChangeFilter(filter.id, e)}
                  size="small"
                  displayEmpty
                  sx={{ ml: 1, mr: 1, p: 0, width: 200 }}
                  renderValue={(selected) => {
                    const s = String(selected || "");
                    if (!s) return <em>Choose filter</em>;
                    return getFilterLabel(s);
                  }}
                >
                  <MenuItem disabled value="">
                    <em>Choose Filter</em>
                  </MenuItem>
                  <MenuItem value="search">General search</MenuItem>
                  {groupedOptions}
                </Select>

                {/* Only show the rules and value field if filter is selected */}
                {filter.type && filter.type !== "Choose filter" && (
                  <>
                    {/* Rule selector */}
                    <Select
                      value={filter.rule}
                      onChange={(e) => handleChangeRule(filter.id, e)}
                      size="small"
                      sx={{ width: 220 }}
                    >
                      {operators.map((op) => (
                        <MenuItem key={op.value} value={op.value}>
                          {op.label}
                        </MenuItem>
                      ))}
                    </Select>

                    {/* Value input / select depending on rule */}
                    {filter.rule === "is" || filter.rule === "isNot" ? (
                      <Select
                        value={filter.value || ""}
                        onChange={(e) =>
                          handleChangeValue(filter.id, String(e.target.value))
                        }
                        size="small"
                        sx={{ width: 220 }}
                      >
                        {valueOptions.length > 0 ? (
                          valueOptions.map((opt) => (
                            <MenuItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem disabled value="">
                            No options
                          </MenuItem>
                        )}
                      </Select>
                    ) : (
                      <TextField
                        size="small"
                        value={filter.value}
                        onChange={(e) =>
                          handleChangeValue(filter.id, e.target.value)
                        }
                        placeholder="Enter value..."
                        sx={{ width: 220 }}
                      />
                    )}
                  </>
                )}

                <Stack direction="row">
                  <IconButton onClick={() => handleDuplicateFilter(filter.id)}>
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteFilter(filter.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </Stack>
            );
          })}

          <Button
            variant="outlined"
            onClick={handleAddFilter}
            sx={{ width: 200 }}
          >
            + Add Filter
          </Button>

          <Divider />

          <Box mt={2}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography
                textTransform="uppercase"
                fontSize={16}
                variant="subtitle2"
              >
                Time frame:
              </Typography>
              <Select
                value={timeframe}
                onChange={(e) => setTimeframe(String(e.target.value))}
                size="small"
                sx={{ width: 200 }}
              >
                {TIMEFRAME_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </Stack>

            {timeframe === "custom" && (
              <Stack direction="row" mt={2} spacing={2}>
                <DatePickerField
                  name="from"
                  label="from"
                  value={customDate.from}
                  onChange={handleChangeCustomDate}
                />
                <DatePickerField
                  name="to"
                  label="to"
                  value={customDate.to}
                  onChange={handleChangeCustomDate}
                />
              </Stack>
            )}
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="text" color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleApplyFilters}
          variant="contained"
          color="primary"
        >
          Apply Filters
        </Button>
      </DialogActions>
    </>
  );
}

export default TransactionFilter;
