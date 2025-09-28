import { BrowserWindow } from 'electron';

import { logger } from '@main/logger';

import { createWindow } from './createWindow';

let mainWindow: BrowserWindow | null = null;

export function showInactive() {
  if (mainWindow) {
    mainWindow.showInactive();
  }
}

export function show() {
  if (mainWindow) {
    mainWindow.show();
  }
}

export function createMainWindow() {
  mainWindow = createWindow({
    routerPath: '/',
    width: 1200,
    height: 700,
    alwaysOnTop: false,
  });

  mainWindow.on('close', (event) => {
    logger.info('mainWindow closed');

    event.preventDefault();

    if (mainWindow?.isFullScreen()) {
      mainWindow?.setFullScreen(false);

      mainWindow?.once('leave-full-screen', () => {
        mainWindow?.hide();
      });
    } else {
      mainWindow?.hide();
    }
  });

  return mainWindow;
}

export function setContentProtection(enable: boolean) {
  mainWindow?.setContentProtection(enable);
}

export async function showWindow() {
  mainWindow?.setContentProtection(false);
  mainWindow?.setIgnoreMouseEvents(false);
  mainWindow?.show();
  mainWindow?.restore();
}

export async function hideMainWindow() {
  try {
    mainWindow?.setContentProtection(true);
    mainWindow?.setAlwaysOnTop(true);
    mainWindow?.setFocusable(false);
    mainWindow?.hide();
  } catch (error) {
    logger.error('[hideMainWindow]', error);
  }
}

export async function showMainWindow() {
  try {
    mainWindow?.setContentProtection(false);
    setTimeout(() => {
      mainWindow?.setAlwaysOnTop(false);
    }, 100);
    mainWindow?.setFocusable(true);
    mainWindow?.show();
  } catch (error) {
    logger.error('[showMainWindow]', error);
  }
}
