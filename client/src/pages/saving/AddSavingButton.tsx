import { useState } from "react";
import Button from "@mui/material/Button";
import FormDialog from "../../components/FormDialog";
import SavingsForm from "./SavingsForm";

function AddSavingButton() {
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
        Add Savings
      </Button>
      <FormDialog open={open} onClose={handleClose}>
        <SavingsForm onClose={handleClose} />
      </FormDialog>
    </>
  );
}

export default AddSavingButton;
