import { useState } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import FormDialog from "../../../components/FormDialog";
import PayeeForm, { type PayeeFormData } from "./PayeeForm";
import ConfirmDialog from "../../../components/ConfirmDialog";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { usePayees } from "../../../hooks/payees/usePayees";
import type { Payee } from "../../../services/payees";
import { useDeletePayee } from "../../../hooks/payees/useDeletePayee";

type ConfirmDeleteData = {
  id: null | number;
  openDialog: boolean;
};

function Payees() {
  const [openForm, setOpenForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PayeeFormData | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<ConfirmDeleteData>({
    id: null,
    openDialog: false,
  });
  const { payees } = usePayees();
  const deletePayeeMutation = useDeletePayee();

  const handleOpenForm = () => {
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setTimeout(() => setSelectedItem(null), 300);
  };

  const handleCloseConfirmDialog = () => {
    setConfirmDelete({ id: null, openDialog: false });
  };

  const handleOnClickEditBtn = (item: Payee) => {
    setSelectedItem(item);
    handleOpenForm();
  };

  const handleOnDeleteItem = () => {
    if (!confirmDelete.id) return;
    deletePayeeMutation.mutate(confirmDelete.id);
    handleCloseConfirmDialog();
  };

  const handleOnClickDeleteBtn = (id: number) => {
    setConfirmDelete({ id, openDialog: true });
  };

  const renderPayeeList = () => {
    if (!payees.length) {
      return (
        <Typography mt={5} sx={{ textAlign: "center" }}>
          No payee to display.
        </Typography>
      );
    }

    return payees.map((p: Payee) => (
      <Box
        key={p.id}
        sx={{
          p: 1,
          borderRadius: 2,
          border: "1px solid #ccc",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          transition: "background 0.2s",
          "&:hover .actions": { opacity: 1 },
        }}
      >
        <Typography sx={{ fontSize: 15, fontWeight: 500 }}>{p.name}</Typography>
        <Box
          className="actions"
          sx={{ opacity: 0, transition: "opacity 0.2s" }}
        >
          <IconButton size="small" onClick={() => handleOnClickEditBtn(p)}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => handleOnClickDeleteBtn(p.id)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    ));
  };

  return (
    <>
      <Stack spacing={3}>
        <Stack>
          <Typography>Payees</Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            All payees from your transaction history. You can update how they
            appear in the app or delete ones you don't use anymore.
          </Typography>
        </Stack>
        <Stack
          spacing={1}
          sx={{
            height: "65vh",
            overflow: "auto",
            pr: 1,
          }}
        >
          {renderPayeeList()}
        </Stack>
      </Stack>

      <FormDialog
        title={`Edit payee`}
        onClose={handleCloseForm}
        open={openForm}
      >
        <PayeeForm selectedItem={selectedItem} onClose={handleCloseForm} />
      </FormDialog>

      <ConfirmDialog
        title="Payee"
        open={confirmDelete.openDialog}
        onClose={handleCloseConfirmDialog}
        onClickDelete={handleOnDeleteItem}
      />
    </>
  );
}

export default Payees;
