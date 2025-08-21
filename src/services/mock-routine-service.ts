/**
 * Mock data service for frontend-only application
 * Simulates API calls with realistic delays and mock data
 */

import { Routine, RoutineExecution, RoutineStatus, RoutineType } from '@/types/routine';
import { DashboardMetrics, PaginatedResponse } from '@/types';
import { mockRoutines } from '@/lib/mock-routines';
import { logger } from '@/lib/errors';

export interface RoutineFilters {
  search?: string;
  type?: RoutineType | 'All Types';
  status?: RoutineStatus | 'All Statuses';
  createdBy?: string;
  modifiedBy?: string;
  dateRange?: {
    from: Date;
    to: Date;
  };
  page?: number;
  limit?: number;
}

export interface RoutineResponse {
  routines: Routine[];
  total: number;
  page: number;
  totalPages: number;
}

class MockRoutineService {
  private delay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Fetch routines with filtering and pagination (mock implementation)
   */
  async getRoutines(filters: RoutineFilters = {}): Promise<RoutineResponse> {
    try {
      logger.info('Fetching routines (mock)', { filters });
      
      // Simulate API delay
      await this.delay(300);

      let filteredRoutines = [...mockRoutines];

      // Apply search filter
      if (filters.search) {
        filteredRoutines = filteredRoutines.filter(routine =>
          routine.name.toLowerCase().includes(filters.search!.toLowerCase()) ||
          routine.description.toLowerCase().includes(filters.search!.toLowerCase())
        );
      }

      // Apply type filter
      if (filters.type && filters.type !== 'All Types') {
        filteredRoutines = filteredRoutines.filter(routine => 
          routine.type === filters.type
        );
      }

      // Apply status filter
      if (filters.status && filters.status !== 'All Statuses') {
        filteredRoutines = filteredRoutines.filter(routine => 
          routine.lastEpisode.status === filters.status
        );
      }

      // Apply pagination
      const page = filters.page || 1;
      const limit = filters.limit || 50;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedRoutines = filteredRoutines.slice(startIndex, endIndex);

      const response: RoutineResponse = {
        routines: paginatedRoutines,
        total: filteredRoutines.length,
        page,
        totalPages: Math.ceil(filteredRoutines.length / limit),
      };

      logger.info('Successfully fetched routines (mock)', {
        count: response.routines.length,
        total: response.total,
      });

      return response;
    } catch (error) {
      logger.error('Failed to fetch routines (mock)', error as Error, { filters });
      throw error;
    }
  }

  /**
   * Get a specific routine by ID (mock implementation)
   */
  async getRoutine(id: string): Promise<Routine> {
    try {
      logger.info('Fetching routine (mock)', { routineId: id });
      
      // Simulate API delay
      await this.delay(200);

      const routine = mockRoutines.find(r => r.id === id);
      
      if (!routine) {
        throw new Error(`Routine with id ${id} not found`);
      }

      logger.info('Successfully fetched routine (mock)', { routineId: id });

      return routine;
    } catch (error) {
      logger.error('Failed to fetch routine (mock)', error as Error, { routineId: id });
      throw error;
    }
  }

  /**
   * Create a new routine (mock implementation)
   */
  async createRoutine(routine: Omit<Routine, 'id' | 'createdAt' | 'lastRun'>): Promise<Routine> {
    try {
      logger.info('Creating routine (mock)', { routineName: routine.name });
      
      // Simulate API delay
      await this.delay(500);

      const newRoutine: Routine = {
        ...routine,
        id: `routine_${Date.now()}`,
        lastRun: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };

      // In a real app, this would be saved somewhere
      logger.info('Successfully created routine (mock)', {
        routineId: newRoutine.id,
        routineName: newRoutine.name,
      });

      return newRoutine;
    } catch (error) {
      logger.error('Failed to create routine (mock)', error as Error, {
        routineName: routine.name,
      });
      throw error;
    }
  }

  /**
   * Update an existing routine (mock implementation)
   */
  async updateRoutine(id: string, updates: Partial<Routine>): Promise<Routine> {
    try {
      logger.info('Updating routine (mock)', { routineId: id, updates });
      
      // Simulate API delay
      await this.delay(400);

      const routine = mockRoutines.find(r => r.id === id);
      
      if (!routine) {
        throw new Error(`Routine with id ${id} not found`);
      }

      const updatedRoutine: Routine = {
        ...routine,
        ...updates,
        id, // Ensure ID doesn't change
      };

      logger.info('Successfully updated routine (mock)', { routineId: id });

      return updatedRoutine;
    } catch (error) {
      logger.error('Failed to update routine (mock)', error as Error, { routineId: id });
      throw error;
    }
  }

  /**
   * Delete a routine (mock implementation)
   */
  async deleteRoutine(id: string): Promise<void> {
    try {
      logger.info('Deleting routine (mock)', { routineId: id });
      
      // Simulate API delay
      await this.delay(300);

      const routine = mockRoutines.find(r => r.id === id);
      
      if (!routine) {
        throw new Error(`Routine with id ${id} not found`);
      }

      logger.info('Successfully deleted routine (mock)', { routineId: id });
    } catch (error) {
      logger.error('Failed to delete routine (mock)', error as Error, { routineId: id });
      throw error;
    }
  }

  /**
   * Execute a routine manually (mock implementation)
   */
  async executeRoutine(id: string): Promise<void> {
    try {
      logger.info('Executing routine (mock)', { routineId: id });
      
      // Simulate API delay
      await this.delay(1000);

      const routine = mockRoutines.find(r => r.id === id);
      
      if (!routine) {
        throw new Error(`Routine with id ${id} not found`);
      }

      logger.info('Successfully triggered routine execution (mock)', { routineId: id });
    } catch (error) {
      logger.error('Failed to execute routine (mock)', error as Error, { routineId: id });
      throw error;
    }
  }

  /**
   * Get dashboard metrics (mock implementation)
   */
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    try {
      logger.info('Fetching dashboard metrics (mock)');
      
      // Simulate API delay
      await this.delay(200);

      const metrics: DashboardMetrics = {
        totalRoutines: mockRoutines.length,
        activeRoutines: mockRoutines.filter(r => r.lastEpisode.status === 'Success' || r.lastEpisode.status === 'Running').length,
        failedEpisodes: mockRoutines.reduce((sum, r) => sum + r.failedEpisodes, 0),
        episodesToday: mockRoutines.length * 3, // Mock: assume 3 episodes per routine today
      };

      logger.info('Successfully fetched dashboard metrics (mock)');

      return metrics;
    } catch (error) {
      logger.error('Failed to fetch dashboard metrics (mock)', error as Error);
      throw error;
    }
  }

  /**
   * Get routine execution history (mock implementation)
   */
  async getRoutineHistory(
    id: string,
    page = 1,
    limit = 50
  ): Promise<PaginatedResponse<RoutineExecution>> {
    try {
      logger.info('Fetching routine history (mock)', { routineId: id, page, limit });
      
      // Simulate API delay
      await this.delay(400);

      // Generate mock execution history
      const executions: RoutineExecution[] = Array.from({ length: 20 }, (_, index) => ({
        id: `exec_${id}_${index}`,
        status: (['Success', 'Success', 'Success', 'Failed', 'Success'][index % 5]) as RoutineStatus,
        startTime: new Date(Date.now() - (index * 3600000)).toISOString(), // Hours ago
        endTime: new Date(Date.now() - (index * 3600000) + 300000).toISOString(), // 5 minutes later
        duration: 300000, // 5 minutes
        error: index % 5 === 3 ? 'Connection timeout' : undefined,
      }));

      // Apply pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedExecutions = executions.slice(startIndex, endIndex);

      const response: PaginatedResponse<RoutineExecution> = {
        data: paginatedExecutions,
        total: executions.length,
        page,
        totalPages: Math.ceil(executions.length / limit),
      };

      logger.info('Successfully fetched routine history (mock)', {
        routineId: id,
        executionCount: response.data.length,
      });

      return response;
    } catch (error) {
      logger.error('Failed to fetch routine history (mock)', error as Error, {
        routineId: id,
      });
      throw error;
    }
  }
}

// Export singleton instance
export const routineService = new MockRoutineService();
