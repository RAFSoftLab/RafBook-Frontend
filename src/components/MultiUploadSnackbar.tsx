import React from 'react';
import { Snackbar, Box, LinearProgress, Typography } from '@mui/material';

interface UploadItem {
  id: number;
  fileName: string;
  progress: number;
}

interface MultiUploadSnackbarProps {
  uploads: UploadItem[];
  onClose: (id: number) => void;
}

const MultiUploadSnackbar: React.FC<MultiUploadSnackbarProps> = ({ uploads, onClose }) => {
  const open = uploads.length > 0;

  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      sx={{ maxWidth: 600 }}
    >
      <Box
        sx={{
          bgcolor: 'background.paper',
          p: 2,
          borderRadius: 1,
          boxShadow: 3,
          minWidth: 300,
          maxWidth: '100%',
        }}
      >
        {uploads.map((upload) => (
          <Box key={upload.id} sx={{ mb: 1 }}>
            <Typography variant="body2" gutterBottom>
              {upload.fileName}: {upload.progress}%
            </Typography>
            <LinearProgress
              variant="determinate"
              value={upload.progress}
              sx={
                upload.progress === 100
                  ? { '& .MuiLinearProgress-bar': { backgroundColor: 'green' } }
                  : {}
              }
            />
          </Box>
        ))}
      </Box>
    </Snackbar>
  );
};

export default MultiUploadSnackbar;
