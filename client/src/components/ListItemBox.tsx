import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { alpha } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import type { Category } from "../services/categories";
import type { Tag } from "../services/tags";

interface ListItemBoxProps {
  item: Category | Tag;
  onClickEdit: (item: Category | Tag) => void;
  onClickDelete: (id: number) => void;
}

function ListItemBox({ item, onClickEdit, onClickDelete }: ListItemBoxProps) {
  return (
    <Box
      key={item.id}
      sx={{
        p: 2,
        borderRadius: 2,
        backgroundColor: alpha(item.color, 0.15),
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        transition: "background 0.2s",
        "&:hover .actions": { opacity: 1 },
      }}
    >
      <Typography sx={{ color: item.color, fontSize: 15, fontWeight: 500 }}>
        {item.name}
      </Typography>
      <Box className="actions" sx={{ opacity: 0, transition: "opacity 0.2s" }}>
        <IconButton size="small" onClick={() => onClickEdit(item)}>
          <EditIcon sx={{ color: item.color }} fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={() => onClickDelete(item.id)}>
          <DeleteIcon sx={{ color: item.color }} fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
}

export default ListItemBox;
