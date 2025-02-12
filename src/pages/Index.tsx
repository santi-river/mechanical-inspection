
import { Wrench, Droplet, Circle, Tool } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Index = () => {
  const navigate = useNavigate();

  const inspectionTypes = [
    {
      title: "Mangueras",
      icon: <Droplet size={32} />,
      color: "bg-red-50",
    },
    {
      title: "Tuberías",
      icon: <Circle size={32} />,
      color: "bg-red-50",
    },
    {
      title: "Cilindros Hidráulicos",
      icon: <Tool size={32} />,
      color: "bg-red-50",
    },
    {
      title: "Palas",
      icon: <Wrench size={32} />,
      color: "bg-red-50",
    },
  ];

  return (
    <div className="min-h-screen pb-20 px-4">
      <h1 className="text-2xl font-semibold text-center my-8">
        Inspección Mecánica
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
        {inspectionTypes.map((type, index) => (
          <motion.button
            key={type.title}
            className={`${type.color} p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col items-center space-y-4 w-full hover-scale`}
            onClick={() => navigate("/new-finding", { state: { type: type.title } })}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="text-primary">{type.icon}</div>
            <span className="font-medium text-gray-800">{type.title}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default Index;
