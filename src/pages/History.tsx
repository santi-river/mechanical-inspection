
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { Wrench, Droplet, Circle, Cylinder } from "lucide-react";

type Finding = {
  id: string;
  created_at: string;
  checklist_name: string;
  equipment: string;
  horometer: number;
  maintenance_type: string;
  start_date: string;
  end_date: string;
  supervisor: string;
  technician: string;
  description: string;
  signature_url?: string;
  file_url?: string;
  inspection_type: string;
}

const getInspectionIcon = (type: string) => {
  switch (type) {
    case "Mangueras":
      return <Droplet size={24} />;
    case "Tuberías":
      return <Circle size={24} />;
    case "Cilindros Hidráulicos":
      return <Cylinder size={24} />;
    case "Palas":
      return <Wrench size={24} />;
    default:
      return <Wrench size={24} />;
  }
};

const History = () => {
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(null);

  const { data: findings, isLoading } = useQuery({
    queryKey: ['findings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('findings')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Finding[];
    }
  });

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Cargando...</div>;
  }

  return (
    <div className="min-h-screen pb-24 px-4">
      <h1 className="text-2xl font-semibold text-center my-8">Historial de Hallazgos</h1>
      
      <div className="max-w-2xl mx-auto space-y-4">
        {findings?.map((finding) => (
          <Card 
            key={finding.id} 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setSelectedFinding(finding)}
          >
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="text-primary">
                {getInspectionIcon(finding.inspection_type)}
              </div>
              <div>
                <CardTitle className="text-lg">{finding.checklist_name}</CardTitle>
                <CardDescription>
                  {format(new Date(finding.created_at), 'dd/MM/yyyy HH:mm')}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Equipo: {finding.equipment}</p>
              <p className="text-sm text-gray-600">Tipo: {finding.inspection_type}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedFinding} onOpenChange={() => setSelectedFinding(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalles del Hallazgo</DialogTitle>
          </DialogHeader>
          {selectedFinding && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold">Checklist</h3>
                  <p>{selectedFinding.checklist_name}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Equipo</h3>
                  <p>{selectedFinding.equipment}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Horómetro</h3>
                  <p>{selectedFinding.horometer}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Tipo de Mantenimiento</h3>
                  <p>{selectedFinding.maintenance_type}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Fecha de Inicio</h3>
                  <p>{format(new Date(selectedFinding.start_date), 'dd/MM/yyyy')}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Fecha de Fin</h3>
                  <p>{format(new Date(selectedFinding.end_date), 'dd/MM/yyyy')}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Supervisor</h3>
                  <p>{selectedFinding.supervisor}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Técnico</h3>
                  <p>{selectedFinding.technician}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold">Descripción</h3>
                <p className="mt-1">{selectedFinding.description}</p>
              </div>

              {selectedFinding.file_url && (
                <div>
                  <h3 className="font-semibold">Archivo Adjunto</h3>
                  {selectedFinding.file_url.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                    <img 
                      src={selectedFinding.file_url} 
                      alt="Archivo adjunto" 
                      className="mt-2 max-w-full h-auto rounded-lg"
                    />
                  ) : (
                    <a 
                      href={selectedFinding.file_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Ver archivo adjunto
                    </a>
                  )}
                </div>
              )}

              {selectedFinding.signature_url && (
                <div>
                  <h3 className="font-semibold">Firma</h3>
                  <img 
                    src={selectedFinding.signature_url} 
                    alt="Firma" 
                    className="mt-2 max-h-40 rounded-lg"
                  />
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default History;
