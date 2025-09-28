/**
 * Copyright (c) 2025 Bytedance, Inc. and its affiliates.
 * SPDX-License-Identifier: Apache-2.0
 */
import { exec } from 'child_process';
import { promisify } from 'util';
import { logger } from '@main/logger';

const execPromise = promisify(exec);

/**
 * Execute a system command and return the result
 * @param command The command to execute
 * @returns Promise with stdout and stderr
 */
export async function executeSystemCommand(command: string): Promise<{stdout: string; stderr: string}> {
  try {
    logger.info(`[executeSystemCommand] Executing command: ${command}`);
    const { stdout, stderr } = await execPromise(command);
    logger.info(`[executeSystemCommand] Command executed successfully`);
    logger.debug(`[executeSystemCommand] stdout: ${stdout}`);
    
    if (stderr) {
      logger.warn(`[executeSystemCommand] stderr: ${stderr}`);
    }
    
    return { stdout, stderr };
  } catch (error) {
    // Type guard to safely access error properties
    const errorMessage = error instanceof Error 
      ? error.message 
      : typeof error === 'string' 
        ? error 
        : 'Unknown error occurred while executing command';
    
    logger.error(`[executeSystemCommand] Error executing command: ${errorMessage}`);
    
    return { 
      stdout: '', 
      stderr: errorMessage
    };
  }
}