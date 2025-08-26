import { useState } from "react";
import Papa from "papaparse";
import Button from "@mui/material/Button";
import DialogContent from "@mui/material/DialogContent";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import CSVFileUploader from "../../components/CSVFileUploader";
import FormDialog from "../../components/FormDialog";
import TableCell from "@mui/material/TableCell";
import Paper from "@mui/material/Paper";
import Alert from "@mui/material/Alert";

interface UploadFileDialogProps {
  onClose: () => void;
}

interface PreviewData {
  date: string;
  description: string;
  amount: number;
  category: string;
  payee?: string;
  tag?: string;
  __fileName?: string; // for tracking only
}

function UploadFileDialog({ onClose }: UploadFileDialogProps) {
  const [openPreviewDialog, setOpenPreviewDialog] = useState(false);
  const [previewData, setPreviewData] = useState<PreviewData[]>([]);
  const [error, setError] = useState("");

  const handleOnProcessData = () => {};

  const handleOnUploadChange = (files: File[]) => {
    files.map((file: File) =>
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        error: (error: Error) => {
          setError(error.message);
        },
        complete: (results) => {
          console.log("results:", results);
          if (!!results.errors.length) {
            setError(results.errors.map((e) => e.message).join(", "));
            return;
          }

          if (!!results.data.length) {
            const newData = (results.data as PreviewData[]).map((d) => ({
              ...d,
              __fileName: file.name,
            }));
            setPreviewData([...previewData, ...newData]);
          }
        },
      })
    );
  };

  const handleRemoveFile = (fileName: string) => {
    const newData = previewData.filter((d) => d.__fileName !== fileName);
    setPreviewData(newData);
  };

  const handleClosePreviewDialog = () => {
    () => setOpenPreviewDialog(false);
  };

  const renderPreviewTableHeader = () => {
    if (!previewData.length) return;

    return Object.keys(previewData[0])
      .filter((d) => d !== "__fileName")
      .map((d, index) => <TableCell key={index}>{d}</TableCell>);
  };

  const renderPreviewTableBody = () => {
    if (!previewData.length) return;

    return previewData.map((d, index) => {
      return (
        <TableRow key={index}>
          <TableCell>{d.date}</TableCell>
          <TableCell>{d.description}</TableCell>
          <TableCell>{d.amount}</TableCell>
          <TableCell>{d.category}</TableCell>
          <TableCell>{d.payee}</TableCell>
          <TableCell>{d.tag}</TableCell>
        </TableRow>
      );
    });
  };

  return (
    <>
      <DialogContent>
        <Stack spacing={4} sx={{ height: "100%" }}>
          <Stack spacing={2} sx={{ flexGrow: 1 }}>
            <CSVFileUploader
              onChange={handleOnUploadChange}
              onRemoveFile={handleRemoveFile}
            />
          </Stack>

          {error && (
            <Stack>
              <Alert severity="error">{error}</Alert>
            </Stack>
          )}

          <Divider />

          <Stack
            direction="row"
            spacing={2}
            sx={{ justifyContent: "space-between" }}
          >
            <Button
              variant="outlined"
              onClick={() => setOpenPreviewDialog(true)}
              color="primary"
              disabled={!previewData.length}
            >
              Preview data
            </Button>
            <Stack
              direction="row"
              spacing={2}
              sx={{ justifyContent: "flex-end" }}
            >
              <Button variant="outlined" onClick={onClose} color="primary">
                Close
              </Button>
              <Button
                color="primary"
                variant="contained"
                onClick={handleOnProcessData}
                disabled={!previewData.length}
              >
                Process
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </DialogContent>

      <FormDialog
        title="Data Preview"
        open={openPreviewDialog}
        onClose={handleClosePreviewDialog}
        paperSx={{ minWidth: "60vw", maxHeight: "70vh" }}
      >
        <DialogContent>
          <Stack spacing={2}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>{renderPreviewTableHeader()}</TableRow>
                </TableHead>
                <TableBody>{renderPreviewTableBody()}</TableBody>
              </Table>
            </TableContainer>

            <Stack
              direction="row"
              justifyContent="flex-end"
              alignItems="center"
            >
              <Button
                variant="contained"
                onClick={handleClosePreviewDialog}
                color="primary"
              >
                Close
              </Button>
            </Stack>
          </Stack>
        </DialogContent>
      </FormDialog>
    </>
  );
}

export default UploadFileDialog;
