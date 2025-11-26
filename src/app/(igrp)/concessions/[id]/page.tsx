"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useConcession } from "@/app/(myapp)/hooks/useConcession";
// import { IGRPPageHeader, LoadingSpinner, ErrorMessage } from "@igrp/igrp-framework-react-design-system";

export default function ConcessionDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { getConcessionById, selectedConcession, isLoading, error } =
    useConcession();
  const id = params.id as string;

  useEffect(() => {
    if (id) {
      getConcessionById(id);
    }
  }, [id, getConcessionById]);

  if (isLoading) return <div className="p-6">Carregando...</div>;
  if (error)
    return <div className="p-6 text-red-600">Erro: {error.message}</div>;
  if (!selectedConcession)
    return <div className="p-6">Concessão não encontrada</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            Concessão #{selectedConcession.number}
          </h1>
          <p className="text-gray-600">Detalhes da concessão</p>
        </div>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 border rounded hover:bg-gray-50"
        >
          Voltar
        </button>
      </div>

      <div className="bg-white p-6 rounded shadow space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-lg mb-2">Informações Gerais</h3>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Status:</span>{" "}
                {selectedConcession.status}
              </p>
              <p>
                <span className="font-medium">Tipo:</span>{" "}
                {selectedConcession.type.name}
              </p>
              <p>
                <span className="font-medium">Início:</span>{" "}
                {new Date(selectedConcession.startDate).toLocaleDateString()}
              </p>
              <p>
                <span className="font-medium">Vencimento:</span>{" "}
                {new Date(selectedConcession.expiryDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Titular</h3>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Nome:</span>{" "}
                {selectedConcession.holder.name}
              </p>
              <p>
                <span className="font-medium">Documento:</span>{" "}
                {selectedConcession.holder.document}
              </p>
              <p>
                <span className="font-medium">Email:</span>{" "}
                {selectedConcession.holder.email}
              </p>
              <p>
                <span className="font-medium">Telefone:</span>{" "}
                {selectedConcession.holder.phone}
              </p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-2">Localização</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 bg-gray-50 rounded">
              <span className="block text-xs text-gray-500">Secção</span>
              <span className="font-medium">
                {selectedConcession.location.sector}
              </span>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <span className="block text-xs text-gray-500">Quadra</span>
              <span className="font-medium">
                {selectedConcession.location.block}
              </span>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <span className="block text-xs text-gray-500">Lote</span>
              <span className="font-medium">
                {selectedConcession.location.lot}
              </span>
            </div>
            {selectedConcession.location.grave && (
              <div className="p-3 bg-gray-50 rounded">
                <span className="block text-xs text-gray-500">Sepultura</span>
                <span className="font-medium">
                  {selectedConcession.location.grave}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
