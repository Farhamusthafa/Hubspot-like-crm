'use client';

import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  LinearProgress,
} from '@mui/material';
import {
  CloudUpload,
  Download,
  Close,
  FileUpload,
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { importCsv, downloadImportTemplate } from '@/lib/api';

interface ImportDialogProps {
  open: boolean;
  onClose: () => void;
  entityType: 'lead' | 'company' | 'deal' | 'ticket';
  entityName: string;
  onImportSuccess?: (count: number) => void;
}

export const ImportDialog: React.FC<ImportDialogProps> = ({
  open,
  onClose,
  entityType,
  entityName,
  onImportSuccess,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [file, setFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isDownloadingTemplate, setIsDownloadingTemplate] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.endsWith('.csv')) {
        enqueueSnackbar('Please select a CSV file', { variant: 'error' });
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        enqueueSnackbar('File size must be less than 5MB', { variant: 'error' });
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile && droppedFile.name.endsWith('.csv')) {
      setFile(droppedFile);
    } else {
      enqueueSnackbar('Please drop a CSV file', { variant: 'error' });
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      setIsDownloadingTemplate(true);
      await downloadImportTemplate(entityType);
      enqueueSnackbar('Template downloaded successfully', { variant: 'success' });
    } catch (error: any) {
      enqueueSnackbar(error.message || 'Failed to download template', { variant: 'error' });
    } finally {
      setIsDownloadingTemplate(false);
    }
  };

  const handleImport = async () => {
    if (!file) {
      enqueueSnackbar('Please select a file to import', { variant: 'error' });
      return;
    }

    try {
      setIsImporting(true);
      setImportProgress(0);

      const result = await importCsv(entityType, file);

      enqueueSnackbar(
        `Successfully imported ${result.count} ${entityName} records`,
        { variant: 'success' }
      );

      if (onImportSuccess) {
        onImportSuccess(result.count);
      }

      handleClose();
    } catch (error: any) {
      enqueueSnackbar(error.message || 'Failed to import data', { variant: 'error' });
    } finally {
      setIsImporting(false);
      setImportProgress(0);
    }
  };

  const handleClose = () => {
    setFile(null);
    setImportProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">Import {entityName}s</Typography>
          <IconButton onClick={handleClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box display="flex" flexDirection="column" gap={3}>
          {/* Instructions */}
          <Alert severity="info">
            <Typography variant="body2" gutterBottom>
              Import {entityName}s from a CSV file. Make sure your CSV file has the correct headers.
            </Typography>
            <Button
              variant="outlined"
              size="small"
              startIcon={<Download />}
              onClick={handleDownloadTemplate}
              disabled={isDownloadingTemplate}
              sx={{ mt: 1 }}
            >
              {isDownloadingTemplate ? 'Downloading...' : 'Download Template'}
            </Button>
          </Alert>

          {/* File Upload Area */}
          <Paper
            sx={{
              border: '2px dashed',
              borderColor: file ? 'primary.main' : 'grey.300',
              backgroundColor: file ? 'primary.50' : 'grey.50',
              padding: 3,
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
              '&:hover': {
                borderColor: 'primary.main',
                backgroundColor: 'primary.100',
              },
            }}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />

            {file ? (
              <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                <FileUpload color="primary" sx={{ fontSize: 48 }} />
                <Typography variant="body1" fontWeight="medium">
                  {file.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {(file.size / 1024).toFixed(1)} KB
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                >
                  Remove File
                </Button>
              </Box>
            ) : (
              <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                <CloudUpload sx={{ fontSize: 48, color: 'grey.400' }} />
                <Typography variant="body1" fontWeight="medium">
                  Drop CSV file here or click to browse
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Maximum file size: 5MB
                </Typography>
              </Box>
            )}
          </Paper>

          {/* Progress */}
          {isImporting && (
            <Box>
              <Typography variant="body2" gutterBottom>
                Importing {entityName}s...
              </Typography>
              <LinearProgress variant="indeterminate" />
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={handleClose} disabled={isImporting}>
          Cancel
        </Button>
        <Button
          onClick={handleImport}
          variant="contained"
          disabled={!file || isImporting}
          startIcon={isImporting ? <CircularProgress size={20} /> : <CloudUpload />}
        >
          {isImporting ? 'Importing...' : `Import ${entityName}s`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Import Button Component
interface ImportButtonProps {
  entityType: 'lead' | 'company' | 'deal' | 'ticket';
  entityName: string;
  onImportSuccess?: (count: number) => void;
}

export const ImportButton: React.FC<ImportButtonProps> = ({
  entityType,
  entityName,
  onImportSuccess,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="outlined"
        onClick={() => setOpen(true)}
        sx={{ mr: 1 }}
      >
        import
      </Button>

      <ImportDialog
        open={open}
        onClose={() => setOpen(false)}
        entityType={entityType}
        entityName={entityName}
        onImportSuccess={onImportSuccess}
      />
    </>
  );
};
