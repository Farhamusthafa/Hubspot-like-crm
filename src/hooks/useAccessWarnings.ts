'use client';

import { useEffect } from 'react';
import { useSnackbar } from 'notistack';

export const useAccessWarnings = () => {
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const handleAccessWarning = (event: CustomEvent) => {
      const { message } = event.detail;
      enqueueSnackbar(message, {
        variant: 'warning',
        autoHideDuration: 4000,
      });
    };

    // Add event listener for access warnings
    window.addEventListener('showAccessWarning', handleAccessWarning as EventListener);

    // Cleanup
    return () => {
      window.removeEventListener('showAccessWarning', handleAccessWarning as EventListener);
    };
  }, [enqueueSnackbar]);
};
