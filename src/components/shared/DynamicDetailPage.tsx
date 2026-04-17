'use client';
// Force recompile to clear stale errors

import React, { useState, useRef, useEffect } from 'react';
import {
  Typography,
  TextField,
  InputAdornment,
  Button,
  Stack,
  Box,
  Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

import { ActivityTab } from './ActivityTab';
import { DetailsRightPanel } from './DetailsRightPanel';
import { DynamicActivitySection } from './activity-cards/DynamicActivitySection';
import { DynamicActivityDrawer, ActivityType } from './DynamicActivityDrawer';
import { formatMonth } from '@/utils/activityUtils';
// Import CRDC dispatcher
import { CRDC } from './activity-cards/CRDC';
import {
  getNotes,
  getTasks,
  getMeetings,
  getEmails,
  getCalls,
  createNote,
  createTask,
  createMeeting,
  createEmail,
  createCall
} from '@/lib/api';

interface DynamicDetailPageProps {
  entityType: 'lead' | 'deal' | 'company' | 'ticket';
  entityData: any;
  aiTitle?: string;
  aiDescription?: string;
  showConvertButton?: boolean;
  onConvert?: () => void;
  // new props
  drawerActivityType?: ActivityType | null;
  externalIsDrawerOpen?: boolean; // rename
  onExternalDrawerClose?: () => void;
  onExternalActivityClick?: (type: ActivityType) => void;

}

export const DynamicDetailPage: React.FC<DynamicDetailPageProps> = ({
  entityType,
  entityData,
  aiTitle,
  aiDescription,
  showConvertButton = false,
  onConvert,
  drawerActivityType,
  externalIsDrawerOpen,
  onExternalDrawerClose,
  onExternalActivityClick,
  
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentActivityType, setCurrentActivityType] = useState<ActivityType>('note');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const emailsRef = useRef<HTMLDivElement | null>(null);
  const [isLoadingActivities, setIsLoadingActivities] = useState(false);
  const month = formatMonth(new Date().toISOString());

  // State for managing activities - start with empty arrays, will be populated by backend data
 const [activities, setActivities] = useState<{
  notes: Activity[];
  emails: Activity[];
  calls: Activity[];
  tasks: Activity[];
  meetings: Activity[];
  timeline: Activity[];
  upcoming: Activity[];
}>({
  notes: [],
  emails: [],
  calls: [],
  tasks: [],
  meetings: [],
  timeline: [],
  upcoming: []
});
  
  // const [activities, setActivities] = useState({
  //   notes: [],
  //   emails: [],
  //   calls: [],
  //   tasks: [],
  //   meetings: [],
  //   timeline: [],
  //   upcoming: []
  // });

    useEffect(() => {
  if (drawerActivityType) {
    setCurrentActivityType(drawerActivityType);
  }
}, [drawerActivityType]);

useEffect(() => {
  if (externalIsDrawerOpen !== undefined) {
    setIsDrawerOpen(externalIsDrawerOpen);
  }
}, [externalIsDrawerOpen]);
const handleActivityClick = (activityType: ActivityType) => {
  if (onExternalActivityClick) {
    onExternalActivityClick(activityType); // parent controls drawer
  } else {
    setCurrentActivityType(activityType);
    setIsDrawerOpen(true);
  }
};

  // Fetch activities from backend on component mount
  useEffect(() => {
    const fetchActivities = async () => {
      if (!entityData?.id) return;

      try {
        setIsLoadingActivities(true);
        const entityId = Number(entityData.id);
        console.log(`Fetching activities for ${entityType} ${entityId}...`);

        // Fetch all activity types
        // const [notes, tasks, meetings, emails, calls] = await Promise.all([
        //   getNotes(entityType, entityId),
        //   getTasks(entityType, entityId),
        //   getMeetings(entityType, entityId),
        //   getEmails(entityType, entityId),
        //   getCalls(entityType, entityId)
        // ]);

        // console.log('Fetched activities:', { notes, tasks, meetings, emails, calls });
  //promise.all will give results only when all datas like notes email etc are fetched
  //promise.all ->👉 If ONE API fails → EVERYTHING fails ❌
  const results = await Promise.allSettled([
  getNotes(entityType, entityId),
  getTasks(entityType, entityId),
  getMeetings(entityType, entityId),
  getEmails(entityType, entityId),
  getCalls(entityType, entityId)
]);

const notes = results[0].status === 'fulfilled' ? results[0].value : [];
const tasks = results[1].status === 'fulfilled' ? results[1].value : [];
const meetings = results[2].status === 'fulfilled' ? results[2].value : [];
const emails = results[3].status === 'fulfilled' ? results[3].value : [];
const calls = results[4].status === 'fulfilled' ? results[4].value : [];

        // Update state with real backend data only
        // Combine all activities for timeline view
        const allActivities = [
          ...(notes || []).map(note => ({ ...note, type: 'note' as const})),
          ...(emails || []).map(email => ({ ...email, type: 'email' as const })),
          ...(calls || []).map(call => ({ ...call, type: 'call' as const})),
          ...(tasks || []).map(task => ({ ...task, type: 'task' as const})),
          ...(meetings || []).map(meeting => ({ ...meeting, type: 'meeting' as const}))
        ];

        // Sort by creation date (newest first)
        allActivities.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

        setActivities({
          notes: notes || [],
          tasks: tasks || [],
          meetings: meetings || [],
          emails: (emails || []).map(email => ({
          ...email,
          type: 'email'
          })),
          calls: calls || [],
          // Use real activities for timeline and upcoming
          timeline: allActivities,
          upcoming: [] // Could be used for future scheduled activities
        });

      } catch (error) {
        console.error('Error fetching activities:', error);
        // Keep mock data if fetch fails
      } finally {
        setIsLoadingActivities(false);
      }
    };

    fetchActivities();
  }, [entityType, entityData?.id]);

// const handleActivityClick = (activityType: ActivityType) => {
//   if (onExternalActivityClick) {
//     onExternalActivityClick(activityType); // parent handles drawer
//   } else {
//     setCurrentActivityType(activityType); // fallback local state
//     setIsDrawerOpen(true);
//   }
// };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  const handleActivitySave = async (formData: any) => {
    setIsSaving(true);

    try {
      // Real Backend API calls
      let savedActivity;
      const entityId = Number(entityData.id);

      switch (currentActivityType) {
        case 'note':
          savedActivity = await createNote(entityType, entityId, { description: formData.description });
          break;
        case 'task':
          savedActivity = await createTask(entityType, entityId, {
            title: formData.title,
            description: formData.description,
            dueDate: formData.dueDate,
            priority: formData.priority,
            assignedTo: formData.assignedTo,
            status: 'Upcoming'
          });
          break;
        case 'meeting':
          savedActivity = await createMeeting(entityType, entityId, {
            title: formData.title,
            description: formData.description,
            date: formData.date,
            time: formData.time,
            duration: formData.duration,
            attendees: formData.attendees,
            location: formData.location
          });
          break;
        case 'email':
          savedActivity = await createEmail(entityType, entityId, {
            to: formData.to,
            subject: formData.subject,
            body: formData.body
          });
          break;
        case 'call':
          savedActivity = await createCall(entityType, entityId, {
            subject: `Call with ${formData.connectedTo || 'Contact'}`,
            duration: formData.duration || 'Not specified',
            description: formData.description,
            outcome: formData.outcome || 'Completed'
          });
          break;
        default:
          throw new Error(`Unsupported activity type: ${currentActivityType}`);
      }

      console.log('Activity saved successfully:', savedActivity);
      const activityWithType = {
       ...savedActivity,
       type: currentActivityType
        };

      // Update local state after successful save
      setActivities(prev => {
        const updated: any = { ...prev };
        if (currentActivityType === 'note') updated.notes = [savedActivity, ...prev.notes];
        if (currentActivityType === 'email') updated.emails = [activityWithType, ...prev.emails];
        if (currentActivityType === 'call') updated.calls = [savedActivity, ...prev.calls];
        if (currentActivityType === 'task') updated.tasks = [savedActivity, ...prev.tasks];
        if (currentActivityType === 'meeting') updated.meetings = [savedActivity, ...prev.meetings];

        // Update timeline with new activity
        updated.timeline = [activityWithType, ...prev.timeline];

        return updated;
      });

      handleDrawerClose();
    } catch (error) {
      console.error('Error saving activity:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsSaving(false);
    }
  };

  // 🔹 Search Filtering Logic
  const filterBySearch = (items: any[] | undefined) => {
    if (!items || !Array.isArray(items)) return [];
    if (!searchQuery) return items;
    const query = searchQuery.toLowerCase();
    return items.filter(item => {
      if (!item) return false;
      const searchableFields = ['title', 'description', 'subject', 'content', 'outcome', 'status', 'priority','recipients' ];
      return searchableFields.some(field => {
        const value = item[field];
        return value && value.toString().toLowerCase().includes(query);
      });
    });
  };

  const filteredTimeline = filterBySearch(activities.timeline);
  const filteredUpcoming = filterBySearch(activities.upcoming);
  const filteredNotes = filterBySearch(activities.notes);
  const filteredEmails = filterBySearch(activities.emails);
  console.log("RAW emails:", activities.emails);
  console.log("FILTERED emails:", filteredEmails);
  const filteredCalls = filterBySearch(activities.calls);
  const filteredTasks = filterBySearch(activities.tasks);
  const filteredMeetings = filterBySearch(activities.meetings);

  const renderActivityCard = (activity: any, isTimeline: boolean = false) => {
    if (!activity || !activity.type) {
      return null;
    }

    const navigationMap: { [key: string]: number } = {
      'note': 1,
      'email': 2,
      'call': 3,
      'task': 4,
      'meeting': 5
    };

    const handleNavigate = (type: string) => {
      const tabIndex = navigationMap[type];
      if (tabIndex !== undefined) {
        setActiveTab(tabIndex);
        // If navigating to Emails tab, scroll the emails container into view
        if (tabIndex === 2) {
          // allow render to complete
          setTimeout(() => {
            if (emailsRef.current) {
              emailsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else if (typeof window !== 'undefined') {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }, 50);
        }
      }
    };

    // Render rich activity cards for all entity types
    return (
      <CRDC
        type={activity.type}
        data={activity}
        isTimelineView={isTimeline}
        onNavigate={handleNavigate}
      />
    );
  };

  const getAITitle = () => {
    if (aiTitle) return aiTitle;
    switch (entityType) {
      case 'lead':
        return 'AI Lead Summary';
      case 'deal':
        return 'AI Deal Summary';
      case 'company':
        return 'AI Company Summary';
      case 'ticket':
        return 'AI Ticket Summary';
      default:
        return 'AI Summary';
    }
  };

  const getAIDescription = () => {
    if (aiDescription) return aiDescription;
    switch (entityType) {
      case 'lead':
        return 'There are no activities associated with this lead and further details are needed to provide a comprehensive summary.';
      case 'deal':
        return 'There are no activities associated with this deal. Further updates will appear here.';
      case 'company':
        return `${entityData?.name || 'This company'} is a promising company in the ${entityData?.industry || 'technology'} industry with strong growth potential.`;
      case 'ticket':
        return `The ticket titled "${entityData?.title || 'Payment Failure Issue'}" currently has no associated conversation, call, or note transcripts. There are no additional details or properties available for this ticket at this time.`;
      default:
        return 'There are no activities associated with this entity and further details are needed to provide a comprehensive summary.';
    }
  };

  return (
    <>
      <Box sx={{ p: 2 }}>
        {/* Main Content Layout */}
        <Stack direction="row" spacing={2} justifyContent="center">
          {/* Activity Tabs - Main Content */}
          <Box flex={1} sx={{ maxWidth: 720, width: '100%' }}>
            {/* Top Bar with Search and Convert Button - Only in Middle Content */}
            <Stack direction="row" spacing={2} mb={2} alignItems="center">
              <TextField
                placeholder="Search activities"
                size="small"
                sx={{ flex: 1 }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ fontSize: 16 }} />
                    </InputAdornment>
                  ),
                }}
              />

              {showConvertButton && (
                <Button
                  variant="contained"
                  onClick={onConvert}
                  sx={{
                    bgcolor: '#4F46E5',
                    textTransform: 'none',
                    borderRadius: 2,
                    px: 3,
                  }}
                >
                  Convert
                </Button>
              )}
            </Stack>

            <ActivityTab
              tabs={['Activity', 'Notes', 'Emails', 'Calls', 'Tasks', 'Meetings']}
              value={activeTab}
              onChange={setActiveTab}
            >
              {(tab) => (
                <>
                  {/* ACTIVITY TAB */}
                  {tab === 0 && (
                    <>
                      <Typography fontWeight={600} fontSize={14} mb={1}>
                        Upcoming
                      </Typography>

                      {filteredUpcoming.map((activity: any, index: number) => (
                        <div key={index}>
                          {renderActivityCard(activity, true)}
                        </div>
                      ))}

                      {filteredTimeline.length > 0 && (
                        <>
                          <Divider sx={{ my: 2 }} />

                          <Typography fontWeight={600} fontSize={14} mb={1}>
                            {month}
                          </Typography>

                          {filteredTimeline.map((activity: any, index: number) => (
                            <div key={index}>
                              {renderActivityCard(activity, true)}
                            </div>
                          ))}
                        </>
                      )}
                    </>
                  )}

                  {/* NOTES TAB */}
                  {tab === 1 && (
                    <DynamicActivitySection
                      title="Notes"
                      buttonLabel="Create Note"
                      onCreateClick={() => handleActivityClick('note')}
                    >
                      {isLoadingActivities ? (
                        <Typography>Loading notes...</Typography>
                      ) : (
                        (filteredNotes || []).map((note: any, index: number) => (
                          <CRDC key={index} type="note" data={note} />
                        ))
                      )}
                    </DynamicActivitySection>
                  )}

                  {/* EMAILS TAB */}
                  {tab === 2 && (
                    <div ref={emailsRef}>
                      <DynamicActivitySection
                        title="Emails"
                        buttonLabel="Create Email"
                        onCreateClick={() => handleActivityClick('email')}
                      >
                        {isLoadingActivities ? (
                          <Typography>Loading emails...</Typography>
                        ) : (
                          (filteredEmails || []).map((email: any, index: number) => (
                            <CRDC key={index} type="email" data={email} />
                          ))
                        )}
                      </DynamicActivitySection>
                    </div>
                  )}

                  {/* CALLS TAB */}
                  {tab === 3 && (
                    <DynamicActivitySection
                      title="Calls"
                      buttonLabel="Log Call"
                      onCreateClick={() => handleActivityClick('call')}
                    >
                      {isLoadingActivities ? (
                        <Typography>Loading calls...</Typography>
                      ) : (
                        (filteredCalls || []).map((call: any, index: number) => (
                          <CRDC key={index} type="call" data={call} />
                        ))
                      )}
                    </DynamicActivitySection>
                  )}

                  {/* TASKS TAB */}
                  {tab === 4 && (
                    <DynamicActivitySection
                      title="Tasks"
                      buttonLabel="Create Task"
                      onCreateClick={() => handleActivityClick('task')}
                    >
                      {isLoadingActivities ? (
                        <Typography>Loading tasks...</Typography>
                      ) : (
                        (filteredTasks || []).map((task: any, index: number) => (
                          <CRDC key={index} type="task" data={task} />
                        ))
                      )}
                    </DynamicActivitySection>
                  )}

                  {/* MEETINGS TAB */}
                  {tab === 5 && (
                    <DynamicActivitySection
                      title="Meetings"
                      buttonLabel="Schedule Meeting"
                      onCreateClick={() => handleActivityClick('meeting')}
                    >
                      {isLoadingActivities ? (
                        <Typography>Loading meetings...</Typography>
                      ) : (
                        (filteredMeetings || []).map((meeting: any, index: number) => (
                          <CRDC key={index} type="meeting" data={meeting} />
                        ))
                      )}
                    </DynamicActivitySection>
                  )}
                </>
              )}
            </ActivityTab>
          </Box>

          {/* Right Panel - AI Summary & Details */}
          <Box sx={{ width: 320 }}>
            <DetailsRightPanel
              title={getAITitle()}
              description={getAIDescription()}
              entityType={entityType}
              entityId={parseInt(entityData.id)}
            />
          </Box>
        </Stack>
      </Box>

      {/* Activity Drawer */}
      <DynamicActivityDrawer
 isOpen={externalIsDrawerOpen ?? isDrawerOpen}   // use prop if provided, else local state
  onClose={() => {
    if (onExternalDrawerClose) onExternalDrawerClose();
    setIsDrawerOpen(false);  // fallback for local state
  }}
  activityType={drawerActivityType || currentActivityType}  // prop overrides local state
  entityData={entityData}
  onSave={handleActivitySave}
  isSaving={isSaving}
      />
    </>
  );
};
