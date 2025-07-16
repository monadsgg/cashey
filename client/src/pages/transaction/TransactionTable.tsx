import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { formatDate } from "../../utils/dateUtils";
import { formatCurrency, getAmountSign } from "../../utils/currencyUtils";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import { transferCategory } from "../app/appConstants";

type TransactionTableProps = {
  transactions: TransactionItem[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onClickActionBtn: (item: TransactionItem) => void;
  settings: TransactionTableSettingsType;
};

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
  onClickActionBtn,
  settings,
}: TransactionTableProps) {
  // console.log("transactions", transactions);
  // console.log("totalCount", totalCount);
  // console.log("totalPages", totalPages);
  // console.log("page", page);

  const handleChangePage = (
    _event: React.ChangeEvent<unknown>,
    newPage: number
  ) => {
    console.log("handleChangePage table", newPage);
    onPageChange(newPage);
  };

  const renderTableHeader = () => {
    return (
      <>
        <StyledTableCell>Date</StyledTableCell>
        <StyledTableCell>Description</StyledTableCell>
        <StyledTableCell>Category</StyledTableCell>
        <StyledTableCell align="right">Amount</StyledTableCell>
        {settings.payee && <StyledTableCell>Payee</StyledTableCell>}
        {settings.tag && <StyledTableCell>Tag</StyledTableCell>}
        <StyledTableCell>Action</StyledTableCell>
      </>
    );
  };

  const handleClickActionBtn = (item: TransactionItem) => {
    onClickActionBtn(item);
  };

  const renderTableBody = () => {
    if (!totalCount)
      return (
        <TableRow>
          <TableCell colSpan={7} align="center">
            No transactions yet.
          </TableCell>
        </TableRow>
      );

    return (
      <>
        {transactions.map((item: TransactionItem) => (
          <TableRow key={item.id}>
            <StyledTableCell>
              {formatDate(item.date, "eee, MMM dd")}
            </StyledTableCell>
            <StyledTableCell>{item.description}</StyledTableCell>
            <StyledTableCell>{item.category.name}</StyledTableCell>
            <StyledTableCell align="right">
              {getAmountSign(item.category.type)}
              {formatCurrency(item.amount)}
            </StyledTableCell>
            {settings.payee && (
              <StyledTableCell>
                {item.payee && item.payee?.name}
              </StyledTableCell>
            )}
            {settings.tag && (
              <StyledTableCell>
                {item.tag && (
                  <Chip
                    label={item.tag?.name}
                    sx={{
                      backgroundColor: "#8cdbc4",
                    }}
                  />
                )}
              </StyledTableCell>
            )}
            <StyledTableCell>
              <IconButton
                disabled={
                  item.category.id === transferCategory.OUTGOING_TRANSFER
                }
                onClick={() => handleClickActionBtn(item)}
              >
                <KeyboardArrowRightIcon />
              </IconButton>
            </StyledTableCell>
          </TableRow>
        ))}
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
