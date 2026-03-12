import { msalInstance } from './auth/msal';
import { InteractionRequiredAuthError } from '@azure/msal-browser';

// Microsoft Graph API endpoints
const GRAPH_API_BASE = 'https://graph.microsoft.com/v1.0';
const GRAPH_API_BETA = 'https://graph.microsoft.com/beta';

// Required scopes for Teams meeting creation
const TEAMS_SCOPES = [
  'Calendars.ReadWrite',
  'OnlineMeetings.ReadWrite',
  'User.Read'
];

/**
 * Get access token for Microsoft Graph API
 */
async function getGraphAccessToken(): Promise<string> {
  try {
    const accounts = msalInstance.getAllAccounts();
    if (accounts.length === 0) {
      throw new Error('No authenticated user found. Please sign in.');
    }

    const request = {
      scopes: TEAMS_SCOPES,
      account: accounts[0],
    };

    try {
      // Try to acquire token silently
      const response = await msalInstance.acquireTokenSilent(request);
      return response.accessToken;
    } catch (error) {
      if (error instanceof InteractionRequiredAuthError) {
        // If silent acquisition fails, try interactive
        const response = await msalInstance.acquireTokenPopup(request);
        return response.accessToken;
      }
      throw error;
    }
  } catch (error) {
    console.error('Error acquiring access token:', error);
    throw new Error('Failed to authenticate with Microsoft Graph API');
  }
}

/**
 * Create a Teams online meeting
 */
export interface CreateTeamsMeetingParams {
  subject: string;
  startDateTime: string; // ISO 8601 format
  endDateTime: string; // ISO 8601 format
  attendees: Array<{
    emailAddress: string;
    name?: string;
  }>;
  body?: string;
  location?: string;
}

export interface TeamsMeeting {
  id: string;
  joinUrl: string;
  joinWebUrl: string;
  subject: string;
  startDateTime: string;
  endDateTime: string;
  onlineMeetingUrl: string;
  conferenceId?: string;
  tollNumber?: string;
  tollFreeNumber?: string;
}

/**
 * Create a Teams meeting and calendar event
 */
export async function createTeamsMeeting(
  params: CreateTeamsMeetingParams
): Promise<{ meeting: TeamsMeeting; error?: string }> {
  try {
    const accessToken = await getGraphAccessToken();

    // Step 1: Create online meeting
    const onlineMeetingResponse = await fetch(`${GRAPH_API_BASE}/me/onlineMeetings`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        startDateTime: params.startDateTime,
        endDateTime: params.endDateTime,
        subject: params.subject,
      }),
    });

    if (!onlineMeetingResponse.ok) {
      const errorData = await onlineMeetingResponse.json();
      throw new Error(errorData.error?.message || 'Failed to create online meeting');
    }

    const onlineMeeting = await onlineMeetingResponse.json();

    // Step 2: Create calendar event with the meeting
    const attendees = params.attendees.map(attendee => ({
      emailAddress: {
        address: attendee.emailAddress,
        name: attendee.name || attendee.emailAddress,
      },
      type: 'required',
    }));

    const calendarEvent = {
      subject: params.subject,
      body: {
        contentType: 'HTML',
        content: params.body || `
          <p>You have been invited to an interview.</p>
          <p><strong>Join the meeting:</strong> <a href="${onlineMeeting.joinUrl}">${onlineMeeting.joinUrl}</a></p>
        `,
      },
      start: {
        dateTime: params.startDateTime,
        timeZone: 'UTC',
      },
      end: {
        dateTime: params.endDateTime,
        timeZone: 'UTC',
      },
      location: params.location ? {
        displayName: params.location,
      } : undefined,
      attendees,
      isOnlineMeeting: true,
      onlineMeetingProvider: 'teamsForBusiness',
      onlineMeeting: {
        joinUrl: onlineMeeting.joinUrl,
      },
    };

    const calendarResponse = await fetch(`${GRAPH_API_BASE}/me/events`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(calendarEvent),
    });

    if (!calendarResponse.ok) {
      const errorData = await calendarResponse.json();
      console.warn('Calendar event creation failed:', errorData);
      // Continue anyway - we have the meeting link
    }

    const meeting: TeamsMeeting = {
      id: onlineMeeting.id,
      joinUrl: onlineMeeting.joinUrl,
      joinWebUrl: onlineMeeting.joinWebUrl || onlineMeeting.joinUrl,
      subject: params.subject,
      startDateTime: params.startDateTime,
      endDateTime: params.endDateTime,
      onlineMeetingUrl: onlineMeeting.joinUrl,
      conferenceId: onlineMeeting.audioConferencing?.conferenceId,
      tollNumber: onlineMeeting.audioConferencing?.tollNumber,
      tollFreeNumber: onlineMeeting.audioConferencing?.tollFreeNumber,
    };

    return { meeting };
  } catch (error: any) {
    console.error('Error creating Teams meeting:', error);
    return {
      meeting: null as any,
      error: error.message || 'Failed to create Teams meeting',
    };
  }
}

/**
 * Quick create Teams meeting (simplified version)
 */
export async function quickCreateTeamsMeeting(
  candidateName: string,
  candidateEmail: string,
  startDateTime: string,
  durationMinutes: number = 60
): Promise<{ meeting: TeamsMeeting; error?: string }> {
  const startDate = new Date(startDateTime);
  const endDate = new Date(startDate.getTime() + durationMinutes * 60000);

  return createTeamsMeeting({
    subject: `Interview with ${candidateName}`,
    startDateTime: startDate.toISOString(),
    endDateTime: endDate.toISOString(),
    attendees: [
      {
        emailAddress: candidateEmail,
        name: candidateName,
      },
    ],
    body: `
      <h2>Interview Invitation</h2>
      <p>Dear ${candidateName},</p>
      <p>You have been invited to an interview. Please join the meeting using the link below:</p>
      <p><strong>Duration:</strong> ${durationMinutes} minutes</p>
      <p>We look forward to speaking with you!</p>
    `,
  });
}

/**
 * Update Teams meeting
 */
export async function updateTeamsMeeting(
  meetingId: string,
  updates: Partial<CreateTeamsMeetingParams>
): Promise<{ success: boolean; error?: string }> {
  try {
    const accessToken = await getGraphAccessToken();

    const response = await fetch(`${GRAPH_API_BASE}/me/onlineMeetings/${meetingId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to update meeting');
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error updating Teams meeting:', error);
    return {
      success: false,
      error: error.message || 'Failed to update Teams meeting',
    };
  }
}

/**
 * Cancel Teams meeting
 */
export async function cancelTeamsMeeting(
  meetingId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const accessToken = await getGraphAccessToken();

    const response = await fetch(`${GRAPH_API_BASE}/me/onlineMeetings/${meetingId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok && response.status !== 204) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to cancel meeting');
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error cancelling Teams meeting:', error);
    return {
      success: false,
      error: error.message || 'Failed to cancel Teams meeting',
    };
  }
}

/**
 * Get user's calendar availability
 */
export async function getCalendarAvailability(
  startDateTime: string,
  endDateTime: string
): Promise<{ availableSlots: Array<{ start: string; end: string }>; error?: string }> {
  try {
    const accessToken = await getGraphAccessToken();

    const response = await fetch(`${GRAPH_API_BASE}/me/calendar/getSchedule`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        schedules: ['me'],
        startTime: {
          dateTime: startDateTime,
          timeZone: 'UTC',
        },
        endTime: {
          dateTime: endDateTime,
          timeZone: 'UTC',
        },
        availabilityViewInterval: 60,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to get availability');
    }

    const data = await response.json();
    const scheduleItems = data.value[0]?.scheduleItems || [];
    
    // Convert busy times to available slots
    const availableSlots: Array<{ start: string; end: string }> = [];
    // This is simplified - you'd need more logic to calculate actual free slots
    
    return { availableSlots };
  } catch (error: any) {
    console.error('Error getting calendar availability:', error);
    return {
      availableSlots: [],
      error: error.message || 'Failed to get calendar availability',
    };
  }
}

/**
 * Check if user has granted Teams permissions
 */
export async function checkTeamsPermissions(): Promise<{
  hasPermissions: boolean;
  missingScopes?: string[];
}> {
  try {
    const accounts = msalInstance.getAllAccounts();
    if (accounts.length === 0) {
      return { hasPermissions: false, missingScopes: TEAMS_SCOPES };
    }

    const account = accounts[0];
    const scopes = account.idTokenClaims?.scp?.split(' ') || [];
    
    const missingScopes = TEAMS_SCOPES.filter(
      scope => !scopes.includes(scope)
    );

    return {
      hasPermissions: missingScopes.length === 0,
      missingScopes: missingScopes.length > 0 ? missingScopes : undefined,
    };
  } catch (error) {
    console.error('Error checking Teams permissions:', error);
    return { hasPermissions: false, missingScopes: TEAMS_SCOPES };
  }
}

/**
 * Request Teams permissions
 */
export async function requestTeamsPermissions(): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const accounts = msalInstance.getAllAccounts();
    if (accounts.length === 0) {
      throw new Error('No authenticated user found');
    }

    await msalInstance.acquireTokenPopup({
      scopes: TEAMS_SCOPES,
      account: accounts[0],
    });

    return { success: true };
  } catch (error: any) {
    console.error('Error requesting Teams permissions:', error);
    return {
      success: false,
      error: error.message || 'Failed to request permissions',
    };
  }
}
