
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface SuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

const SuccessDialog = ({ open, onOpenChange, onConfirm }: SuccessDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¡Hallazgo guardado con éxito!</DialogTitle>
        </DialogHeader>
        <p>El hallazgo ha sido registrado correctamente en el sistema.</p>
        <Button onClick={onConfirm}>
          Aceptar
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessDialog;
