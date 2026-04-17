'use client';

import React from 'react';
import { DynamicNoteCard } from './DynamicNoteCard';
import { DynamicCallCard } from './DynamicCallCard';
import { DynamicEmailCard } from './DynamicEmailCard';
import { DynamicTaskCard } from './DynamicTaskCard';
import { DynamicMeetingCard } from './DynamicMeetingCard';
import { TimeLineRow } from '../TimeLineRow';

interface CRDCProps {
  type: string;
  data: any;
  isTimelineView?: boolean;
  onNavigate?: (type: string) => void;
}

export const CRDC: React.FC<CRDCProps> = ({ type, data, isTimelineView, onNavigate }) => {
  switch (type) {
    case 'note':
      return <DynamicNoteCard note={data} isTimelineView={isTimelineView} onNavigate={() => onNavigate?.('note')} />;
    case 'call':
      return <DynamicCallCard call={data} isTimelineView={isTimelineView} onNavigate={() => onNavigate?.('call')} />;
    case 'email':
      return <DynamicEmailCard email={data} isTimelineView={isTimelineView} onNavigate={() => onNavigate?.('email')} />;
    case 'task':
      return <DynamicTaskCard task={data} isTimelineView={isTimelineView} onNavigate={() => onNavigate?.('task')} />;
    case 'meeting':
      return <DynamicMeetingCard meeting={data} isTimelineView={isTimelineView} onNavigate={() => onNavigate?.('meeting')} />;
    default:
      return <TimeLineRow title={data.title} desc={data.desc} rightText={data.rightText} />;
  }
};
