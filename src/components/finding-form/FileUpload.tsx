
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FileUploadProps {
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
}

const FileUpload = ({ selectedFile, setSelectedFile }: FileUploadProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="file">Archivo (foto o video)</Label>
      <Input
        id="file"
        type="file"
        accept="image/*,video/*"
        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
      />
      {selectedFile && (
        <p className="text-sm text-muted-foreground">
          Archivo seleccionado: {selectedFile.name}
        </p>
      )}
    </div>
  );
};

export default FileUpload;
