"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { ConcessionForm } from "@/components/concessions/ConcessionForm";
// import { IGRPPageHeader } from "@igrp/igrp-framework-react-design-system";

export default function CreateConcessionPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Nova Concessão</h1>
        <p className="text-gray-600">
          Preencha os dados para criar uma nova concessão
        </p>
      </div>

      <ConcessionForm
        onSuccess={() => router.push("/concessions")}
        onCancel={() => router.back()}
      />
    </div>
  );
}
