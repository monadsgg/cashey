import { useState } from "react";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

export type TransactionTableSettingsType = {
  tag: boolean;
  payee: boolean;
};

interface TransactionTableSettingsProps {
  settings: TransactionTableSettingsType;
  onChange: (setting: TransactionTableSettingsType) => void;
}

function TransactionTableSettings({
  settings,
  onChange,
}: TransactionTableSettingsProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    const newSettings = { ...settings, [name]: checked };
    onChange(newSettings);
  };
  return (
    <>
      <IconButton
        aria-label="settings"
        color="primary"
        sx={{
          border: "1px solid",
          borderColor: "primary",
          borderRadius: "6px",
          p: "0 10px",
        }}
        onClick={handleClick}
      >
        <SettingsSuggestIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            sx: {
              p: "0 20px",
            },
          },
        }}
      >
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={settings.payee}
                onChange={handleChange}
                name="payee"
              />
            }
            label="Show payee column"
          />
          <FormControlLabel
            control={
              <Switch
                checked={settings.tag}
                onChange={handleChange}
                name="tag"
              />
            }
            label="Show tag column"
          />
        </FormGroup>
      </Menu>
    </>
  );
}

export default TransactionTableSettings;
