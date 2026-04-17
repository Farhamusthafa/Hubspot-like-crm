'use client';

import React, { useState } from 'react';
import {
  Paper,
  Stack,
  Typography,
  Box,
  Button,
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { AttachmentManager } from './AttachmentManager';

const AIIcon = ({ color = "#7B61FF", size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Sparkle/Star part */}
    <path
      d="M6 4L6.5 5.5L8 6L6.5 6.5L6 8L5.5 6.5L4 6L5.5 5.5L6 4Z"
      fill={color}
    />
    <path
      d="M4.5 10L5 11.5L6.5 12L5 12.5L4.5 14L4 12.5L2.5 12L4 11.5L4.5 10Z"
      fill={color}
    />
    {/* Robot head part */}
    <path
      d="M9 11C9 9.89543 9.89543 9 11 9H19C20.1046 9 21 9.89543 21 11V16C21 17.1046 20.1046 18 19 18H11C9.89543 18 9 17.1046 9 16V11Z"
      stroke={color}
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <circle cx="13" cy="13.5" r="1.2" fill={color} />
    <circle cx="17" cy="13.5" r="1.2" fill={color} />
    <path
      d="M13 16C13 16 14 17 15 17C16 17 17 16 17 16"
      stroke={color}
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <path
      d="M15 9V7"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <circle cx="15" cy="7" r="1" fill={color} />
  </svg>
);

export interface DetailsRightPanelProps {
  title?: string;
  description?: string;
  showAttachments?: boolean;
  entityType?: string;
  entityId?: number;
}

export const DetailsRightPanel: React.FC<DetailsRightPanelProps> = ({
  title = "AI Summary",
  description = "There are no activities associated with this entity and further details are needed to provide a comprehensive summary.",
  showAttachments = true,
  entityType,
  entityId,
}) => {

  return (
    <Box sx={{ width: 320, p: 2 }}>

      {/* AI Summary Card */}
      <Paper
        elevation={0}
        sx={{
          minHeight: 160,
          p: 2.5,
          mb: 3,
          borderRadius: 3,
          border: "1px solid #7B61FF",
          bgcolor: "#F5F3FF",
        }}
      >
        <Stack direction="row" spacing={1.5} mb={2} alignItems="center">

          {/* Icon Circle */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AIIcon
              size={28}
              color="#7B61FF"
            />
          </Box>

          {/* Title */}
          <Typography
            fontWeight={700}
            fontSize={16}
            color="#7B61FF"
          >
            {title}
          </Typography>
        </Stack>

        {/* Description */}
        <Typography
          fontSize={14}
          fontWeight={500}
          color="#1F2937"
          lineHeight={1.6}
        >
          {description}
        </Typography>
      </Paper>

      {/* Attachments Section */}
      {showAttachments && (
        <Box>
          <Stack
            direction="column"
            justifyContent="space-between"
            alignItems="center"
            mb={1.5}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <KeyboardArrowDownIcon sx={{ fontSize: 20, color: "#7B61FF" }} />
              <Typography fontWeight={700} fontSize={15} color="#374151">
                Attachments
              </Typography>
            </Stack>
          </Stack>

          <Typography
            fontSize={14}
            color="#6B7280"
            mb={2}
            lineHeight={1.5}
          >
            See the files attached to your activities or uploaded to this record.
          </Typography>

          {/* Real Attachment Manager */}
          {entityType && entityId ? (
            <AttachmentManager entityType={entityType} entityId={entityId} />
          ) : (
            <Paper
              elevation={0}
              sx={{
                p: 4,
                border: '2px dashed #D1D5DB',
                borderRadius: 2,
                bgcolor: '#FAFAFA',
                textAlign: 'center',
              }}
            >
              <Stack direction="column" alignItems="center" spacing={2}>
                <Typography fontSize={14} color="#374151" fontWeight={600}>
                  Attachments not available
                </Typography>
                <Typography fontSize={12} color="#6B7280">
                  Please save the entity first to enable attachments
                </Typography>
              </Stack>
            </Paper>
          )}
        </Box>
      )}
    </Box>
  );
}