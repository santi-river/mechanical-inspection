
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SignatureCanvas from "react-signature-canvas";
import FileUpload from "@/components/finding-form/FileUpload";
import SignaturePad from "@/components/finding-form/SignaturePad";
import DateSelector from "@/components/finding-form/DateSelector";
import PersonSelector from "@/components/finding-form/PersonSelector";

interface FindingFormProps {
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  onCancel: () => void;
  
  // Form state
  checklist: string;
  setChecklist: (value: string) => void;
  equipment: string;
  setEquipment: (value: string) => void;
  horometer: string;
  setHorometer: (value: string) => void;
  maintenanceType: string;
  setMaintenanceType: (value: string) => void;
  startDate: Date | undefined;
  setStartDate: (date: Date | undefined) => void;
  endDate: Date | undefined;
  setEndDate: (date: Date | undefined) => void;
  supervisor: string;
  setSupervisor: (value: string) => void;
  technician: string;
  setTechnician: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  signatureRef: React.RefObject<SignatureCanvas>;
}

export const supervisors = [
  "Juan Pérez",
  "María González",
  "Carlos Rodríguez",
  "Ana Martínez",
];

export const technicians = [
  "Pedro López",
  "Laura García",
  "Miguel Torres",
  "Isabel Sánchez",
];

const FindingForm = ({
  onSubmit,
  isSubmitting,
  onCancel,
  checklist,
  setChecklist,
  equipment,
  setEquipment,
  horometer,
  setHorometer,
  maintenanceType,
  setMaintenanceType,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  supervisor,
  setSupervisor,
  technician,
  setTechnician,
  description,
  setDescription,
  selectedFile,
  setSelectedFile,
  signatureRef,
}: FindingFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
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

      <DateSelector label="Fecha de inicio" date={startDate} setDate={setStartDate} />

      <DateSelector label="Fecha de fin" date={endDate} setDate={setEndDate} />

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

      <FileUpload selectedFile={selectedFile} setSelectedFile={setSelectedFile} />

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
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : "Guardar"}
        </Button>
      </div>
    </form>
  );
};

export default FindingForm;
