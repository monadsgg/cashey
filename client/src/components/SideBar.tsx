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
import Button from "@mui/material/Button";
import { logout } from "../utils/auth";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";

const menu = [
  { text: "Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
  { text: "Transaction", path: "/transactions", icon: <ReceiptIcon /> },
  { text: "Accounts", path: "/accounts", icon: <SavingsIcon /> },
  { text: "Budget", path: "/budget", icon: <AccountBalanceWalletIcon /> },
  { text: "Categories", path: "/categories", icon: <CategoryIcon /> },
];

function SideBar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getUserNameInitial = () => {
    const user = localStorage.getItem("user");
    if (!user) return "";

    return JSON.parse(user).name.charAt(0).toUpperCase();
  };

  return (
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
                  <ListItemIcon sx={{ color: isActive ? "#26CA99" : "unset" }}>
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
        <Avatar>{getUserNameInitial()}</Avatar>
        <Button onClick={handleLogout}>Logout</Button>
      </Stack>
    </Paper>
  );
}

export default SideBar;
