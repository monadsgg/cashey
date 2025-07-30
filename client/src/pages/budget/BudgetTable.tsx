import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useBudgets } from "../../hooks/budget/useBudgets";
import { getMonth, getYear } from "../../utils/dateUtils";
import type { BudgetItem } from "../../services/budget";

const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#F3F3F5",
    color: "#A8AEB6",
    fontSize: 15,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    padding: "8px 16px",
  },
}));

interface BudgetTableProps {
  currentDate: Date;
  onClickEditBtn: (item: BudgetItem) => void;
  onClickDeleteBtn: (id: number) => void;
}

function BudgetTable({
  currentDate,
  onClickEditBtn,
  onClickDeleteBtn,
}: BudgetTableProps) {
  const month = Number(getMonth(currentDate, "M"));
  const year = Number(getYear(currentDate));
  const { budgets, isLoading } = useBudgets(month, year);

  const renderTableHeader = () => {
    return (
      <>
        <StyledTableCell>Category</StyledTableCell>
        <StyledTableCell>Budget</StyledTableCell>
        <StyledTableCell>Actual Spend</StyledTableCell>
        <StyledTableCell>Left to Spend</StyledTableCell>
        <StyledTableCell>Progress</StyledTableCell>
        <StyledTableCell>Status</StyledTableCell>
        <StyledTableCell>Action</StyledTableCell>
      </>
    );
  };

  const renderTableBody = () => {
    if (!isLoading && budgets.length === 0)
      return (
        <TableRow>
          <TableCell colSpan={6} align="center">
            No budgets created yet.
          </TableCell>
        </TableRow>
      );

    return (
      <>
        {budgets.map((item: BudgetItem) => (
          <TableRow key={item.id}>
            <StyledTableCell>{item.category.name}</StyledTableCell>
            <StyledTableCell>{item.amountLimit}</StyledTableCell>
            <StyledTableCell>{item.amountSpent}</StyledTableCell>
            <StyledTableCell>{item.amountLeft}</StyledTableCell>
            <StyledTableCell>Progress here</StyledTableCell>
            <StyledTableCell>Status here</StyledTableCell>
            <StyledTableCell>
              <IconButton onClick={() => onClickEditBtn(item)}>
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton onClick={() => onClickDeleteBtn(item.id)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </StyledTableCell>
          </TableRow>
        ))}
      </>
    );
  };

  return (
    <Paper
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>{renderTableHeader()}</TableRow>
          </TableHead>
          <TableBody>{renderTableBody()}</TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default BudgetTable;
