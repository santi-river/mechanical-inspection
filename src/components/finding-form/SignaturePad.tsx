
import { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface SignaturePadProps {
  signatureRef: React.RefObject<SignatureCanvas>;
}

const SignaturePad = ({ signatureRef }: SignaturePadProps) => {
  return (
    <div className="space-y-2">
      <Label>Firma del inspector</Label>
      <div className="border rounded-md p-2 bg-white">
        <SignatureCanvas
          ref={signatureRef}
          canvasProps={{
            className: "w-full h-40 border rounded",
          }}
        />
      </div>
      <Button
        type="button"
        variant="outline"
        onClick={() => signatureRef.current?.clear()}
        className="w-full mt-2"
      >
        Limpiar firma
      </Button>
    </div>
  );
};

export default SignaturePad;
