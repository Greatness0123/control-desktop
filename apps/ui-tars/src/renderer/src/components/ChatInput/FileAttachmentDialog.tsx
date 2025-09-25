/*
 * Copyright (c) 2025 Bytedance, Inc. and its affiliates.
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Copyright (c) 2025 Bytedance, Inc. and its affiliates.
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useRef, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@renderer/components/ui/dialog';
import { Button } from '@renderer/components/ui/button';
import { FileImage, FileText } from 'lucide-react';

interface FileAttachmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onFileSelected: (file: File) => void;
}

const FileAttachmentDialog: React.FC<FileAttachmentDialogProps> = ({
  isOpen,
  onClose,
  onFileSelected,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (selectedFile) {
      onFileSelected(selectedFile);
      setSelectedFile(null);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Attach a File</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          {/* <div 
            className="flex flex-col items-center justify-center p-6 border rounded-lg cursor-pointer hover:bg-gray-50"
            onClick={() => fileInputRef.current?.click()}
          >
            <FileText className="h-10 w-10 text-blue-500 mb-2" />
            <span className="text-sm font-medium">Upload Files</span>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.txt,.csv,.xlsx,.xls"
            />
          </div> */}
          <div 
            className="flex flex-col items-center justify-center p-6 border rounded-lg cursor-pointer hover:bg-gray-50"
            onClick={() => photoInputRef.current?.click()}
          >
            <FileImage className="h-10 w-10 text-green-500 mb-2" />
            <span className="text-sm font-medium">Upload Photos</span>
            <input
              type="file"
              ref={photoInputRef}
              className="hidden"
              onChange={handleFileChange}
              accept="image/*"
            />
          </div>
        </div>
        {selectedFile && (
          <div className="bg-gray-50 p-2 rounded-md">
            <p className="text-sm">Selected: {selectedFile.name}</p>
          </div>
        )}
        <DialogFooter className="sm:justify-end">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!selectedFile}
          >
            Attach
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FileAttachmentDialog;