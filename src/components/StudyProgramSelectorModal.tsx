import React, { useState } from 'react';
import {
    Modal,
    Box,
    Typography,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Divider,
} from '@mui/material';
import { StudyLevel, StudyProgram } from '../types/global';

interface StudyProgramSelectorModalProps {
    open: boolean;
    studyLevels: StudyLevel[];
    onClose: () => void;
    onSelect: (selectedStudyLevel: StudyLevel, selectedStudyProgram: StudyProgram) => void;
}

const style = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    maxHeight: '80vh',
    overflowY: 'auto',
};

const StudyProgramSelectorModal: React.FC<StudyProgramSelectorModalProps> = ({
    open,
    studyLevels,
    onClose,
    onSelect,
}) => {
    const [selectedStudyLevel, setSelectedStudyLevel] = useState<StudyLevel | null>(null);
    const [selectedStudyProgram, setSelectedStudyProgram] = useState<StudyProgram | null>(null);

    const handleStudyLevelSelect = (studyLevel: StudyLevel) => {
        setSelectedStudyLevel(studyLevel);
        setSelectedStudyProgram(null);
    };

    const handleStudyProgramSelect = (studyProgram: StudyProgram) => {
        setSelectedStudyProgram(studyProgram);
        onSelect(selectedStudyLevel!, studyProgram);
        onClose();
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="select-study-program-modal"
            aria-describedby="select-study-level-and-study-program"
        >
            <Box sx={style}>
                <Typography id="select-study-program-modal" variant="h6" component="h2" gutterBottom>
                    Select Study Level and Study Program
                </Typography>
                {!selectedStudyLevel ? (
                    <>
                        <Typography variant="subtitle1" gutterBottom>
                            Select a Study Level:
                        </Typography>
                        <List>
                            {studyLevels.map((studyLevel) => (
                                <ListItem key={studyLevel.id} disablePadding>
                                    <ListItemButton onClick={() => handleStudyLevelSelect(studyLevel)}>
                                        <ListItemText primary={studyLevel.name} secondary={studyLevel.description} />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </>
                ) : (
                    <>
                        <Typography variant="subtitle1" gutterBottom>
                            Study Level: {selectedStudyLevel.name}
                        </Typography>
                        <Divider />
                        <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                            Select a Study Program:
                        </Typography>
                        <List>
                            {selectedStudyLevel.studyPrograms.map((program) => (
                                <ListItem key={program.id} disablePadding>
                                    <ListItemButton onClick={() => handleStudyProgramSelect(program)}>
                                        <ListItemText primary={program.name} secondary={program.description} />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                        <Divider />
                        <Box sx={{ mt: 2 }}>
                            <Typography
                                variant="body2"
                                color="primary"
                                onClick={() => setSelectedStudyLevel(null)}
                                sx={{ cursor: 'pointer' }}
                            >
                                Back to Study Levels
                            </Typography>
                        </Box>
                    </>
                )}
            </Box>
        </Modal>
    );
};

export default StudyProgramSelectorModal;
