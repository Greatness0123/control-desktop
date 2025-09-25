/**
 * Copyright (c) 2025 Bytedance, Inc. and its affiliates.
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';

import { IMAGE_PLACEHOLDER } from '@ui-tars/shared/constants';
import { StatusEnum } from '@ui-tars/shared/types';

import { useRunAgent } from '@renderer/hooks/useRunAgent';
import { useStore } from '@renderer/hooks/useStore';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@renderer/components/ui/tooltip';
import { Button } from '@renderer/components/ui/button';
// import { useScreenRecord } from '@renderer/hooks/useScreenRecord';
import { api } from '@renderer/api';

import { Play, Send, Square, Loader2, Paperclip } from 'lucide-react';
import { Textarea } from '@renderer/components/ui/textarea';
import { useSession } from '@renderer/hooks/useSession';

import { Operator } from '@main/store/types';
import { useSetting } from '../../hooks/useSetting';
import FileAttachmentDialog from './FileAttachmentDialog';

const ChatInput = ({
  operator,
  sessionId,
  disabled,
  checkBeforeRun,
}: {
  operator: Operator;
  sessionId: string;
  disabled: boolean;
  checkBeforeRun?: () => Promise<boolean>;
}) => {
  const {
    status,
    instructions: savedInstructions,
    messages,
    restUserData,
  } = useStore();
  const [localInstructions, setLocalInstructions] = useState('');
  const { run, stopAgentRuning } = useRunAgent();
  const { getSession, updateSession, chatMessages } = useSession();
  const { settings, updateSetting } = useSetting();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const running = status === StatusEnum.RUNNING;
  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (status === StatusEnum.INIT) {
      return;
    }
  }, [status]);

  useEffect(() => {
    switch (operator) {
      case Operator.RemoteComputer:
        updateSetting({ ...settings, operator: Operator.RemoteComputer });
        break;
      case Operator.RemoteBrowser:
        updateSetting({ ...settings, operator: Operator.RemoteBrowser });
        break;
      case Operator.LocalComputer:
        updateSetting({ ...settings, operator: Operator.LocalComputer });
        break;
      case Operator.LocalBrowser:
        updateSetting({ ...settings, operator: Operator.LocalBrowser });
        break;
      default:
        updateSetting({ ...settings, operator: Operator.LocalComputer });
        break;
    }
  }, [operator]);

  const getInstantInstructions = () => {
    if (localInstructions?.trim()) {
      return localInstructions;
    }
    if (isCallUser && savedInstructions?.trim()) {
      return savedInstructions;
    }
    return '';
  };

  // console.log('running', 'status', status, running);

  const startRun = async () => {
    if (checkBeforeRun) {
      const checked = await checkBeforeRun();

      if (!checked) {
        return;
      }
    }

    const instructions = getInstantInstructions();

    console.log('startRun', instructions, restUserData);

    let history = chatMessages;

    const session = await getSession(sessionId);
    await updateSession(sessionId, {
      name: instructions,
      meta: {
        ...session!.meta,
        ...(restUserData || {}),
        // Include file info in session meta if file is selected
        ...(selectedFile ? {
          attachedFile: {
            name: selectedFile.name,
            type: selectedFile.type,
            size: selectedFile.size
          }
        } : {}),
      },
    });

    // If a file is selected, include file info in the instructions
    if (selectedFile) {
      // Convert file to base64 or appropriate format for sending
      const reader = new FileReader();
      reader.onload = async (e) => {
        const fileData = e.target?.result;
        
        // Create enhanced instructions string that includes file information and data
        const instructionsWithFile = `${instructions}\n\n[File attached: ${selectedFile.name} (${selectedFile.type})]\n[File data: ${fileData}]`;
        
        // Store file data in session meta for potential backend use
        const updatedSession = await getSession(sessionId);
        await updateSession(sessionId, {
          ...updatedSession,
          meta: {
            ...updatedSession!.meta,
            fileData: fileData, // Store the actual file data
          },
        });
        
        run(instructionsWithFile, history, () => {
          setLocalInstructions('');
          setSelectedFile(null);
        });
      };
      reader.readAsDataURL(selectedFile);
    } else {
      // Regular run without file
      run(instructions, history, () => {
        setLocalInstructions('');
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.nativeEvent.isComposing) {
      return;
    }

    // `enter` to submit
    if (
      e.key === 'Enter' &&
      !e.shiftKey &&
      !e.metaKey &&
      getInstantInstructions()
    ) {
      e.preventDefault();

      startRun();
    }
  };

  const isCallUser = useMemo(() => status === StatusEnum.CALL_USER, [status]);

  const lastHumanMessage =
    [...(messages || [])]
      .reverse()
      .find((m) => m?.from === 'human' && m?.value !== IMAGE_PLACEHOLDER)
      ?.value || '';

  const stopRun = async () => {
    await stopAgentRuning(() => {
      setLocalInstructions('');
    });
    await api.clearHistory();
  };

  const handleFileSelected = (file: File) => {
    setSelectedFile(file);
    setIsFileDialogOpen(false);
  };

  const renderButton = () => {
    if (running) {
      return (
        <Button
          variant="secondary"
          size="icon"
          className="h-8 w-8"
          onClick={stopRun}
        >
          <Square className="h-4 w-4" />
        </Button>
      );
    }

    if (isCallUser && !localInstructions) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 bg-pink-100 hover:bg-pink-200 text-pink-500 border-pink-200"
                onClick={startRun}
                disabled={!getInstantInstructions()}
              >
                <Play className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="whitespace-pre-line">
                send last instructions when you done for ui-tars&apos;s
                &apos;CALL_USER&apos;
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return (
      <Button
        variant="secondary"
        size="icon"
        className="h-8 w-8"
        onClick={startRun}
        disabled={!getInstantInstructions() || disabled}
      >
        <Send className="h-4 w-4" />
      </Button>
    );
  };

  return (
    <div className="px-4 w-full">
      <div className="flex flex-col space-y-4">
        <div className="relative w-full">
          <Textarea
            ref={textareaRef}
            placeholder={
              isCallUser && savedInstructions
                ? `${savedInstructions}`
                : running && lastHumanMessage && messages?.length > 1
                  ? lastHumanMessage
                  : 'What can I do for you today?'
            }
            className="min-h-[120px] rounded-2xl resize-none px-4 pb-16" // 调整内边距
            value={localInstructions}
            disabled={running || disabled}
            onChange={(e) => setLocalInstructions(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div className="absolute right-4 bottom-4 flex items-center gap-2">
            {running && (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            )}
            {/* File attachment button */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setIsFileDialogOpen(true)}
                    disabled={running || disabled}
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Attach a file</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {selectedFile && (
              <div className="text-xs text-muted-foreground">
                {selectedFile.name}
              </div>
            )}
            {renderButton()}
          </div>
        </div>
      </div>
      <FileAttachmentDialog 
        isOpen={isFileDialogOpen} 
        onClose={() => setIsFileDialogOpen(false)}
        onFileSelected={handleFileSelected}
      />
    </div>
  );
};

export default ChatInput;