import { Episode } from '@/features/episodes/types/episode';

export const mockEpisodes: Episode[] = [
  {
    id: '1',
    status: 'Success',
    startTime: '2024-05-28T14:30:00Z',
    endTime: '2024-05-28T14:32:15Z',
    duration: 135000, // 2 minutes 15 seconds
    progress: 100,
    steps: {
      completed: 8,
      total: 8,
    },
    retryInfo: {
      currentAttempt: 1,
      maxAttempts: 3,
    },
    routineId: '1',
    routineName: 'Customer Data Sync',
    payloadFiles: [
      {
        id: 'input-1',
        name: 'customer_sync_payload_20240528.json',
        size: 2048576, // 2MB
        type: 'input',
        downloadUrl: '/api/download/customer_sync_payload_20240528.json',
      },
      {
        id: 'input-2',
        name: 'sync_results_20240528.json',
        size: 1024000, // 1MB
        type: 'input',
        downloadUrl: '/api/download/sync_results_20240528.json',
      },
    ],
  },
  {
    id: '2',
    status: 'Failed',
    startTime: '2024-05-28T13:15:00Z',
    endTime: '2024-05-28T13:16:45Z',
    duration: 105000, // 1 minute 45 seconds
    progress: 25,
    steps: {
      completed: 2,
      total: 8,
    },
    errorDetails: 'Connection timeout to data source. Check network connectivity and firewall settings.',
    retryInfo: {
      currentAttempt: 3,
      maxAttempts: 3,
    },
    routineId: '1',
    routineName: 'Customer Data Sync',
    payloadFiles: [
      {
        id: 'input-2',
        name: 'customer_sync_payload_20240528_failed.json',
        size: 1536000, // 1.5MB
        type: 'input',
        downloadUrl: '/api/download/customer_sync_payload_20240528_failed.json',
      },
      {
        id: 'input4-2',
        name: 'error_log_20240528.txt',
        size: 8192, // 8KB
        type: 'input',
        downloadUrl: '/api/download/error_log_20240528.txt',
      },
    ],
  },
  {
    id: '3',
    status: 'Success',
    startTime: '2024-05-28T12:00:00Z',
    endTime: '2024-05-28T12:03:22Z',
    duration: 202000, // 3 minutes 22 seconds
    progress: 100,
    steps: {
      completed: 8,
      total: 8,
    },
    retryInfo: {
      currentAttempt: 1,
      maxAttempts: 3,
    },
    routineId: '1',
    routineName: 'Customer Data Sync',
    payloadFiles: [
      {
        id: 'input-3',
        name: 'customer_sync_payload_20240528_1200.json',
        size: 3145728, // 3MB
        type: 'input',
        downloadUrl: '/api/download/customer_sync_payload_20240528_1200.json',
      },
    ],
  },
  {
    id: '4',
    status: 'Running',
    startTime: '2024-05-28T15:45:00Z',
    duration: 180000, // 3 minutes so far (ongoing)
    progress: 65,
    steps: {
      completed: 5,
      total: 8,
    },
    retryInfo: {
      currentAttempt: 1,
      maxAttempts: 3,
    },
    routineId: '1',
    routineName: 'Customer Data Sync',
  },
  {
    id: '5',
    status: 'Success',
    startTime: '2024-05-28T11:30:00Z',
    endTime: '2024-05-28T11:31:55Z',
    duration: 115000, // 1 minute 55 seconds
    progress: 100,
    steps: {
      completed: 8,
      total: 8,
    },
    retryInfo: {
      currentAttempt: 1,
      maxAttempts: 3,
    },
    routineId: '1',
    routineName: 'Customer Data Sync',
  },
  {
    id: '6',
    status: 'Warning',
    startTime: '2024-05-28T10:15:00Z',
    endTime: '2024-05-28T10:18:30Z',
    duration: 210000, // 3 minutes 30 seconds
    progress: 100,
    steps: {
      completed: 8,
      total: 8,
    },
    errorDetails: 'Partial data corruption detected in 5% of records. Review data quality.',
    retryInfo: {
      currentAttempt: 2,
      maxAttempts: 3,
    },
    routineId: '1',
    routineName: 'Customer Data Sync',
  },
  {
    id: '7',
    status: 'Success',
    startTime: '2024-05-28T09:00:00Z',
    endTime: '2024-05-28T09:02:10Z',
    duration: 130000, // 2 minutes 10 seconds
    progress: 100,
    steps: {
      completed: 8,
      total: 8,
    },
    retryInfo: {
      currentAttempt: 1,
      maxAttempts: 3,
    },
    routineId: '1',
    routineName: 'Customer Data Sync',
  },
  {
    id: '8',
    status: 'Failed',
    startTime: '2024-05-28T08:30:00Z',
    endTime: '2024-05-28T08:30:45Z',
    duration: 45000, // 45 seconds
    progress: 10,
    steps: {
      completed: 1,
      total: 8,
    },
    errorDetails: 'Invalid data format in source file. Expected JSON, received XML.',
    retryInfo: {
      currentAttempt: 2,
      maxAttempts: 3,
      nextRetryAt: '2024-05-28T08:45:00Z',
    },
    routineId: '1',
    routineName: 'Customer Data Sync',
  },
];
