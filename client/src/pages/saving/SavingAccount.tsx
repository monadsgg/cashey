import { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TabPanel from "../../components/TabPanel";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import SavingsCard from "./SavingsCard";
import AddSavingButton from "./AddSavingButton";
import { useSavings } from "../../hooks/useSavings";

function SavingAccount() {
  const [tab, setTab] = useState(0);
  const { personalAccounts, investmentAccounts } = useSavings();

  const handleChange = (_e: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{ height: "100%", p: "0 20px", border: "1px solid red" }}
    >
      <Paper
        elevation={1}
        sx={{
          padding: 4,
          height: "100%",
          width: "60%",
        }}
      >
        <Stack direction={"row"}>
          <Tabs
            value={tab}
            onChange={handleChange}
            indicatorColor="primary"
            sx={{ flexGrow: 1 }}
          >
            <Tab label="Personal" />
            <Tab label="Investment" />
          </Tabs>
          <AddSavingButton />
        </Stack>
        <Box mt={2}>
          <TabPanel index={0} value={tab}>
            <Stack spacing={2}>
              {personalAccounts.map((acc) => {
                const {
                  name,
                  balance,
                  savingAccount: { owner, targetAmt },
                } = acc;
                const percentage = (acc.balance / targetAmt) * 100;
                const remaining = targetAmt - acc.balance;

                return (
                  <SavingsCard
                    key={acc.id}
                    title={name}
                    chipLabel={owner}
                    currentAmt={balance}
                    targetAmt={targetAmt}
                    remainingAmt={remaining}
                    percentage={percentage}
                  />
                );
              })}
            </Stack>
          </TabPanel>
          <TabPanel index={1} value={tab}>
            <Stack spacing={2}>
              {investmentAccounts.map((acc) => {
                const {
                  name,
                  balance,
                  savingAccount: {
                    owner,
                    targetAmt,
                    contributionLimit,
                    accountType,
                  },
                } = acc;

                const percentage = (balance / targetAmt) * 100;
                const remaining = targetAmt - balance;

                return (
                  <SavingsCard
                    key={acc.id}
                    title={name}
                    chipLabel={owner}
                    accountType={accountType}
                    currentAmt={balance}
                    targetAmt={targetAmt}
                    remainingAmt={remaining}
                    contributionLimit={contributionLimit}
                    percentage={percentage}
                  />
                );
              })}
            </Stack>
          </TabPanel>
        </Box>
      </Paper>
      <Stack>
        <h3>Summary here</h3>
        <h3>Transactions here</h3>
      </Stack>
    </Stack>
  );
}

export default SavingAccount;
