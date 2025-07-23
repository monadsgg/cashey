import { useState } from "react";
import Button from "@mui/material/Button";
import FormDialog from "../../components/FormDialog";
import AccountForm from "./AccountForm";

function AddAccountButton() {
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };

  const handleClick = () => {
    setOpen(true);
  };
  return (
    <>
      <Button variant="outlined" onClick={handleClick}>
        Add Accounts
      </Button>
      <FormDialog open={open} onClose={handleClose}>
        <AccountForm onClose={handleClose} />
      </FormDialog>
    </>
  );
}

export default AddAccountButton;
