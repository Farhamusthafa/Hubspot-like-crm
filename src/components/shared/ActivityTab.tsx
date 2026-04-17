import React from 'react';
import { Tabs, Tab, Box } from '@mui/material';

interface ActivityTabProps {
  tabs: string[];
  value: number;
  onChange: (value: number) => void;
  children: (tabIndex: number) => React.ReactNode;
}

export const ActivityTab: React.FC<ActivityTabProps> = ({ tabs, value, onChange, children }) => {
  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    onChange(newValue);
  };

  const formatLabel = (raw: string) => {
    if (!raw) return raw;
    const trimmed = raw.trim();
    const lower = trimmed.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  };

  return (
    <Box>
      <Tabs
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 2, '& .MuiTab-root': { textTransform: 'none' } }}
      >
        {tabs.map((label, idx) => (
          <Tab key={label + idx} label={formatLabel(label)} />
        ))}
      </Tabs>

      <Box>
        {children(value)}
      </Box>
    </Box>
  );
};

export default ActivityTab;
