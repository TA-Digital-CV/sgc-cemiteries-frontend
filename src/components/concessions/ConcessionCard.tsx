import type React from "react";
import type { Concession } from "@/app/(myapp)/types/Concession";

// Assuming these components exist or we use placeholders if the package is not actually available in this environment
// For now, I'll use standard HTML/CSS structure that mimics a card
// import { Card, Badge, Button } from '@igrp/igrp-framework-react-design-system';

interface ConcessionCardProps {
  concession: Concession;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
}

export const ConcessionCard: React.FC<ConcessionCardProps> = ({
  concession,
  onView,
  onEdit,
}) => {
  return (
    <div className="p-4 border rounded shadow-sm hover:shadow-md transition-shadow bg-white">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold">{concession.number}</h3>
        <span
          className={`px-2 py-1 text-xs rounded ${
            concession.status === "ACTIVE"
              ? "bg-green-100 text-green-800"
              : concession.status === "EXPIRED"
                ? "bg-red-100 text-red-800"
                : "bg-gray-100 text-gray-800"
          }`}
        >
          {concession.status}
        </span>
      </div>

      <div className="mb-4 text-sm text-gray-600">
        <p>
          <strong>Titular:</strong> {concession.holder.name}
        </p>
        <p>
          <strong>Tipo:</strong> {concession.type.name}
        </p>
        <p>
          <strong>Vencimento:</strong>{" "}
          {new Date(concession.expiryDate).toLocaleDateString()}
        </p>
      </div>

      <div className="flex gap-2">
        {onView && (
          <button
            onClick={() => onView(concession.id)}
            className="px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
          >
            Ver Detalhes
          </button>
        )}
        {onEdit && (
          <button
            onClick={() => onEdit(concession.id)}
            className="px-3 py-1 text-sm text-gray-600 border border-gray-600 rounded hover:bg-gray-50"
          >
            Editar
          </button>
        )}
      </div>
    </div>
  );
};
