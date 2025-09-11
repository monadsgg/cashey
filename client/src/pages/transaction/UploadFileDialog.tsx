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
import { importTransactions } from "../../services/transactions";
import Toast from "../../components/Toast";
import { useQueryClient } from "@tanstack/react-query";

interface UploadFileDialogProps {
  onClose: () => void;
}

interface PreviewData {
  date: string;
  description: string;
  amount: number;
  category: string;
  payee?: string;
  tags?: string;
  __fileName?: string; // for tracking only
}

interface Toast {
  message: string;
  open: boolean;
}

function UploadFileDialog({ onClose }: UploadFileDialogProps) {
  const [openPreviewDialog, setOpenPreviewDialog] = useState(false);
  const [previewData, setPreviewData] = useState<PreviewData[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [toast, setToast] = useState({ message: "", open: false });
  const [error, setError] = useState("");
  const queryClient = useQueryClient();

  const handleOnProcessData = async () => {
    try {
      setIsProcessing(true);
      const payload = previewData.map((tx) => {
        let tags;
        if (tx.tags) {
          const delimeter = "/";
          tags = tx.tags.split(delimeter);
        }

        return {
          description: tx.description,
          date: tx.date,
          amount: tx.amount,
          category: tx.category,
          payee: tx.payee,
          tags: tags,
        };
      });
      // endpoint here
      const result = await importTransactions(payload);
      console.log("imported tx", result);

      setIsProcessing(false);
      setIsCompleted(true);
      setToast({ message: result.message, open: true });
      queryClient.invalidateQueries({ queryKey: ["transaction"] });
      queryClient.invalidateQueries({ queryKey: ["all-transactions"] });
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleOnUploadChange = (files: File[]) => {
    files.map((file: File) =>
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        delimiter: ",",
        transform: (value) => {
          if (typeof value === "string") {
            const cleaned = value.replace(/,/g, "");

            if (!isNaN(Number(cleaned)) && cleaned.trim() !== "")
              return parseFloat(cleaned);

            return value;
          }
          return value;
        },
        error: (error: Error) => {
          setError(error.message);
        },
        complete: (results) => {
          try {
            const parsedData = results.data as PreviewData[];

            // validate and transform
            const cleanedData = parsedData.map((row, index) => {
              if (!row.date || !row.amount) {
                throw new Error(
                  `Row ${index + 1} is missing required fields (date or amount)`
                );
              }

              return {
                ...row,
                amount: Number(row.amount),
                __fileName: file.name,
              };
            });

            setPreviewData([...previewData, ...cleanedData]);
            setError("");
          } catch (error: any) {
            setError(error.message);
            setPreviewData([]);
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
    onClose();
    setOpenPreviewDialog(false);
    setIsCompleted(false);
  };

  const handleCloseToast = () => {
    setToast({ message: "", open: false });
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
          <TableCell>{d.tags}</TableCell>
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
            sx={{ justifyContent: "flex-end" }}
          >
            <Button variant="outlined" onClick={onClose} color="primary">
              Close
            </Button>
            <Button
              variant="outlined"
              onClick={() => setOpenPreviewDialog(true)}
              color="primary"
              disabled={!previewData.length}
            >
              Preview data
            </Button>
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
              spacing={2}
              direction="row"
              justifyContent="flex-end"
              alignItems="center"
            >
              <Button
                variant="outlined"
                onClick={handleClosePreviewDialog}
                color="primary"
              >
                Close
              </Button>
              <Button
                loading={isProcessing}
                loadingPosition="start"
                color="primary"
                variant="contained"
                onClick={handleOnProcessData}
                disabled={isCompleted}
              >
                {isCompleted ? "Processing complete" : "Process"}
              </Button>
            </Stack>
          </Stack>
        </DialogContent>
        <Toast
          open={toast.open}
          message={toast.message}
          onClose={handleCloseToast}
        />
      </FormDialog>
    </>
  );
}

export default UploadFileDialog;
