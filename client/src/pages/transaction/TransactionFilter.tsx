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
import Alert from "@mui/material/Alert";
import ListSubheader from "@mui/material/ListSubheader";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import DatePickerField from "../../components/DatePickerField";
import {
  getTimeframeOptions,
  type TimeframeOption,
} from "../../utils/timeFrame";
import { useCategories } from "../../hooks/categories/useCategories";
import { useTags } from "../../hooks/tags/useTags";
import type { FilterCriteria } from "./Transaction";
import { formatDate, getZonedDate } from "../../utils/date";
import {
  FILTER_GROUPS,
  RULE_OPERATORS,
  getDefaultRuleForType,
  getFilterLabel,
} from "../../utils/filter";
import { FilterRuleType } from "../../constants";

interface TransactionFilterProps {
  filters: FilterCriteria[] | null;
  onClose: () => void;
  onAddFilter: () => void;
  onChangeFilter: (item: FilterCriteria) => void;
  onChangeFilterRule: (id: string, e: SelectChangeEvent) => void;
  onChangeFilterValue: (id: string, val: string) => void;
  onDuplicateFilter: (id: string) => void;
  onRemoveFilter: (id: string) => void;
  onApplyFilters: (timeFrame: TimeframeOption) => void;
  selectedTimeFrame: TimeframeOption | null;
}

type CustomDate = {
  from: string | Date;
  to: string | Date;
};

function TransactionFilter({
  onClose,
  onAddFilter,
  filters,
  onChangeFilter,
  onChangeFilterRule,
  onChangeFilterValue,
  onApplyFilters,
  onRemoveFilter,
  onDuplicateFilter,
  selectedTimeFrame,
}: TransactionFilterProps) {
  const timeframeOptions: TimeframeOption[] = getTimeframeOptions();
  const [timeframe, setTimeframe] = useState<TimeframeOption>(
    selectedTimeFrame ?? timeframeOptions[0]
  );
  const [customDate, setCustomDate] = useState<CustomDate>({
    from: selectedTimeFrame?.from ?? new Date(),
    to: selectedTimeFrame?.to ?? new Date(),
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
    const type = e.target.value;

    const filter = {
      id,
      type,
      rule: getDefaultRuleForType(type),
      value: FILTER_VALUE_OPTIONS[type]?.[0].value ?? "",
    };

    onChangeFilter(filter);
  };

  const handleApplyFilters = () => {
    const selectedTimeFrame = { ...timeframe };

    if (selectedTimeFrame.value === "custom") {
      selectedTimeFrame.from = formatDate(customDate.from);
      selectedTimeFrame.to = formatDate(customDate.to);
    }

    // TODO: handle ALL-TIME option (how to get startdate?)

    onApplyFilters(selectedTimeFrame);
    onClose();
  };

  const handleChangeTimeFrame = (e: SelectChangeEvent) => {
    const selected = e.target.value;
    const timeFrame = timeframeOptions.find((t) => t.value === selected);
    if (timeFrame) setTimeframe(timeFrame);
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
            Match any of the following filters:
          </Box>
          <Divider />
          {filters &&
            filters.map((filter) => {
              const operators =
                RULE_OPERATORS[filter.type] || RULE_OPERATORS["search"] || null;
              const valueOptions = FILTER_VALUE_OPTIONS[filter.type] || [];

              return (
                <Stack
                  key={filter.id}
                  direction="row"
                  mt={2}
                  bgcolor="#efefefff"
                  spacing={2}
                  borderRadius={2}
                  p={2}
                  alignItems="center"
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
                    <MenuItem disabled={filters.length > 1} value="search">
                      General search
                    </MenuItem>
                    {groupedOptions}
                  </Select>

                  {/* Only show the rules and value field if filter is selected */}
                  {filter.type && filter.type !== "Choose filter" && (
                    <>
                      {/* Rule selector */}
                      <Select
                        value={filter.rule}
                        onChange={(e) => onChangeFilterRule(filter.id, e)}
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
                      {filter.rule === FilterRuleType.is ||
                      filter.rule === FilterRuleType.isNot ? (
                        <Select
                          value={filter.value || ""}
                          onChange={(e) =>
                            onChangeFilterValue(
                              filter.id,
                              String(e.target.value)
                            )
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
                            onChangeFilterValue(filter.id, e.target.value)
                          }
                          placeholder="Enter value..."
                          sx={{ width: 220 }}
                        />
                      )}
                    </>
                  )}

                  <Stack direction="row">
                    <IconButton onClick={() => onDuplicateFilter(filter.id)}>
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                    <IconButton onClick={() => onRemoveFilter(filter.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </Stack>
              );
            })}

          <Button variant="outlined" onClick={onAddFilter} sx={{ width: 200 }}>
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
                value={timeframe.value}
                onChange={handleChangeTimeFrame}
                size="small"
                sx={{ width: 200 }}
              >
                {timeframeOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </Stack>

            {timeframe.value === "custom" && (
              <Stack direction="row" mt={2} spacing={2}>
                <DatePickerField
                  name="from"
                  label="from"
                  value={getZonedDate(customDate.from)}
                  onChange={handleChangeCustomDate}
                />
                <DatePickerField
                  name="to"
                  label="to"
                  value={getZonedDate(customDate.to)}
                  onChange={handleChangeCustomDate}
                />
              </Stack>
            )}
          </Box>
          <Alert severity="info">
            Duplicate fields will be overridden by the latest selection.
          </Alert>
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
          disabled={!filters?.[0]?.value}
        >
          Apply Filters
        </Button>
      </DialogActions>
    </>
  );
}

export default TransactionFilter;
