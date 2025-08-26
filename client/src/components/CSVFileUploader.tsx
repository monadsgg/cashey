import { useRef, useState, type DragEvent } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import CancelIcon from "@mui/icons-material/Cancel";
import IconButton from "@mui/material/IconButton";

interface CSVFileUploaderProps {
  onChange: (item: File[]) => void;
}

function CSVFileUploader({ onChange }: CSVFileUploaderProps) {
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // console.log(e.currentTarget.files);
    if (e.target.files?.length) {
      setFiles([...files, ...Array.from(e.target.files)]);
      onChange(Array.from(e.target.files));
    }
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    // console.log(event);
    if (event.dataTransfer.files?.length) {
      const droppedFiles = event.dataTransfer.files;
      setFiles([...files, ...Array.from(droppedFiles)]);
      onChange(Array.from(droppedFiles));
    }
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
  };

  const renderUploadedFiles = () => {
    if (!files.length) return;

    return files.map((f: File, index) => (
      <Stack
        key={index}
        direction="row"
        spacing={2}
        sx={{ alignItems: "center" }}
      >
        <IconButton onClick={() => handleRemoveFile(index)}>
          <CancelIcon fontSize="small" />
        </IconButton>
        {f.name}
      </Stack>
    ));
  };

  return (
    <>
      <Box
        ref={boxRef}
        component="div"
        sx={{
          border: "2px dashed #ccc",
          borderRadius: 2,
          p: 6,
          display: "flex",
          alignItems: "center",
          "&:hover": {
            backgroundColor: alpha("#ccc", 0.15),
            borderColor: "#000",
          },
          height: "200px",
        }}
        onClick={handleClick}
        onDragOver={(event: DragEvent<HTMLDivElement>) => {
          event.preventDefault();
        }}
        onDragEnter={(event: DragEvent<HTMLDivElement>) => {
          event.preventDefault();
        }}
        onDrop={handleDrop}
      >
        <Typography variant="body2">Click to select files</Typography>
        <Typography variant="body2">or drag-and-drop files here</Typography>
      </Box>
      <input
        type="file"
        ref={fileInputRef}
        name="csvFile"
        id="csvFile"
        accept=".csv"
        style={{ display: "none" }}
        onChange={handleFileChange}
        multiple
      />
      <Stack>{renderUploadedFiles()}</Stack>
    </>
  );
}

export default CSVFileUploader;
