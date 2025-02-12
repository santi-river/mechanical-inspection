
import { useState } from "react";
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(true);
    toast({
      title: "Éxito",
      description: "El hallazgo ha sido guardado correctamente.",
    });
  };

  return (
    <div className="min-h-screen pb-24 px-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold text-center my-8">Nuevo Hallazgo</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="checklist">Nombre del checklist</Label>
          <Input id="checklist" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="equipment">Equipo</Label>
          <Input id="equipment" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="horometer">Horómetro</Label>
          <Input id="horometer" type="number" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="maintenanceType">Tipo de mantenimiento</Label>
          <Select>
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

        <div className="space-y-2">
          <Label htmlFor="supervisor">Supervisor</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar supervisor" />
            </SelectTrigger>
            <SelectContent>
              {supervisors.map((supervisor) => (
                <SelectItem key={supervisor} value={supervisor}>
                  {supervisor}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="technician">Técnico</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar técnico" />
            </SelectTrigger>
            <SelectContent>
              {technicians.map((technician) => (
                <SelectItem key={technician} value={technician}>
                  {technician}
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
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Firma del inspector</Label>
          <div className="border rounded-md p-2 bg-white">
            <SignatureCanvas
              ref={(ref) => setSignature(ref)}
              canvasProps={{
                className: "w-full h-40 border rounded",
              }}
            />
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => signature?.clear()}
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
          >
            Cancelar
          </Button>
          <Button type="submit" className="w-full">
            Guardar
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
