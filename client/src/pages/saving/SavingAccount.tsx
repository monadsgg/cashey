import { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TabPanel from "../../components/TabPanel";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import SavingsCard from "./SavingsCard";
import Button from "@mui/material/Button";
import { useSavings } from "../../hooks/useSavings";
import FormDialog from "../../components/FormDialog";
import SavingsForm, { type SavingFormDataType } from "./SavingsForm";

function SavingAccount() {
  const [tab, setTab] = useState(0);
  const { personalAccounts, investmentAccounts } = useSavings();
  const [open, setOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] =
    useState<SavingFormDataType | null>(null);

  const handleChange = (_e: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => setSelectedAccount(null), 800);
  };

  const handleClickBtn = () => {
    setOpen(true);
  };

  const handleOnClickCard = (acc: SavingAccount) => {
    console.log(acc);
    const {
      id,
      name,
      balance,
      savingAccount: {
        owner,
        targetAmt,
        accountType,
        investmentType,
        contributionLimit,
      },
    } = acc;
    setOpen(true);
    setSelectedAccount({
      id,
      name,
      balance,
      owner,
      targetAmt,
      accountType,
      investmentType: investmentType ?? null,
      contributionLimit: contributionLimit ?? null,
    });
  };

  return (
    <>
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
            <Button variant="outlined" onClick={handleClickBtn}>
              Add Savings
            </Button>
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
                  const percentage = Math.ceil((balance / targetAmt) * 100);
                  const remaining = targetAmt - balance;

                  return (
                    <SavingsCard
                      key={acc.id}
                      title={name}
                      chipLabel={owner}
                      currentAmt={balance}
                      targetAmt={targetAmt}
                      remainingAmt={remaining}
                      percentage={percentage}
                      onClick={() => handleOnClickCard(acc)}
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

                  const percentage = Math.ceil((balance / targetAmt) * 100);
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
                      onClick={() => handleOnClickCard(acc)}
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
      <FormDialog open={open} onClose={handleClose}>
        <SavingsForm onClose={handleClose} selectedAccount={selectedAccount} />
      </FormDialog>
    </>
  );
}

export default SavingAccount;
