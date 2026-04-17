'use client';

import { Paper, Stack, Box, Typography } from '@mui/material';

interface TimeLineRowProps {
  title?: string;
  desc: string;
  rightText?: string;
}

export const TimeLineRow: React.FC<TimeLineRowProps> = ({
  title,
  desc,
  rightText,
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 1.5,
        mb: 1,
        border: '2px solid #E5E7EB',
        borderRadius: '12px',
      }}
    >
      <Stack direction="row" spacing={1.5}>
        <Box flex={1}>
          {title && (
            <Typography fontWeight={600} fontSize={13}>
              {title}
            </Typography>
          )}

          <Typography fontSize={12} color="#7D93AC">
            {desc}
          </Typography>
        </Box>

        {rightText && (
          <Typography fontSize={12} color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
            {rightText}
          </Typography>
        )}
      </Stack>
    </Paper>
  );
};