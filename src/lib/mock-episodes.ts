import { Episode } from '@/types/episode';

export const mockEpisodes: Episode[] = [
  {
    id: '1',
    status: 'Success',
    startTime: '2024-05-28T14:30:00Z',
    endTime: '2024-05-28T14:32:15Z',
    duration: 135000, // 2 minutes 15 seconds
    dataProcessed: 1250,
    recordsProcessed: 5420,
    routineId: '1',
    routineName: 'Customer Data Sync',
  },
  {
    id: '2',
    status: 'Failed',
    startTime: '2024-05-28T13:15:00Z',
    endTime: '2024-05-28T13:16:45Z',
    duration: 105000, // 1 minute 45 seconds
    errorMessage: 'Connection timeout to data source',
    dataProcessed: 0,
    recordsProcessed: 0,
    routineId: '1',
    routineName: 'Customer Data Sync',
  },
  {
    id: '3',
    status: 'Success',
    startTime: '2024-05-28T12:00:00Z',
    endTime: '2024-05-28T12:03:22Z',
    duration: 202000, // 3 minutes 22 seconds
    dataProcessed: 2100,
    recordsProcessed: 8750,
    routineId: '1',
    routineName: 'Customer Data Sync',
  },
  {
    id: '4',
    status: 'Running',
    startTime: '2024-05-28T15:45:00Z',
    dataProcessed: 850,
    recordsProcessed: 3200,
    routineId: '1',
    routineName: 'Customer Data Sync',
  },
  {
    id: '5',
    status: 'Success',
    startTime: '2024-05-28T11:30:00Z',
    endTime: '2024-05-28T11:31:55Z',
    duration: 115000, // 1 minute 55 seconds
    dataProcessed: 980,
    recordsProcessed: 4100,
    routineId: '1',
    routineName: 'Customer Data Sync',
  },
  {
    id: '6',
    status: 'Warning',
    startTime: '2024-05-28T10:15:00Z',
    endTime: '2024-05-28T10:18:30Z',
    duration: 210000, // 3 minutes 30 seconds
    errorMessage: 'Partial data corruption detected',
    dataProcessed: 1850,
    recordsProcessed: 7200,
    routineId: '1',
    routineName: 'Customer Data Sync',
  },
  {
    id: '7',
    status: 'Success',
    startTime: '2024-05-28T09:00:00Z',
    endTime: '2024-05-28T09:02:10Z',
    duration: 130000, // 2 minutes 10 seconds
    dataProcessed: 1450,
    recordsProcessed: 6300,
    routineId: '1',
    routineName: 'Customer Data Sync',
  },
  {
    id: '8',
    status: 'Failed',
    startTime: '2024-05-28T08:30:00Z',
    endTime: '2024-05-28T08:30:45Z',
    duration: 45000, // 45 seconds
    errorMessage: 'Invalid data format in source file',
    dataProcessed: 0,
    recordsProcessed: 0,
    routineId: '1',
    routineName: 'Customer Data Sync',
  },
];
