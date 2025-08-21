import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ProgressBar from "../../components/ProgressBar";
import { WalletType } from "../../constants";
import { formatCurrency } from "../../utils/currencyUtils";
import type { MenuProps } from "@mui/material/Menu";
import Menu from "@mui/material/Menu";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";

interface AccountCardProps {
  title: string;
  chipLabel: string;
  accountType?: string;
  currentAmt: number;
  targetAmt: number;
  remainingAmt: number;
  contributionLimit?: number;
  percentage: number;
  onClickEdit: () => void;
  onClickDelete: () => void;
  showDeleteBtn: boolean;
}

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    minWidth: 150,
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    color: "rgb(55, 65, 81)",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
  },
  "& .MuiMenuItem-root": {
    "& .MuiSvgIcon-root": {
      fontSize: 20,
      color: theme.palette.text.secondary,
      marginRight: theme.spacing(1.5),
    },
  },
}));

const AccountCard = ({
  title,
  chipLabel,
  accountType,
  currentAmt,
  targetAmt,
  remainingAmt,
  contributionLimit,
  percentage,
  onClickEdit,
  onClickDelete,
  showDeleteBtn,
}: AccountCardProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickEdit = () => {
    handleClose();
    onClickEdit();
  };

  const handleClickDelete = () => {
    handleClose();
    onClickDelete();
  };

  let alertSeverity: "success" | "error" | undefined;
  let alertMessage: string | undefined;

  if (percentage >= 100) {
    alertSeverity = "success";
    alertMessage = "You have reached 100% of your limit.";
  } else if (percentage >= 80) {
    alertSeverity = "error";
    alertMessage = "Only a little left to reach your goal!";
  }

  const icon =
    chipLabel.toLowerCase() === "joint" ? (
      <PeopleOutlineIcon />
    ) : (
      <PersonOutlineIcon />
    );

  return (
    <Card
      elevation={0}
      sx={{
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "rgba(204, 204, 204, 0.8)",
        borderRadius: 4,
      }}
    >
      <Stack p={2} spacing={1}>
        <Stack
          direction="row"
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Stack
            direction="row"
            spacing={2}
            sx={{
              alignItems: "center",
            }}
          >
            <Typography variant="h6">{title}</Typography>
            <Chip
              variant="outlined"
              icon={icon}
              label={chipLabel}
              color="primary"
              size="small"
              sx={{ borderRadius: "8px", pr: 1, pl: 1, opacity: 0.8 }}
            />
          </Stack>
          <>
            <IconButton onClick={handleClick}>
              <MoreHorizIcon />
            </IconButton>
            <StyledMenu anchorEl={anchorEl} open={open} onClose={handleClose}>
              <MenuItem onClick={handleClickEdit} disableRipple>
                <EditIcon />
                Edit
              </MenuItem>
              {showDeleteBtn && (
                <MenuItem onClick={handleClickDelete} disableRipple>
                  <DeleteIcon />
                  Delete
                </MenuItem>
              )}
            </StyledMenu>
          </>
        </Stack>
        <Stack spacing={1}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="subtitle2">
              Current: {formatCurrency(currentAmt)}
            </Typography>
            <Typography variant="subtitle2">
              {accountType === WalletType.INVESTMENT &&
              contributionLimit &&
              targetAmt
                ? `Contribution Limit: ${formatCurrency(contributionLimit)}`
                : `Target: ${formatCurrency(targetAmt)}`}
            </Typography>
          </Stack>

          <ProgressBar value={percentage} />

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="subtitle2">
              {accountType === WalletType.INVESTMENT &&
              contributionLimit &&
              targetAmt
                ? `${percentage}% complete of annual limit ($${targetAmt})`
                : `${percentage}% complete`}
            </Typography>
            <Typography variant="subtitle2">
              {formatCurrency(remainingAmt)} Remaining
            </Typography>
          </Stack>
        </Stack>
        {accountType === WalletType.INVESTMENT && percentage >= 80 && (
          <Alert
            severity={alertSeverity}
            variant="outlined"
            sx={{ p: "0 16px" }}
          >
            {alertMessage}
          </Alert>
        )}
      </Stack>
    </Card>
  );
};

export default AccountCard;
