import api from './api';
import { ENDPOINTS } from '../config/api';

interface CalendarEvent {
  id: number;
  title: string;
  start: string;
  client: {
    id: number;
    name: string;
    clientId: string;
  };
  case: {
    id: number;
    caseId: string;
    courtDetails: string;
  };
  notes: string;
  status: string;
}

interface TodayHearing {
  id: number;
  time: string;
  client: string;
  case: string;
  courtDetails: string;
  status: string;
}

interface UpcomingHearings {
  [date: string]: TodayHearing[];
}

const getCalendarEvents = async (params?: {
  startDate?: string;
  endDate?: string;
  caseId?: number;
  clientId?: number;
}): Promise<{ count: number; data: CalendarEvent[] }> => {
  return api.get(ENDPOINTS.CALENDAR, { params });
};

const getTodayHearings = async (): Promise<{ count: number; data: TodayHearing[] }> => {
  return api.get(ENDPOINTS.CALENDAR_TODAY);
};

const getUpcomingHearings = async (days?: number): Promise<{ data: UpcomingHearings }> => {
  return api.get(ENDPOINTS.CALENDAR_UPCOMING, { params: { days } });
};

const calendarService = {
  getCalendarEvents,
  getTodayHearings,
  getUpcomingHearings
};

export default calendarService;