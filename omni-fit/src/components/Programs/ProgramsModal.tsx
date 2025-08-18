import { Dumbbell } from 'lucide-react';
import { ProgramsView } from './ProgramsView';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogBody,
} from '@/components/ui/adaptive-dialog';

interface ProgramsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProgramsModal({ isOpen, onClose }: ProgramsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent hideCloseButton>
        <DialogHeader
          gradient="from-indigo-600 to-purple-600"
          icon={<Dumbbell className="w-8 h-8 text-white" />}
          subtitle="Suivez des programmes structurés pour progresser rapidement"
        >
          Programmes d'Entraînement
        </DialogHeader>

        <DialogBody className="p-6">
          <ProgramsView />
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}