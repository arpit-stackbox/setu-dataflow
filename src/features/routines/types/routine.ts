export type RoutineStatus = 'Success' | 'Failed' | 'Running' | 'Warning';

export type RoutineType = 'Integration' | 'App Extension' | 'Orchestration' | 'Communication' | '-';

export interface Routine {
  id: string;
  name: string;
  description: string;
  type: RoutineType;
  sender: string;
  receiver: string;
  lastEpisode: {
    timestamp: string;
    status: RoutineStatus;
  };
  lastRun: string;
  failedEpisodes: number;
  modifiedBy: string;
  createdBy: string;
  createdAt?: string;
}

export interface RoutineExecution {
  id: string;
  status: RoutineStatus;
  startTime: string;
  endTime?: string;
  duration?: number;
  error?: string;
}
