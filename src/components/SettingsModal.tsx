import React, { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Tabs,
  Tab,
  Switch,
  FormControlLabel,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { toggleTheme } from '../store/themeSlice';
import { SettingsModalProps } from '../types/global';

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const SettingsModal: React.FC<SettingsModalProps> = ({ open, onClose }) => {
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector((state) => state.theme.mode);
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="settings-modal-title"
      aria-describedby="settings-modal-description"
    >
      <Box sx={style}>
        {/* Header with Close Button */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography id="settings-modal-title" variant="h6" component="h2">
            Settings
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Tabs for Different Settings Sections */}
        <Tabs value={tabIndex} onChange={handleTabChange} aria-label="settings tabs" centered>
          <Tab label="General" />
          <Tab label="Appearance" />
        </Tabs>

        {/* Tab Panels */}
        {tabIndex === 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1">General Settings</Typography>
            <Typography variant="body2" color="text.secondary">
              Placeholder content for general settings.
            </Typography>
          </Box>
        )}
        {tabIndex === 1 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1">Appearance</Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={themeMode === 'dark'}
                  onChange={handleThemeToggle}
                  name="themeToggle"
                  color="primary"
                  data-cy='dark-mode-switch'
                />
              }
              label="Dark Mode"
            />
            <Typography variant="body2" color="text.secondary">
              Toggle between light and dark themes.
            </Typography>
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default SettingsModal;
