import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import CategoryIcon from "@mui/icons-material/Category";
import TagIcon from "@mui/icons-material/Tag";
import BusinessIcon from "@mui/icons-material/Business";
import { useState } from "react";
import Paper from "@mui/material/Paper";
import TabPanel from "../../components/TabPanel";
import Categories from "./categories/Categories";

function Settings() {
  const [tab, setTab] = useState(0);

  const handleChange = (_e: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  return (
    <Paper
      elevation={1}
      sx={{
        padding: 4,
        height: "100%",
        width: "100%",
      }}
    >
      <Typography variant="h4">Settings</Typography>
      <Typography variant="body2" sx={{ opacity: 0.8 }}>
        Manage your categories, tags and payees for better tracking.
      </Typography>
      <Paper
        elevation={0}
        sx={{
          mt: 3,
          mb: 3,
          display: "inline-flex",
          borderRadius: "32px",
          backgroundColor: "#f1f1f6",
          px: 1,
          py: 0.5,
        }}
      >
        <Tabs
          value={tab}
          onChange={handleChange}
          slotProps={{ indicator: { style: { display: "none" } } }}
          indicatorColor="primary"
          sx={{
            minHeight: 0,
            "& .MuiTab-root": {
              textTransform: "none",
              minHeight: 0,
              minWidth: 150,
              borderRadius: "24px",
              px: 2,
              py: 1,
              fontWeight: 500,
              display: "flex",
              gap: 1,
            },
            "& .Mui-selected": {
              backgroundColor: "#fff",
            },
          }}
        >
          <Tab
            icon={<CategoryIcon fontSize="small" />}
            label="Categories"
            iconPosition="start"
            sx={{ "& .MuiTab-icon": { mr: 0 } }}
          />
          <Tab
            icon={<TagIcon fontSize="small" />}
            label="Tags"
            iconPosition="start"
            sx={{ "& .MuiTab-icon": { mr: 0 } }}
          />
          <Tab
            icon={<BusinessIcon fontSize="small" />}
            label="Payees"
            iconPosition="start"
            sx={{ "& .MuiTab-icon": { mr: 0 } }}
          />
        </Tabs>
      </Paper>
      <Paper sx={{ padding: 8 }}>
        <TabPanel index={0} value={tab}>
          <Categories />
        </TabPanel>
        <TabPanel index={1} value={tab}>
          <Stack>
            <Typography>Tags</Typography>
          </Stack>
        </TabPanel>
        <TabPanel index={2} value={tab}>
          <Stack>
            <Typography>Payees</Typography>
          </Stack>
        </TabPanel>
      </Paper>
    </Paper>
  );
}

export default Settings;
