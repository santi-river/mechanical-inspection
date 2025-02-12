
import { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon } from "lucide-react";
import SignatureCanvas from "react-signature-canvas";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
  const [signature, setSignature] = useState<any>(null);
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

      // Save finding data
      const { error: insertError } = await supabase
        .from('findings')
        .insert({
          checklist_name: checklist,
          equipment,
          horometer: parseInt(horometer),
          maintenance_type: maintenanceType,
          start_date: startDate?.toISOString(),
          end_date: endDate?.toISOString(),
          supervisor,
          technician,
          description,
          signature_url: signatureUrl,
          file_url: fileUrl,
          inspection_type: location.state?.type || "No especificado"
        });

      if (insertError) throw insertError;

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
          <Select value={maintenanceType} onValueChange={setMaintenanceType}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PM1">PM1</SelectItem>
              <SelectItem value="PM2">PM2</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Fecha de inicio</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PPP") : "Seleccionar fecha"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>Fecha de fin</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "PPP") : "Seleccionar fecha"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space

-y-2">
          <Label htmlFor="supervisor">Supervisor</Label>
          <Select value={supervisor} onValueChange={setSupervisor}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar supervisor" />
            </SelectTrigger>
            <SelectContent>
              {supervisors.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="technician">Técnico</Label>
          <Select value={technician} onValueChange={setTechnician}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar técnico" />
            </SelectTrigger>
            <SelectContent>
              {technicians.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

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

      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¡Hallazgo guardado con éxito!</DialogTitle>
          </DialogHeader>
          <p>El hallazgo ha sido registrado correctamente en el sistema.</p>
          <Button onClick={() => {
            setShowSuccess(false);
            navigate("/");
          }}>
            Aceptar
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NewFinding;
