
import { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SignatureCanvas from "react-signature-canvas";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import FileUpload from "@/components/finding-form/FileUpload";
import SignaturePad from "@/components/finding-form/SignaturePad";
import DateSelector from "@/components/finding-form/DateSelector";
import PersonSelector from "@/components/finding-form/PersonSelector";
import SuccessDialog from "@/components/finding-form/SuccessDialog";
import { format } from "date-fns";

const supervisors = [
  "Juan Pérez",
  "María González",
  "Carlos Rodríguez",
  "Ana Martínez",
];

const technicians = [
  "Pedro López",
  "Laura García",
  "Miguel Torres",
  "Isabel Sánchez",
];

const NewFinding = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showSuccess, setShowSuccess] = useState(false);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [checklist, setChecklist] = useState("");
  const [equipment, setEquipment] = useState("");
  const [horometer, setHorometer] = useState("");
  const [maintenanceType, setMaintenanceType] = useState("");
  const [supervisor, setSupervisor] = useState("");
  const [technician, setTechnician] = useState("");
  const [description, setDescription] = useState("");

  const signatureRef = useRef<SignatureCanvas | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation checks
    if (!checklist || !equipment || !horometer || !maintenanceType || !description || 
        !supervisor || !technician || !startDate || !endDate) {
      toast({
        title: "Error",
        description: "Por favor complete todos los campos requeridos.",
        variant: "destructive"
      });
      return;
    }
    
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      let signatureUrl = null;
      let fileUrl = null;

      // Upload signature if exists
      if (signatureRef.current && !signatureRef.current.isEmpty()) {
        const signatureBlob = await new Promise<Blob>((resolve) => {
          const canvas = signatureRef.current?.getTrimmedCanvas();
          canvas?.toBlob((blob) => resolve(blob as Blob));
        });

        const { data: signatureData, error: signatureError } = await supabase.storage
          .from('findings')
          .upload(`signatures/${Date.now()}.png`, signatureBlob, {
            contentType: 'image/png',
          });

        if (signatureError) throw signatureError;
        
        const { data: { publicUrl: signaturePublicUrl } } = supabase.storage
          .from('findings')
          .getPublicUrl(signatureData.path);
          
        signatureUrl = signaturePublicUrl;
      }

      // Upload file if exists
      if (selectedFile) {
        const { data: fileData, error: fileError } = await supabase.storage
          .from('findings')
          .upload(`files/${Date.now()}-${selectedFile.name}`, selectedFile);

        if (fileError) throw fileError;

        const { data: { publicUrl: filePublicUrl } } = supabase.storage
          .from('findings')
          .getPublicUrl(fileData.path);
          
        fileUrl = filePublicUrl;
      }

      console.log("Saving finding with dates:", {
        start_date: startDate ? format(startDate, 'yyyy-MM-dd') : null,
        end_date: endDate ? format(endDate, 'yyyy-MM-dd') : null
      });

      // Save finding data
      const { data, error: insertError } = await supabase
        .from('findings')
        .insert({
          checklist_name: checklist,
          equipment,
          horometer: parseInt(horometer),
          maintenance_type: maintenanceType,
          start_date: format(startDate, 'yyyy-MM-dd'),
          end_date: format(endDate, 'yyyy-MM-dd'),
          supervisor,
          technician,
          description,
          signature_url: signatureUrl,
          file_url: fileUrl,
          inspection_type: location.state?.type || "No especificado"
        })
        .select();

      if (insertError) throw insertError;

      console.log("Finding saved successfully:", data);
      setShowSuccess(true);
      toast({
        title: "Éxito",
        description: "El hallazgo ha sido guardado correctamente.",
      });
    } catch (error) {
      console.error('Error saving finding:', error);
      toast({
        title: "Error",
        description: "Hubo un error al guardar el hallazgo. Por favor, intente nuevamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pb-24 px-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold text-center my-8">Nuevo Hallazgo</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="checklist">Nombre del checklist</Label>
          <Input 
            id="checklist" 
            value={checklist}
            onChange={(e) => setChecklist(e.target.value)}
            required 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="equipment">Equipo</Label>
          <Input 
            id="equipment" 
            value={equipment}
            onChange={(e) => setEquipment(e.target.value)}
            required 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="horometer">Horómetro</Label>
          <Input 
            id="horometer" 
            type="number" 
            value={horometer}
            onChange={(e) => setHorometer(e.target.value)}
            required 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="maintenanceType">Tipo de mantenimiento</Label>
          <Select value={maintenanceType} onValueChange={setMaintenanceType} required>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PM1">PM1</SelectItem>
              <SelectItem value="PM2">PM2</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DateSelector
          label="Fecha de inicio"
          date={startDate}
          setDate={setStartDate}
        />

        <DateSelector
          label="Fecha de fin"
          date={endDate}
          setDate={setEndDate}
        />

        <PersonSelector
          label="Supervisor"
          value={supervisor}
          onChange={setSupervisor}
          options={supervisors}
          placeholder="Seleccionar supervisor"
        />

        <PersonSelector
          label="Técnico"
          value={technician}
          onChange={setTechnician}
          options={technicians}
          placeholder="Seleccionar técnico"
        />

        <FileUpload
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
        />

        <div className="space-y-2">
          <Label htmlFor="description">Descripción</Label>
          <Textarea
            id="description"
            placeholder="Ingrese la descripción del hallazgo"
            className="min-h-[100px]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <SignaturePad signatureRef={signatureRef} />

        <div className="flex space-x-4 pt-4">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => navigate("/")}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </form>

      <SuccessDialog 
        open={showSuccess}
        onOpenChange={setShowSuccess}
        onConfirm={() => {
          setShowSuccess(false);
          navigate("/");
        }}
      />
    </div>
  );
};

export default NewFinding;
