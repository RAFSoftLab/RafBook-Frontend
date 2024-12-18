import React, { ChangeEvent } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';

interface FileUploaderProps {
  onFilesSelected: (files: FileList) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFilesSelected }) => {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      onFilesSelected(files);
    }
  };

  return (
    <Tooltip title="Attach File">
      <IconButton
        color="primary"
        aria-label="Attach File"
        component="label"
      >
        <AttachFileIcon />
        <input
          type="file"
          hidden
          multiple
          onChange={handleFileChange}
          accept="image/*,audio/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        />
      </IconButton>
    </Tooltip>
  );
};

export default React.memo(FileUploader);
