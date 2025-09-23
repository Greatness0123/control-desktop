// Add this utility class to your global CSS (e.g., index.css or tailwind.css):
// .scrollbar-hide { scrollbar-width: none; -ms-overflow-style: none; } .scrollbar-hide::-webkit-scrollbar { display: none; }
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@renderer/components/ui/dialog';
import { Button } from '@renderer/components/ui/button';
import { LocalStore } from '@main/store/validate';

import { VLMSettings, VLMSettingsRef } from './category/vlm';
import { useRef } from 'react';

interface LocalSettingsDialogProps {
  isOpen: boolean;
  onSubmit: () => void;
  onClose: () => void;
}

export const checkVLMSettings = async () => {
  const settingRpc = window.electron.setting;

  const currentSetting = ((await settingRpc.getSetting()) ||
    {}) as Partial<LocalStore>;
  const { vlmApiKey, vlmBaseUrl, vlmModelName, vlmProvider } = currentSetting;

  if (vlmApiKey && vlmBaseUrl && vlmModelName && vlmProvider) {
    return true;
  }

  return false;
};

export const LocalSettingsDialog = ({
  isOpen,
  onSubmit,
  onClose,
}: LocalSettingsDialogProps) => {
  const vlmSettingsRef = useRef<VLMSettingsRef>(null);

  const handleGetStart = async () => {
    try {
      await vlmSettingsRef.current?.submit();
      onSubmit();
    } catch (error) {
      console.error('Failed to submit settings:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[480px] h-[520px] flex flex-col">
        <DialogHeader>
          <DialogTitle>Model Settings</DialogTitle>
          <DialogDescription>
            Enter Model settings to enable the model to control the local computer
            or browser. <i>a Vision-language model is very well preferred</i>
          </DialogDescription>
        </DialogHeader>
        <div
          className="flex-1 overflow-y-auto scrollbar-hide px-2"
          style={{ minHeight: 0 }}
        >
          <VLMSettings ref={vlmSettingsRef} />
        </div>
        <Button className="mt-8 mx-8" onClick={handleGetStart}>
          Get Started
        </Button>
      </DialogContent>
    </Dialog>
  );
};
