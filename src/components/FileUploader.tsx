import React, { ChangeEvent } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';

interface FileUploaderProps {
  onFilesSelected: (files: FileList) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFilesSelected }) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onFilesSelected(e.target.files);
    }
  };

  return (
    <Tooltip title="Attach Files">
      <IconButton component="label" color="primary" aria-label="Attach File">
        <AttachFileIcon />
        <input
          type="file"
          hidden
          multiple
          accept="image/*,audio/*,video/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/zip"
          onChange={handleChange}
        />
      </IconButton>
    </Tooltip>
  );
};

export default React.memo(FileUploader);
