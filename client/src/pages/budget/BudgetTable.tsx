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
import { getMonth, getYear } from "../../utils/date";
import type { BudgetItem } from "../../services/budget";
import ProgressBar from "../../components/ProgressBar";
import Typography from "@mui/material/Typography";
import { formatCurrency } from "../../utils/currency";
import ChipFilled from "../../components/ChipFilled";
import { red, green, amber, brown } from "@mui/material/colors";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";

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

const paperSxProps = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  overflowY: "auto",
};

interface BudgetTableProps {
  currentDate: Date;
  onClickEditBtn: (item: BudgetItem) => void;
  onClickDeleteBtn: (id: number) => void;
  isCopyProcessing: boolean;
}

type StatusKey = "overBudget" | "warning" | "onTrack";

function BudgetTable({
  currentDate,
  onClickEditBtn,
  onClickDeleteBtn,
  isCopyProcessing,
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

  const statusMap: Record<
    StatusKey,
    { label: string; bgColor: string; textColor: string }
  > = {
    overBudget: { label: "Over budget", bgColor: red[400], textColor: "white" },
    warning: { label: "Warning", bgColor: amber[100], textColor: brown[600] },
    onTrack: {
      label: "On track",
      bgColor: green["A100"],
      textColor: green[900],
    },
  };

  const getBudgetStatus = (percentage: number): StatusKey => {
    if (percentage > 100) return "overBudget";
    if (percentage >= 80 && percentage < 100) return "warning";
    return "onTrack";
  };

  const getStatus = (percentage: number) => {
    const status = getBudgetStatus(percentage);
    const { label, bgColor, textColor } = statusMap[status];

    return <ChipFilled label={label} textColor={textColor} bgColor={bgColor} />;
  };

  const renderTableBody = () => {
    if (isLoading || isCopyProcessing) {
      return (
        <TableRow>
          <TableCell colSpan={7} align="center" sx={{ borderBottom: "none" }}>
            <Stack alignItems="center" mt={4}>
              <CircularProgress />
              <Typography mt={2}>Loading...</Typography>
            </Stack>
          </TableCell>
        </TableRow>
      );
    }

    if (!isLoading && budgets.length === 0)
      return (
        <TableRow>
          <TableCell colSpan={7} align="center">
            No budgets created yet.
          </TableCell>
        </TableRow>
      );

    return (
      <>
        {budgets.map((item: BudgetItem) => {
          const percentage = Math.ceil(
            (item.amountSpent / item.amountLimit) * 100
          );

          const displayPercentage = percentage > 100 ? 100 : percentage;

          return (
            <TableRow key={item.id}>
              <StyledTableCell sx={{ width: "15%" }}>
                {item.category.name}
              </StyledTableCell>
              <StyledTableCell>
                {formatCurrency(item.amountLimit)}
              </StyledTableCell>
              <StyledTableCell>
                {formatCurrency(item.amountSpent)}
              </StyledTableCell>
              <StyledTableCell
                sx={{ color: item.amountLeft < 0 ? red[600] : "unset" }}
              >
                {formatCurrency(item.amountLeft)}
              </StyledTableCell>
              <StyledTableCell>
                <ProgressBar value={displayPercentage} />
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  {displayPercentage}%
                </Typography>
              </StyledTableCell>
              <StyledTableCell>{getStatus(percentage)}</StyledTableCell>
              <StyledTableCell>
                <IconButton onClick={() => onClickEditBtn(item)}>
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton onClick={() => onClickDeleteBtn(item.id)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </StyledTableCell>
            </TableRow>
          );
        })}
      </>
    );
  };

  return (
    <Paper sx={paperSxProps}>
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
