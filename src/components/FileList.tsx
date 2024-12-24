import React from 'react';
import { Box, IconButton, Link } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { getFileIcon } from '../utils';
import { Attachment } from '../types/global';

interface FileListProps {
  files: Attachment[];
  onRemoveFile?: (id: number) => void;
  canRemove?: boolean;
}

const FileList: React.FC<FileListProps> = ({ files, onRemoveFile, canRemove = true }) => {
  return (
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        {files.map((file) => (
          <Box
            key={file.id}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              border: '1px solid #ccc',
              borderRadius: 1,
              p: 1,
            }}
          >
            {/* Icon based on file type */}
            {getFileIcon(file.name)}
            
            {/* File Name as Download Link */}
            <Link
              href={file.url}
              download={file.name}
              underline="hover"
              target="_blank"
              rel="noopener noreferrer"
              variant="body2"
              sx={{ cursor: 'pointer' }}
            >
              {file.name}
            </Link>
            
            {/* Conditionally Render Remove Button */}
            {canRemove && onRemoveFile && (
              <IconButton
                size="small"
                onClick={() => onRemoveFile(file.id)}
                sx={{
                  bgcolor: 'black',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'rgba(0,0,0,0.8)',
                  },
                }}
                aria-label="Remove file"
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        ))}
      </Box>
  );
};

export default React.memo(FileList);
