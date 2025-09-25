/**
 * Copyright (c) 2025 Bytedance, Inc. and its affiliates.
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState } from 'react';
import { AlertCircle, Camera, ChevronDown, Loader2, ChevronUp } from 'lucide-react';
import { ErrorStatusEnum } from '@ui-tars/shared/types';

import { Button } from '@renderer/components/ui/button';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@renderer/components/ui/alert';
import { Markdown } from '../markdown';

// Configuration for message truncation
const MESSAGE_CONFIG = {
  MAX_CHARS: 500, // Maximum characters to show before truncating
  MAX_LINES: 6,   // Maximum lines to show before truncating
};

const truncateText = (text: string, maxChars: number) => {
  if (text.length <= maxChars) return text;
  
  // Find the last space before the max character limit to avoid cutting words
  const truncateIndex = text.lastIndexOf(' ', maxChars);
  const cutIndex = truncateIndex > 0 ? truncateIndex : maxChars;
  
  return text.slice(0, cutIndex);
};

const shouldTruncateMessage = (text: string) => {
  const charCount = text.length;
  const lineCount = text.split('\n').length;
  
  return charCount > MESSAGE_CONFIG.MAX_CHARS || lineCount > MESSAGE_CONFIG.MAX_LINES;
};

export const HumanTextMessage = ({ text }: { text: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldTruncate = shouldTruncateMessage(text);
  
  const displayText = shouldTruncate && !isExpanded 
    ? truncateText(text, MESSAGE_CONFIG.MAX_CHARS)
    : text;
  
  return (
    <div className="flex gap-2 my-4 ml-4 items-start">
      <div className="ml-auto p-3 rounded-md bg-secondary max-w-[80%] relative">
        <div className="break-words whitespace-pre-wrap">
          {displayText}
          {shouldTruncate && !isExpanded && (
            <span className="text-muted-foreground">...</span>
          )}
        </div>
        
        {shouldTruncate && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 h-6 px-2 text-xs hover:bg-secondary-foreground/10"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-3 h-3 mr-1" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="w-3 h-3 mr-1" />
                Show More
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export const AssistantTextMessage = ({ text }: { text: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const cleanedText = text.replace(/\\n/g, '\n');
  const shouldTruncate = shouldTruncateMessage(cleanedText);
  
  const displayText = shouldTruncate && !isExpanded 
    ? truncateText(cleanedText, MESSAGE_CONFIG.MAX_CHARS)
    : cleanedText;
  
  return (
    <div className="flex gap-2 mb-4 items-start">
      <div className="mr-auto px-3 pt-3 pb-1 rounded-md bg-sky-100 max-w-[80%] relative">
        <div className="break-words">
          <Markdown>
            {shouldTruncate && !isExpanded 
              ? `${displayText}...` 
              : displayText
            }
          </Markdown>
        </div>
        
        {shouldTruncate && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 mb-2 h-6 px-2 text-xs hover:bg-sky-200/50"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-3 h-3 mr-1" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="w-3 h-3 mr-1" />
                Show More
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

interface ScreenshotMessageProps {
  onClick?: () => void;
}

export const ScreenshotMessage = ({ onClick }: ScreenshotMessageProps) => {
  return (
    <Button
      variant="outline"
      size="sm"
      className="rounded-full"
      onClick={onClick}
    >
      <Camera className="w-4 h-4" />
      <span>Screenshot</span>
    </Button>
  );
};

const getError = (text: string) => {
  let error: { message: string; stack: string };
  try {
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed === 'object' && parsed.status) {
      const errorStatus = ErrorStatusEnum[parsed.status] || 'Error';
      error = {
        message: `${errorStatus}: ${parsed.message}`,
        stack: parsed.stack || text,
      };
    } else {
      error = {
        message: `Error: ${parsed.message || ''}`,
        stack: parsed.stack || text,
      };
    }
  } catch (e) {
    error = {
      message: 'Error:',
      stack: text,
    };
  }

  return error;
};

export const ErrorMessage = ({ text }: { text: string }) => {
  const error = getError(text);
  const [isExpanded, setIsExpanded] = useState(false);

  const MAX_LINE = 2;
  const stackLines = error.stack.split('\n') || [];
  const hasMoreLines = stackLines.length > MAX_LINE;
  const displayedStack = isExpanded
    ? error.stack
    : stackLines.slice(0, MAX_LINE).join('\n');

  return (
    <Alert variant="destructive" className="my-4 border-destructive/50">
      <AlertCircle />
      <AlertTitle className="break-all">{error.message}</AlertTitle>
      <AlertDescription className="break-all whitespace-pre-wrap">
        {displayedStack}
        {hasMoreLines && (
          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 bottom-2 w-7 h-7 cursor-pointer hover:bg-red-50 hover:text-red-500"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <ChevronDown className={isExpanded ? 'rotate-180' : ''} />
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};

export const LoadingText = ({ text }: { text: string }) => {
  return (
    <div className="mt-4">
      <div className="inline-flex items-center gap-2 text-muted-foreground animate-pulse">
        <Loader2 className="h-4 w-4 animate-spin" />
        {text}
      </div>
    </div>
  );
};