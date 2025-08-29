import { useRef, useState, type DragEvent } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import CancelIcon from "@mui/icons-material/Cancel";
import IconButton from "@mui/material/IconButton";

interface CSVFileUploaderProps {
  onChange: (item: File[]) => void;
  onRemoveFile: (fileName: string) => void;
}

function CSVFileUploader({ onChange, onRemoveFile }: CSVFileUploaderProps) {
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;
    if (uploadedFiles?.length) {
      setFiles([...files, ...Array.from(uploadedFiles)]);
      onChange(Array.from(uploadedFiles));
    }
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    boxRef.current?.classList.remove("drag-over");
    const droppedFiles = event.dataTransfer.files;

    if (droppedFiles?.length) {
      setFiles([...files, ...Array.from(droppedFiles)]);
      onChange(Array.from(droppedFiles));
    }
  };

  const handleDragEnter = (_event: DragEvent<HTMLDivElement>) => {
    boxRef.current?.classList.add("drag-over");
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    boxRef.current?.classList.add("drag-over");
  };

  const handleDragLeave = (_event: DragEvent<HTMLDivElement>) => {
    boxRef.current?.classList.remove("drag-over");
  };

  const handleRemoveFile = (index: number) => {
    const removedFile = files[index];
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);

    if (removedFile) {
      onRemoveFile(removedFile.name);
    }
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
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          "&:hover, &.drag-over": {
            backgroundColor: alpha("#ccc", 0.15),
            borderColor: "#000",
          },
          height: "200px",
        }}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
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
      <Typography variant="body2">Note: Only CSV file are supported</Typography>
      <Stack>{renderUploadedFiles()}</Stack>
    </>
  );
}

export default CSVFileUploader;
