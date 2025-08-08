import { useState } from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TagForm, { type TagFormData } from "./TagForm";
import FormDialog from "../../../components/FormDialog";
import type { Tag } from "../../../services/tags";
import ConfirmDialog from "../../../components/ConfirmDialog";
import { useTags } from "../../../hooks/tags/useTags";
import Box from "@mui/material/Box";
import ListItemBox from "../../../components/ListItemBox";
import { useDeleteTag } from "../../../hooks/tags/useDeleteTag";

const boxSxProps = {
  width: "100%",
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: 3,
};

type ConfirmDeleteData = {
  id: null | number;
  openDialog: boolean;
};

function Tags() {
  const [openForm, setOpenForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<TagFormData | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<ConfirmDeleteData>({
    id: null,
    openDialog: false,
  });
  const { tags } = useTags();
  const deleteMutation = useDeleteTag();

  const handleOpenForm = () => {
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setTimeout(() => setSelectedItem(null), 300);
  };

  const handleOnClickEditBtn = (item: Tag) => {
    setSelectedItem(item);
    handleOpenForm();
  };

  const handleCloseConfirmDialog = () => {
    setConfirmDelete({ id: null, openDialog: false });
  };

  const handleOnDeleteItem = () => {
    if (!confirmDelete.id) return;
    deleteMutation.mutate(confirmDelete.id);
    handleCloseConfirmDialog();
  };

  const handleOnClickDeleteBtn = (id: number) => {
    setConfirmDelete({ id, openDialog: true });
  };

  const renderTagList = () => {
    if (!tags.length) {
      return (
        <Typography mt={5} sx={{ textAlign: "center" }}>
          No tags to display.
        </Typography>
      );
    }

    return (
      <Box sx={boxSxProps}>
        {tags.map((tag: Tag) => (
          <ListItemBox
            key={tag.id}
            item={tag}
            onClickDelete={handleOnClickDeleteBtn}
            onClickEdit={handleOnClickEditBtn}
          />
        ))}
      </Box>
    );
  };

  return (
    <>
      <Stack spacing={3}>
        <Stack direction="row" sx={{ justifyContent: "space-between" }}>
          <Stack>
            <Typography>Tags</Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Add custom labels to your transactions.
            </Typography>
          </Stack>
          <Button variant="contained" onClick={handleOpenForm}>
            Add Tag
          </Button>
        </Stack>

        <Stack>{renderTagList()}</Stack>
      </Stack>

      <FormDialog
        title={`${selectedItem ? "Edit" : "Add"} tag`}
        onClose={handleCloseForm}
        open={openForm}
      >
        <TagForm selectedItem={selectedItem} onClose={handleCloseForm} />
      </FormDialog>

      <ConfirmDialog
        title="tag"
        open={confirmDelete.openDialog}
        onClose={handleCloseConfirmDialog}
        onClickDelete={handleOnDeleteItem}
      />
    </>
  );
}

export default Tags;
