
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import SignatureCanvas from "react-signature-canvas";

interface FindingFormData {
  checklist: string;
  equipment: string;
  horometer: string;
  maintenanceType: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  supervisor: string;
  technician: string;
  description: string;
  signatureRef: React.RefObject<SignatureCanvas>;
  selectedFile: File | null;
  inspectionType: string;
}

export const useCreateFinding = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { toast } = useToast();

  const validateFormData = (data: FindingFormData) => {
    if (
      !data.checklist ||
      !data.equipment ||
      !data.horometer ||
      !data.maintenanceType ||
      !data.description ||
      !data.supervisor ||
      !data.technician ||
      !data.startDate ||
      !data.endDate
    ) {
      toast({
        title: "Error",
        description: "Por favor complete todos los campos requeridos.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const saveFinding = async (formData: FindingFormData) => {
    if (isSubmitting) return false;
    
    if (!validateFormData(formData)) {
      return false;
    }

    setIsSubmitting(true);

    try {
      let signatureUrl = null;
      let fileUrl = null;

      // Upload signature if exists
      if (
        formData.signatureRef.current &&
        !formData.signatureRef.current.isEmpty()
      ) {
        const signatureBlob = await new Promise<Blob>((resolve) => {
          const canvas = formData.signatureRef.current?.getTrimmedCanvas();
          canvas?.toBlob((blob) => resolve(blob as Blob));
        });

        const { data: signatureData, error: signatureError } = await supabase.storage
          .from("findings")
          .upload(`signatures/${Date.now()}.png`, signatureBlob, {
            contentType: "image/png",
          });

        if (signatureError) {
          console.error("Error uploading signature:", signatureError);
          throw signatureError;
        }

        const { data: { publicUrl: signaturePublicUrl } } = supabase.storage
          .from("findings")
          .getPublicUrl(signatureData.path);

        signatureUrl = signaturePublicUrl;
      }

      // Upload file if exists
      if (formData.selectedFile) {
        const { data: fileData, error: fileError } = await supabase.storage
          .from("findings")
          .upload(`files/${Date.now()}-${formData.selectedFile.name}`, formData.selectedFile);

        if (fileError) {
          console.error("Error uploading file:", fileError);
          throw fileError;
        }

        const { data: { publicUrl: filePublicUrl } } = supabase.storage
          .from("findings")
          .getPublicUrl(fileData.path);

        fileUrl = filePublicUrl;
      }

      // Format dates properly for database (YYYY-MM-DD)
      const formattedStartDate = formData.startDate 
        ? format(formData.startDate, "yyyy-MM-dd") 
        : null;
      
      const formattedEndDate = formData.endDate 
        ? format(formData.endDate, "yyyy-MM-dd") 
        : null;

      console.log("Saving finding with dates:", {
        start_date: formattedStartDate,
        end_date: formattedEndDate,
      });

      // Prepare data for insert
      const findingData = {
        checklist_name: formData.checklist,
        equipment: formData.equipment,
        horometer: parseInt(formData.horometer),
        maintenance_type: formData.maintenanceType,
        start_date: formattedStartDate,
        end_date: formattedEndDate,
        supervisor: formData.supervisor,
        technician: formData.technician,
        description: formData.description,
        signature_url: signatureUrl,
        file_url: fileUrl,
        inspection_type: formData.inspectionType || "No especificado",
      };

      console.log("Submitting finding data:", findingData);

      // Save finding data
      const { data, error: insertError } = await supabase
        .from("findings")
        .insert(findingData)
        .select();

      if (insertError) {
        console.error("Supabase insert error:", insertError);
        throw insertError;
      }

      console.log("Finding saved successfully:", data);
      setShowSuccess(true);
      toast({
        title: "Éxito",
        description: "El hallazgo ha sido guardado correctamente.",
      });
      
      return true;
    } catch (error: any) {
      console.error("Error saving finding:", error);
      toast({
        title: "Error",
        description: error.message || "Hubo un error al guardar el hallazgo. Por favor, intente nuevamente.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    showSuccess,
    setShowSuccess,
    saveFinding,
  };
};
