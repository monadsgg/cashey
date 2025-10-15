import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { formatDate } from "../../utils/date";
import { formatCurrency, getAmountSign } from "../../utils/currency";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import type { TransactionTableSettingsType } from "./TransactionTableSettings";
import { transferCategory } from "../../constants";
import type { TransactionItem } from "../../services/transactions";
import { Button, Typography } from "@mui/material";

interface TransactionTableProps {
  transactions: TransactionItem[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onClickEditBtn: (item: TransactionItem) => void;
  onClickDeleteBtn: (id: number) => void;
  settings: TransactionTableSettingsType;
  hasFilter: boolean;
  onResetFilter: () => void;
}

const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#F3F3F5",
    color: "#A8AEB6",
    fontSize: 16,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 15,
  },
}));

function TransactionTable({
  transactions,
  totalCount,
  page = 0,
  totalPages,
  onPageChange,
  onClickEditBtn,
  onClickDeleteBtn,
  settings,
  hasFilter,
  onResetFilter,
}: TransactionTableProps) {
  // console.log("transactions", transactions);
  // console.log("totalCount", totalCount);
  // console.log("totalPages", totalPages);
  // console.log("page", page);

  const handleChangePage = (
    _event: React.ChangeEvent<unknown>,
    newPage: number
  ) => {
    onPageChange(newPage);
  };

  const renderTableHeader = () => {
    return (
      <>
        <StyledTableCell sx={{ width: "15%" }}>Date</StyledTableCell>
        <StyledTableCell sx={{ width: "20%" }}>Description</StyledTableCell>
        <StyledTableCell sx={{ width: "15%" }}>Category</StyledTableCell>
        <StyledTableCell sx={{ width: "10%" }} align="right">
          Amount
        </StyledTableCell>
        {settings.payee && (
          <StyledTableCell sx={{ width: "15%" }}>Payee</StyledTableCell>
        )}
        {settings.tag && (
          <StyledTableCell sx={{ width: "10%" }}>Tag</StyledTableCell>
        )}
        <StyledTableCell sx={{ width: "10%" }}>Action</StyledTableCell>
      </>
    );
  };

  const renderTableBody = () => {
    if (!totalCount)
      return (
        <TableRow>
          <TableCell colSpan={7} align="center">
            {hasFilter ? (
              <Stack>
                <Typography>
                  You have no transaction matching this filter
                </Typography>
                <Button variant="text" onClick={onResetFilter}>
                  Clear filter and show all transactions
                </Button>
              </Stack>
            ) : (
              "No transactions yet."
            )}
          </TableCell>
        </TableRow>
      );

    return (
      <>
        {hasFilter && (
          <TableRow>
            <TableCell colSpan={7} align="center">
              <Stack>
                <Button variant="text" onClick={onResetFilter}>
                  Clear filter and show all transactions
                </Button>
              </Stack>
            </TableCell>
          </TableRow>
        )}

        {transactions.map((item: TransactionItem) => {
          const isBtnDisabled =
            item.category.id === transferCategory.OUTGOING_TRANSFER ||
            item.category.id === transferCategory.INCOMING_TRANSFER;

          return (
            <TableRow key={item.id}>
              <StyledTableCell>
                {formatDate(item.date, "eee, MMM dd")}
              </StyledTableCell>
              <StyledTableCell>{item.description}</StyledTableCell>
              <StyledTableCell>{item.category.name}</StyledTableCell>
              <StyledTableCell align="right">
                {`${getAmountSign(
                  item.category.type,
                  item.isRefund
                )} ${formatCurrency(item.amount)} `}
              </StyledTableCell>
              {settings.payee && (
                <StyledTableCell>
                  {item.payee && item.payee?.name}
                </StyledTableCell>
              )}
              {settings.tag && (
                <StyledTableCell>
                  {item.tags && (
                    <Stack direction="row" spacing={2}>
                      {item.tags.map((t) => (
                        <Chip
                          key={t.id}
                          label={t.name}
                          sx={{
                            minWidth: "60px",
                            backgroundColor: t.color,
                            color: "#fff",
                          }}
                        />
                      ))}
                    </Stack>
                  )}
                </StyledTableCell>
              )}
              <StyledTableCell>
                <IconButton
                  disabled={isBtnDisabled}
                  onClick={() => onClickEditBtn(item)}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton
                  disabled={isBtnDisabled}
                  onClick={() => onClickDeleteBtn(item.id)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </StyledTableCell>
            </TableRow>
          );
        })}
      </>
    );
  };

  const renderPagination = () => {
    if (totalPages < 2) return;
    return (
      <Stack sx={{ p: 1, alignItems: "center" }}>
        <Pagination
          color="primary"
          count={totalPages}
          page={page}
          onChange={handleChangePage}
        />
      </Stack>
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
      {renderPagination()}
    </Paper>
  );
}

export default TransactionTable;
