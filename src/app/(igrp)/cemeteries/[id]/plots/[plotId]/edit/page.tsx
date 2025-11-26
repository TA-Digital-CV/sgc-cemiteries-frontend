"use client";

import {
  IGRPBadge,
  IGRPButton,
  IGRPCard,
  IGRPCardContent,
  IGRPCardHeader,
  IGRPCardTitle,
  IGRPIcon,
  IGRPLabel,
  IGRPPageHeader,
  useIGRPToast,
} from "@igrp/igrp-framework-react-design-system";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useCemetery } from "@/app/(myapp)/hooks/useCemetery";
import { usePlot } from "@/app/(myapp)/hooks/usePlot";
import { PlotService } from "@/app/(myapp)/services/plotService";
import type {
  Cemetery,
  CemeteryBlock,
  CemeterySection,
} from "@/app/(myapp)/types/cemetery";
import type { PlotFormData } from "@/app/(myapp)/types/Plot";
import { PlotForm } from "@/components/forms/PlotForm";

/**
 * PlotEditPage
 *
 * Renders a dedicated page to edit a plot using reusable PlotForm and DS components.
 * Loads plot data, applies validations, supports responsive UI, and integrates with API.
 * Includes image upload and preview with backend integration when available.
 */
export default function PlotEditPage() {
  const router = useRouter();
  const params = useParams();
  const cemeteryId = String(params.id ?? "");
  const plotId = String(params.plotId ?? "");

  const {
    cemeteries,
    fetchCemeteries,
    blocks,
    fetchBlocks,
    sections,
    fetchSections,
  } = useCemetery();
  const { selectPlot, selectedPlot, updatePlot, isLoading } = usePlot();
  const { igrpToast } = useIGRPToast();

  const [selectedCemeteryId, setSelectedCemeteryId] =
    useState<string>(cemeteryId);
  const [selectedBlockId, setSelectedBlockId] = useState<string>("");
  const [_selectedSectionId, setSelectedSectionId] = useState<string>("");
  const [formKey, setFormKey] = useState<number>(0);

  // Images state for upload and preview
  const [existingPhotos, setExistingPhotos] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    void fetchCemeteries();
  }, [fetchCemeteries]);

  useEffect(() => {
    if (cemeteryId) {
      setSelectedCemeteryId(cemeteryId);
      void fetchBlocks(cemeteryId);
    }
  }, [cemeteryId, fetchBlocks]);

  useEffect(() => {
    if (selectedCemeteryId && selectedBlockId) {
      void fetchSections(selectedCemeteryId, selectedBlockId);
    }
  }, [selectedCemeteryId, selectedBlockId, fetchSections]);

  useEffect(() => {
    if (plotId) {
      void selectPlot(plotId);
    }
  }, [plotId, selectPlot]);

  useEffect(() => {
    if (selectedPlot) {
      setSelectedBlockId(selectedPlot.blockId ?? "");
      setSelectedSectionId(selectedPlot.sectionId ?? "");
      const photos = selectedPlot.metadata?.photos ?? [];
      setExistingPhotos(photos);
    }
  }, [selectedPlot]);

  const activeCemeteryName = useMemo(() => {
    const c = cemeteries.find((x: Cemetery) => x.id === selectedCemeteryId);
    return c?.name ?? "";
  }, [cemeteries, selectedCemeteryId]);

  /**
   * onSubmitEdit
   *
   * Handles validated form submission to update the plot. Merges image metadata when present.
   */
  const onSubmitEdit = async (data: PlotFormData) => {
    const payload: PlotFormData = {
      ...data,
      metadata: {
        ...(selectedPlot?.metadata ?? {}),
        photos: existingPhotos,
      },
    };
    const res = await updatePlot(plotId, payload);
    if (res?.success) {
      igrpToast({
        title: "Sucesso",
        description: "Sepultura atualizada com sucesso",
        type: "success",
      });
      router.push(`/plots?cemeteryId=${payload.cemeteryId}`);
    } else if (res?.errors?.[0]) {
      igrpToast({
        title: "Erro",
        description: String(res.errors[0]),
        type: "error",
      });
    }
  };

  /**
   * handleCancel
   *
   * Confirms discard action and navigates back to plots listing.
   */
  const handleCancel = () => {
    const confirmDiscard = window.confirm(
      "Deseja descartar alterações não salvas?",
    );
    if (confirmDiscard) {
      router.push(`/plots?cemeteryId=${selectedCemeteryId}`);
    }
  };

  /**
   * handleClear
   *
   * Resets form by remounting PlotForm with initial values.
   */
  const handleClear = () => {
    setFormKey((prev) => prev + 1);
  };

  /**
   * handleFileSelect
   *
   * Handles local image file selection and builds preview URLs.
   */
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;
    setSelectedFiles(files);
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviewUrls(urls);
  };

  /**
   * handleUploadPhotos
   *
   * Uploads selected image files to backend and updates plot metadata photos.
   */
  const handleUploadPhotos = async () => {
    if (!selectedFiles.length || !plotId) return;
    const service = new PlotService();
    try {
      const uploaded: string[] = [];
      for (const file of selectedFiles) {
        const url = await service.uploadPlotPhoto(plotId, file);
        uploaded.push(url);
      }
      const updatedPhotos = [...existingPhotos, ...uploaded];
      setExistingPhotos(updatedPhotos);
      if (selectedPlot) {
        const payload: PlotFormData = {
          cemeteryId: selectedPlot.cemeteryId,
          blockId: selectedPlot.blockId,
          sectionId: selectedPlot.sectionId,
          plotNumber: selectedPlot.plotNumber,
          plotType: selectedPlot.plotType,
          dimensions: selectedPlot.dimensions,
          notes: selectedPlot.notes,
          metadata: {
            ...(selectedPlot.metadata ?? {}),
            photos: updatedPhotos,
          },
        };
        const res = await updatePlot(plotId, payload);
        if (res?.success) {
          igrpToast({
            title: "Sucesso",
            description: "Imagens enviadas e associadas com sucesso",
            type: "success",
          });
        } else {
          const err =
            res?.errors?.[0] ?? "Falha ao atualizar imagens da sepultura";
          igrpToast({ title: "Erro", description: err, type: "error" });
        }
      }
    } catch (error) {
      const errMsg =
        error instanceof Error
          ? error.message
          : "Serviço indisponível - Tente novamente mais tarde";
      igrpToast({ title: "Erro", description: errMsg, type: "error" });
    }
  };

  const defaultValues: PlotFormData | undefined = selectedPlot
    ? {
        cemeteryId: selectedPlot.cemeteryId,
        blockId: selectedPlot.blockId,
        sectionId: selectedPlot.sectionId,
        plotNumber: selectedPlot.plotNumber,
        plotType: selectedPlot.plotType,
        geoPoint: selectedPlot.geoPoint,
        dimensions: selectedPlot.dimensions,
        notes: selectedPlot.notes,
      }
    : undefined;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <IGRPPageHeader
        name={`pageHeaderPlotEdit`}
        iconBackButton={`ArrowLeft`}
        showBackButton={true}
        urlBackButton={`/plots?cemeteryId=${selectedCemeteryId}`}
        variant={`h3`}
        title={"Editar Sepultura"}
        description={"Atualize os dados da sepultura"}
      ></IGRPPageHeader>

      <div className="flex items-center gap-2">
        {selectedCemeteryId && activeCemeteryName && (
          <IGRPBadge color="info" variant="soft" size="sm">
            {activeCemeteryName}
          </IGRPBadge>
        )}
      </div>

      {defaultValues && (
        <PlotForm
          key={formKey}
          defaultValues={defaultValues}
          cemeteryOptions={cemeteries.map((c: Cemetery) => ({
            value: c.id,
            label: c.name,
          }))}
          blockOptions={blocks.map((b: CemeteryBlock) => ({
            value: b.id,
            label: b.name,
          }))}
          sectionOptions={sections.map((s: CemeterySection) => ({
            value: s.id,
            label: s.name,
          }))}
          onCemeteryChange={(id) => {
            setSelectedCemeteryId(id);
            setSelectedBlockId("");
            setSelectedSectionId("");
            if (id) void fetchBlocks(id);
          }}
          onBlockChange={(id) => {
            setSelectedBlockId(id);
            setSelectedSectionId("");
            if (selectedCemeteryId && id)
              void fetchSections(selectedCemeteryId, id);
          }}
          onSectionChange={(id) => setSelectedSectionId(id)}
          onSubmit={onSubmitEdit}
          onCancel={handleCancel}
          onClear={handleClear}
          loading={isLoading}
          title={"Dados da Sepultura"}
        />
      )}

      {/* Imagens da sepultura */}
      <IGRPCard>
        <IGRPCardHeader>
          <IGRPCardTitle className="flex items-center gap-2">
            <IGRPIcon iconName="Image" className="h-5 w-5" />
            Imagens da Sepultura
          </IGRPCardTitle>
        </IGRPCardHeader>
        <IGRPCardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <IGRPLabel className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <IGRPButton showIcon iconName="Upload" variant="outline">
                  Selecionar Imagens
                </IGRPButton>
              </IGRPLabel>
              <IGRPButton
                onClick={handleUploadPhotos}
                disabled={!selectedFiles.length}
              >
                Enviar Imagens
              </IGRPButton>
            </div>

            {/* Pré-visualização das novas imagens */}
            {previewUrls.length > 0 && selectedFiles.length > 0 && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Pré-visualização</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {selectedFiles.map((file, idx) => (
                    <div
                      key={`preview-${file.name}`}
                      className="border rounded-md overflow-hidden relative h-32"
                    >
                      <Image
                        src={previewUrls[idx]}
                        alt={`Pré-visualização ${file.name}`}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Imagens existentes */}
            {existingPhotos.length > 0 && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Imagens associadas</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {existingPhotos.map((src) => (
                    <div
                      key={`photo-${src}`}
                      className="border rounded-md overflow-hidden relative h-32"
                    >
                      <Image
                        src={src}
                        alt={`Imagem associada`}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </IGRPCardContent>
      </IGRPCard>

      {/* Ações auxiliares */}
      <div className="flex gap-2">
        <Link href={`/plots?cemeteryId=${selectedCemeteryId}`}>
          <IGRPButton variant="outline" showIcon iconName="ArrowLeft">
            Voltar para Lista
          </IGRPButton>
        </Link>
      </div>
    </div>
  );
}

import Image from "next/image";
