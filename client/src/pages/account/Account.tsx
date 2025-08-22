import { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TabPanel from "../../components/TabPanel";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import AccountCard from "./AccountCard";
import Button from "@mui/material/Button";
import FormDialog from "../../components/FormDialog";
import AccountForm, { type AccountFormDataType } from "./AccountForm";
import AccountSummary from "./AccountSummary";
import AccountTransactions from "./AccountTransactions";
import TransferMoneyButton from "../../components/TransferMoneyButton";
import type { AccountItem } from "../../services/accounts";
import { useAccounts } from "../../hooks/accounts/useAccounts";
import { useDeleteAccount } from "../../hooks/accounts/useDeleteAccount";
import type { ConfirmDeleteData } from "../transaction/Transaction";
import ConfirmDialog from "../../components/ConfirmDialog";

function Account() {
  const [tab, setTab] = useState(0);
  const { personalAccounts, investmentAccounts } = useAccounts();
  const [open, setOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] =
    useState<AccountFormDataType | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<ConfirmDeleteData>({
    id: null,
    openDialog: false,
  });

  const deleteAccountMutation = useDeleteAccount();

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

  const handleOnClickEdit = (acc: AccountItem) => {
    console.log(acc);
    const {
      id,
      name,
      balance,
      type,
      account: { owner, targetAmt, investmentType, contributionLimit },
    } = acc;
    setOpen(true);
    setSelectedAccount({
      id,
      name,
      balance,
      owner,
      targetAmt,
      accountType: type,
      investmentType: investmentType ?? null,
      contributionLimit: contributionLimit ?? null,
    });
  };

  const handleCloseConfirmDialog = () => {
    setConfirmDelete({ id: null, openDialog: false });
  };

  const handleOnClickDeleteBtn = (id: number) => {
    setConfirmDelete({ id, openDialog: true });
  };

  const handleOnDeleteAcct = () => {
    if (!confirmDelete.id) return;
    deleteAccountMutation.mutate(confirmDelete.id);
    handleCloseConfirmDialog();
  };

  return (
    <>
      <Stack
        direction="row"
        spacing={2}
        sx={{
          height: "100%",
          // border: "1px solid red",
        }}
      >
        <Paper
          elevation={1}
          sx={{
            padding: 4,
            height: "100%",
            width: "70%",
          }}
        >
          <Stack direction={"row"}>
            <Tabs
              value={tab}
              onChange={handleChange}
              indicatorColor="primary"
              sx={{ flexGrow: 1 }}
            >
              <Tab label="Personal Savings" />
              <Tab label="Investment" />
            </Tabs>
            <Stack direction={"row"} spacing={1}>
              <TransferMoneyButton label="Transfer funds" isAccounts />
              <Button variant="outlined" onClick={handleClickBtn}>
                Add Accounts
              </Button>
            </Stack>
          </Stack>
          <Box mt={2}>
            <TabPanel index={0} value={tab}>
              <Stack spacing={2}>
                {personalAccounts.map((acc) => {
                  const {
                    name,
                    balance,
                    account: { owner, targetAmt },
                  } = acc;
                  const percentage = Math.ceil((balance / targetAmt) * 100);
                  const remaining = targetAmt - balance;

                  return (
                    <AccountCard
                      key={acc.id}
                      title={name}
                      chipLabel={owner}
                      currentAmt={balance}
                      targetAmt={targetAmt}
                      remainingAmt={remaining}
                      percentage={percentage}
                      onClickEdit={() => handleOnClickEdit(acc)}
                      onClickDelete={() => handleOnClickDeleteBtn(acc.id)}
                      showDeleteBtn={!acc.transactions.length}
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
                    type,
                    account: { owner, targetAmt, contributionLimit },
                  } = acc;

                  const percentage = Math.ceil((balance / targetAmt) * 100);
                  const remaining = targetAmt - balance;

                  return (
                    <AccountCard
                      key={acc.id}
                      title={name}
                      chipLabel={owner}
                      accountType={type}
                      currentAmt={balance}
                      targetAmt={targetAmt}
                      remainingAmt={remaining}
                      contributionLimit={contributionLimit}
                      percentage={percentage}
                      onClickEdit={() => handleOnClickEdit(acc)}
                      onClickDelete={() => handleOnClickDeleteBtn(acc.id)}
                      showDeleteBtn={!acc.transactions.length}
                    />
                  );
                })}
              </Stack>
            </TabPanel>
          </Box>
        </Paper>
        <Stack spacing={1}>
          <AccountSummary />
          <AccountTransactions />
        </Stack>
      </Stack>

      <FormDialog
        title={`${selectedAccount ? "Edit" : "Add"} account`}
        open={open}
        onClose={handleClose}
      >
        <AccountForm onClose={handleClose} selectedAccount={selectedAccount} />
      </FormDialog>

      <ConfirmDialog
        title="account"
        open={confirmDelete.openDialog}
        onClose={handleCloseConfirmDialog}
        onClickDelete={handleOnDeleteAcct}
      />
    </>
  );
}

export default Account;
