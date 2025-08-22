import { Routine } from '@/features/routines/types/routine';
import { DashboardMetrics } from '@/types';

export const mockMetrics: DashboardMetrics = {
  totalRoutines: 15,
  activeRoutines: 12,
  failedEpisodes: 3,
  episodesToday: 420,
};

export const mockRoutines: Routine[] = [
  {
    id: '1',
    name: 'Customer Data Sync',
    description: 'Syncs customer data from CRM to data warehouse',
    type: 'Integration',
    sender: 'SBX (WMS)',
    receiver: 'MuleSoft',
    lastEpisode: {
      timestamp: '2024-05-28T14:30:00Z',
      status: 'Success'
    },
    lastRun: '2024-05-28T14:30:00Z',
    failedEpisodes: 2,
    modifiedBy: 'Megha Sharma',
    createdBy: 'Aditya Deswal'
  },
  {
    id: '2',
    name: 'Inventory Pipeline',
    description: 'Processes inventory updates from multiple sources',
    type: 'Integration',
    sender: 'Azure',
    receiver: 'SBX (YMS)',
    lastEpisode: {
      timestamp: '2024-05-28T12:15:00Z',
      status: 'Failed'
    },
    lastRun: '2024-05-28T12:15:00Z',
    failedEpisodes: 5,
    modifiedBy: 'Sarah',
    createdBy: 'Bhawani Patidar'
  },
  {
    id: '3',
    name: 'Daily Reports Generator',
    description: 'Generates daily analytics reports',
    type: 'App Extension',
    sender: 'Portal',
    receiver: 'S3 Reports',
    lastEpisode: {
      timestamp: '2024-05-28T16:00:00Z',
      status: 'Running'
    },
    lastRun: '2024-05-28T16:00:00Z',
    failedEpisodes: 1,
    modifiedBy: 'Shubham Tharani',
    createdBy: 'Vinayak Sharma'
  },
  {
    id: '4',
    name: 'User Activity Aggregation',
    description: 'Aggregates user activity data for analytics',
    type: 'Orchestration',
    sender: 'Azure',
    receiver: 'SBX (TMS)',
    lastEpisode: {
      timestamp: '2024-05-28T10:45:00Z',
      status: 'Warning'
    },
    lastRun: '2024-05-28T10:45:00Z',
    failedEpisodes: 3,
    modifiedBy: 'Megha Sharma',
    createdBy: 'Arpit Singhania'
  },
  {
    id: '5',
    name: 'OTP Notification Service',
    description: 'Sends OTPs and transactional emails',
    type: 'Communication',
    sender: 'Aisensy',
    receiver: 'SBX (TMS)',
    lastEpisode: {
      timestamp: '2024-05-25T09:00:00Z',
      status: 'Success'
    },
    lastRun: '2024-05-25T09:00:00Z',
    failedEpisodes: 0,
    modifiedBy: 'Aditya Deswal',
    createdBy: 'Sarah'
  },
  {
    id: '6',
    name: 'Financial Data Pipeline',
    description: 'Processes financial transactions and settlements',
    type: 'Integration',
    sender: 'Banking API',
    receiver: 'SBX (Core)',
    lastEpisode: {
      timestamp: '2024-05-28T18:20:00Z',
      status: 'Success'
    },
    lastRun: '2024-05-28T18:20:00Z',
    failedEpisodes: 1,
    modifiedBy: 'Rakesh Kumar',
    createdBy: 'Megha Sharma'
  },
  {
    id: '7',
    name: 'Compliance Report Generator',
    description: 'Generates regulatory compliance reports',
    type: 'App Extension',
    sender: 'Compliance DB',
    receiver: 'Report Portal',
    lastEpisode: {
      timestamp: '2024-05-28T20:00:00Z',
      status: 'Failed'
    },
    lastRun: '2024-05-28T20:00:00Z',
    failedEpisodes: 2,
    modifiedBy: 'Priya Singh',
    createdBy: 'Vinayak Sharma'
  },
  {
    id: '8',
    name: 'Real-time Fraud Detection',
    description: 'Monitors transactions for fraud patterns',
    type: 'Orchestration',
    sender: 'Transaction Stream',
    receiver: 'Fraud Engine',
    lastEpisode: {
      timestamp: '2024-05-28T21:15:00Z',
      status: 'Running'
    },
    lastRun: '2024-05-28T21:15:00Z',
    failedEpisodes: 0,
    modifiedBy: 'Amit Patel',
    createdBy: 'Arpit Singhania'
  },
  {
    id: '9',
    name: 'SMS Alert Service',
    description: 'Sends transaction alerts via SMS',
    type: 'Communication',
    sender: 'Alert Engine',
    receiver: 'SMS Gateway',
    lastEpisode: {
      timestamp: '2024-05-28T22:30:00Z',
      status: 'Success'
    },
    lastRun: '2024-05-28T22:30:00Z',
    failedEpisodes: 1,
    modifiedBy: 'Neha Gupta',
    createdBy: 'Bhawani Patidar'
  },
  {
    id: '10',
    name: 'Merchant Data Sync',
    description: 'Synchronizes merchant data across platforms',
    type: 'Integration',
    sender: 'Merchant Portal',
    receiver: 'SBX (MMS)',
    lastEpisode: {
      timestamp: '2024-05-28T23:45:00Z',
      status: 'Warning'
    },
    lastRun: '2024-05-28T23:45:00Z',
    failedEpisodes: 3,
    modifiedBy: 'Rohit Sharma',
    createdBy: 'Aditya Deswal'
  },
  {
    id: '11',
    name: 'Analytics Dashboard Feed',
    description: 'Feeds data to analytics dashboards',
    type: 'App Extension',
    sender: 'Data Warehouse',
    receiver: 'Analytics UI',
    lastEpisode: {
      timestamp: '2024-05-29T01:00:00Z',
      status: 'Success'
    },
    lastRun: '2024-05-29T01:00:00Z',
    failedEpisodes: 0,
    modifiedBy: 'Deepak Jain',
    createdBy: 'Shubham Tharani'
  },
  {
    id: '12',
    name: 'Webhook Event Processor',
    description: 'Processes incoming webhook events',
    type: 'Orchestration',
    sender: 'External APIs',
    receiver: 'Event Queue',
    lastEpisode: {
      timestamp: '2024-05-29T02:15:00Z',
      status: 'Running'
    },
    lastRun: '2024-05-29T02:15:00Z',
    failedEpisodes: 2,
    modifiedBy: 'Kavya Reddy',
    createdBy: 'Megha Sharma'
  },
  {
    id: '13',
    name: 'Email Campaign Manager',
    description: 'Manages marketing email campaigns',
    type: 'Communication',
    sender: 'Marketing DB',
    receiver: 'Email Service',
    lastEpisode: {
      timestamp: '2024-05-29T03:30:00Z',
      status: 'Failed'
    },
    lastRun: '2024-05-29T03:30:00Z',
    failedEpisodes: 4,
    modifiedBy: 'Anita Verma',
    createdBy: 'Sarah'
  },
  {
    id: '14',
    name: 'Inventory Reconciliation',
    description: 'Reconciles inventory data across warehouses',
    type: 'Integration',
    sender: 'WMS Systems',
    receiver: 'Central Inventory',
    lastEpisode: {
      timestamp: '2024-05-29T04:45:00Z',
      status: 'Success'
    },
    lastRun: '2024-05-29T04:45:00Z',
    failedEpisodes: 1,
    modifiedBy: 'Rajesh Khanna',
    createdBy: 'Vinayak Sharma'
  },
  {
    id: '15',
    name: 'Payment Gateway Sync',
    description: 'Synchronizes payment gateway transactions',
    type: 'Orchestration',
    sender: 'Payment Gateways',
    receiver: 'Transaction DB',
    lastEpisode: {
      timestamp: '2024-05-29T06:00:00Z',
      status: 'Warning'
    },
    lastRun: '2024-05-29T06:00:00Z',
    failedEpisodes: 2,
    modifiedBy: 'Sunita Joshi',
    createdBy: 'Arpit Singhania'
  }
];
