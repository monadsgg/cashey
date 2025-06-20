import { NavLink, useNavigate } from "react-router";
import Box from "@mui/material/Box";
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

const menu = [
  { text: "Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
  { text: "Transaction", path: "/transactions", icon: <ReceiptIcon /> },
  { text: "Savings", path: "/savings", icon: <SavingsIcon /> },
  { text: "Budget", path: "/budget", icon: <AccountBalanceWalletIcon /> },
  { text: "Categories", path: "/categories", icon: <CategoryIcon /> },
];

function SideBar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Box>
      <h2>Cashey</h2>
      <List>
        {menu.map((item) => (
          <NavLink
            to={item.path}
            key={item.text}
            style={({ isActive }) => ({
              color: isActive ? "#FF8F0D" : "unset",
              fontWeight: isActive ? 700 : "unset",
            })}
          >
            <ListItem>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText>{item.text}</ListItemText>
            </ListItem>
          </NavLink>
        ))}
      </List>
      <Stack direction="row">
        <Avatar>M</Avatar>
        <Button onClick={handleLogout}>Logout</Button>
      </Stack>
    </Box>
  );
}

export default SideBar;
