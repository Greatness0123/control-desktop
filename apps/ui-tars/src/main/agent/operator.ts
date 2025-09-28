/*
 * Copyright (c) 2025 Bytedance, Inc. and its affiliates.
 * SPDX-License-Identifier: Apache-2.0
 */
import { Key, keyboard } from '@computer-use/nut-js';
import {
  type ScreenshotOutput,
  type ExecuteParams,
  type ExecuteOutput,
  StatusEnum,
  } from '@ui-tars/sdk/core';
import {type ActionInputs} from '@ui-tars/shared/types'
import { NutJSOperator } from '@ui-tars/operator-nut-js';
import { clipboard } from 'electron';
import { desktopCapturer } from 'electron';

import * as env from '@main/env';
import { logger } from '@main/logger';
import { sleep } from '@ui-tars/shared/utils';
import { getScreenSize } from '@main/utils/screen';
import { executeSystemCommand } from './systemCommand';

// Extended action inputs type to include command property
interface ExtendedActionInputs extends ActionInputs {
  command?: string; // Added command property for system_command action
}

export class NutJSElectronOperator extends NutJSOperator {
  static MANUAL = {
    ACTION_SPACES: [
      `click(start_box='[x1, y1, x2, y2]')`,
      `left_double(start_box='[x1, y1, x2, y2]')`,
      `right_single(start_box='[x1, y1, x2, y2]')`,
      `drag(start_box='[x1, y1, x2, y2]', end_box='[x3, y3, x4, y4]')`,
      `hotkey(key='')`,
      `type(content='') #If you want to submit your input, use "\\n" at the end of \`content\`.`,
      `scroll(start_box='[x1, y1, x2, y2]', direction='down or up or right or left')`,
      `wait() #Sleep for 5s and take a screenshot to check for any changes.`,
      `system_command(command='') #Execute a system command in the terminal.`,
      `finished()`,
      `call_user() # Submit the task and call the user when the task is unsolvable, or when you need the user's help.`,
    ],
  };

  public async screenshot(): Promise<ScreenshotOutput> {
    const {
      physicalSize,
      logicalSize,
      scaleFactor,
      id: primaryDisplayId,
    } = getScreenSize(); // Logical = Physical / scaleX

    logger.info(
      '[screenshot] [primaryDisplay]',
      'logicalSize:',
      logicalSize,
      'scaleFactor:',
      scaleFactor,
    );

    const sources = await desktopCapturer.getSources({
      types: ['screen'],
      thumbnailSize: {
        width: Math.round(logicalSize.width),
        height: Math.round(logicalSize.height),
      },
    });
    const primarySource =
      sources.find(
        (source) => source.display_id === primaryDisplayId.toString(),
      ) || sources[0];

    if (!primarySource) {
      logger.error('[screenshot] Primary display source not found', {
        primaryDisplayId,
        availableSources: sources.map((s) => s.display_id),
      });
      // fallback to default screenshot
      return await super.screenshot();
    }

    const screenshot = primarySource.thumbnail;

    const resized = screenshot.resize({
      width: physicalSize.width,
      height: physicalSize.height,
    });

    return {
      base64: resized.toJPEG(75).toString('base64'),
      scaleFactor,
    };
  }

  async execute(params: ExecuteParams): Promise<ExecuteOutput> {
    const { action_type, action_inputs } = params.parsedPrediction;
    const extendedActionInputs = action_inputs as ExtendedActionInputs;

    if (action_type === 'system_command' && extendedActionInputs?.command) {
      const command = extendedActionInputs.command;
      logger.info('[device] system_command', command);
      
      try {
        const { stdout, stderr } = await executeSystemCommand(command);
        logger.info('[device] system_command completed successfully');
        if (stdout) {
          logger.debug('[device] system_command stdout:', stdout);
        }
        if (stderr) {
          logger.warn('[device] system_command stderr:', stderr);
        }
        
        // Since ExecuteOutput seems to only allow status, we'll return success
        // The actual output is logged above for debugging
        return {
          status: StatusEnum.RUNNING, // Command executed successfully, continue running
        } as ExecuteOutput;
      } catch (error) {
        // Type guard to safely access error properties
        const errorMessage = error instanceof Error 
          ? error.message 
          : typeof error === 'string' 
            ? error 
            : 'Unknown error occurred while executing command';
            
        logger.error('[device] system_command error:', errorMessage);
        
        // Return error status to indicate failure
        return {
          status: StatusEnum.ERROR,
        } as ExecuteOutput;
      }
    } else if (action_type === 'type' && env.isWindows && extendedActionInputs?.content) {
      const content = extendedActionInputs.content?.trim();

      logger.info('[device] type', content);
      const stripContent = content.replace(/\\n$/, '').replace(/\\n$/, '');
      const originalClipboard = clipboard.readText();
      clipboard.writeText(stripContent);
      await keyboard.pressKey(Key.LeftControl, Key.V);
      await sleep(50);
      await keyboard.releaseKey(Key.LeftControl, Key.V);
      await sleep(50);
      clipboard.writeText(originalClipboard);
      
      logger.info('[device] type completed successfully');
      
      // Return success status
      return {
        status: StatusEnum.RUNNING, // Typing completed successfully, continue running
      } as ExecuteOutput;
    } else {
      return await super.execute(params);
    }
  }
}