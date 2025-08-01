import { NavLink, useNavigate } from "react-router";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ReceiptIcon from "@mui/icons-material/Receipt";
import SavingsIcon from "@mui/icons-material/Savings";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import CategoryIcon from "@mui/icons-material/Category";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import List from "@mui/material/List";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import { logout } from "../utils/auth";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";

const menu = [
  { text: "Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
  { text: "Transaction", path: "/transactions", icon: <ReceiptIcon /> },
  { text: "Accounts", path: "/accounts", icon: <SavingsIcon /> },
  { text: "Budget", path: "/budget", icon: <AccountBalanceWalletIcon /> },
];

const menuSlotProps = {
  paper: {
    elevation: 0,
    sx: {
      overflow: "visible",
      filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
      mb: 1.5,
      "&::before": {
        content: '""',
        display: "block",
        position: "absolute",
        bottom: 0,
        right: 14,
        width: 10,
        height: 10,
        bgcolor: "background.paper",
        transform: "translateY(50%) rotate(45deg)",
        zIndex: 0,
      },
    },
  },
};

function SideBar() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleClickSettings = () => {
    setAnchorEl(null);
    navigate("/settings");
  };

  const getUserName = () => {
    const user = localStorage.getItem("user");
    if (!user) return "";

    return JSON.parse(user).name;
  };

  return (
    <>
      <Paper
        elevation={2}
        sx={{
          width: "20%",
          p: 4,
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Stack spacing={1}>
          <Typography sx={{ textAlign: "center" }} variant="h3" color="primary">
            Cashey.
          </Typography>
          <List>
            {menu.map((item) => (
              <NavLink
                to={item.path}
                key={item.text}
                style={({ isActive }) => ({
                  color: isActive ? "#26CA99" : "unset",
                  textDecoration: "none",
                })}
              >
                {({ isActive }) => (
                  <ListItem
                    sx={{
                      bgcolor: isActive ? "#F4F4F4" : "unset",
                      borderRadius: 2,
                    }}
                  >
                    <ListItemIcon
                      sx={{ color: isActive ? "#26CA99" : "unset" }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText>{item.text}</ListItemText>
                  </ListItem>
                )}
              </NavLink>
            ))}
          </List>
        </Stack>

        <Stack direction="row" sx={{ justifyContent: "space-between" }}>
          <Stack spacing={1} direction="row" sx={{ alignItems: "center" }}>
            <Avatar>{getUserName().charAt(0).toUpperCase()}</Avatar>
            <Typography>{getUserName()}</Typography>
          </Stack>
          <IconButton onClick={handleClick}>
            <KeyboardArrowRightIcon />
          </IconButton>
        </Stack>
      </Paper>
      <Menu
        anchorEl={anchorEl}
        id="sidebar-menu-popover"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={menuSlotProps}
        transformOrigin={{ horizontal: "right", vertical: "bottom" }}
        anchorOrigin={{ horizontal: "right", vertical: "top" }}
      >
        <MenuItem onClick={handleClickSettings}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
}

export default SideBar;
