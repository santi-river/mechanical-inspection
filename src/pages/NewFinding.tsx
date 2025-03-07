
import { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SignatureCanvas from "react-signature-canvas";
import SuccessDialog from "@/components/finding-form/SuccessDialog";
import FindingForm, { supervisors, technicians } from "@/components/finding-form/FindingForm";
import { useCreateFinding } from "@/hooks/useCreateFinding";

const NewFinding = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isSubmitting, showSuccess, setShowSuccess, saveFinding } = useCreateFinding();

  // Form state
  const [checklist, setChecklist] = useState("");
  const [equipment, setEquipment] = useState("");
  const [horometer, setHorometer] = useState("");
  const [maintenanceType, setMaintenanceType] = useState("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [supervisor, setSupervisor] = useState("");
  const [technician, setTechnician] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const signatureRef = useRef<SignatureCanvas | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = {
      checklist,
      equipment,
      horometer,
      maintenanceType,
      startDate,
      endDate,
      supervisor,
      technician,
      description,
      signatureRef,
      selectedFile,
      inspectionType: location.state?.type || "No especificado"
    };

    await saveFinding(formData);
  };

  return (
    <div className="min-h-screen pb-24 px-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold text-center my-8">Nuevo Hallazgo</h1>
      
      <FindingForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        onCancel={() => navigate("/")}
        checklist={checklist}
        setChecklist={setChecklist}
        equipment={equipment}
        setEquipment={setEquipment}
        horometer={horometer}
        setHorometer={setHorometer}
        maintenanceType={maintenanceType}
        setMaintenanceType={setMaintenanceType}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        supervisor={supervisor}
        setSupervisor={setSupervisor}
        technician={technician}
        setTechnician={setTechnician}
        description={description}
        setDescription={setDescription}
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
        signatureRef={signatureRef}
      />

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
