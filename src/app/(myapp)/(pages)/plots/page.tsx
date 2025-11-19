"use client";
import {
  cn,
  IGRPBadge,
  IGRPButton,
  IGRPCard,
  IGRPCardContent,
  IGRPCardHeader,
  IGRPCardTitle,
  IGRPDataTable,
  IGRPDataTableButtonLink,
  IGRPDataTableDropdownMenu,
  IGRPDataTableDropdownMenuAlert,
  IGRPDataTableHeaderSortToggle,
  IGRPDataTableRowAction,
  IGRPIcon,
  IGRPInputText,
  IGRPLabel,
  IGRPPageHeader,
  IGRPSelect,
  useIGRPToast,
} from "@igrp/igrp-framework-react-design-system";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useCemetery } from "@/hooks/useCemetery";
import { usePlot } from "@/hooks/usePlot";
import type {
  Cemetery,
  CemeteryBlock,
  CemeterySection,
} from "@/types/cemetery";
import type { Plot, PlotFormData } from "@/types/Plot";

export default function PlotsPage() {
  /**
   * Renders plot listing with basic filters and actions.
   * Advanced search has been removed entirely from this page.
   */
  const {
    cemeteries,
    fetchCemeteries,
    blocks,
    fetchBlocks,
    sections,
    fetchSections,
  } = useCemetery();

  const {
    plots,
    fetchPlots,
    createPlot,
    updatePlot,
    reservePlot,
    cancelPlotReservation,
    markPlotAsOccupied,
    markPlotAsAvailable,
    isLoading,
  } = usePlot();
  const perms = String(process.env.NEXT_PUBLIC_PERMISSIONS || "")
    .split(",")
    .map((p) => p.trim().toUpperCase());
  const canWritePlots = perms.includes("PLOTS_WRITE");

  const [selectedCemeteryId, setSelectedCemeteryId] = useState<string>("");
  const [selectedBlockId, setSelectedBlockId] = useState<string>("");
  const [selectedSectionId, setSelectedSectionId] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const [editing, setEditing] = useState<Plot | null>(null);
  const [form, setForm] = useState<PlotFormData>({
    cemeteryId: "",
    blockId: "",
    sectionId: "",
    plotNumber: "",
    plotType: "GROUND",
    geoPoint: undefined,
    dimensions: { width: 0, length: 0, unit: "meters" },
    notes: "",
  });
  const { igrpToast } = useIGRPToast();
  const activeCemeteryName = useMemo(() => {
    const c = cemeteries.find((x) => x.id === selectedCemeteryId);
    return c?.name ?? "";
  }, [cemeteries, selectedCemeteryId]);

  /**
   * Validates and applies cemetery selection for plots filters, clearing dependent block/section.
   */
  const handleCemeteryChange = (id: string) => {
    const exists = cemeteries.some((c) => String(c.id) === String(id));
    if (!exists) {
      igrpToast({
        title: "Erro",
        description: "Cemitério inválido",
        type: "error",
      });
      return;
    }
    setSelectedCemeteryId(id);
    setSelectedBlockId("");
    setSelectedSectionId("");
  };

  /**
   * Validates and applies block selection ensuring it belongs to selected cemetery.
   */
  const handleBlockChange = (id: string) => {
    const b = blocks.find((x) => String(x.id) === String(id));
    if (!b) {
      igrpToast({
        title: "Erro",
        description: "Bloco inválido",
        type: "error",
      });
      return;
    }
    if (
      selectedCemeteryId &&
      String(b.cemeteryId) !== String(selectedCemeteryId)
    ) {
      igrpToast({
        title: "Erro",
        description: "O bloco selecionado não pertence ao cemitério",
        type: "error",
      });
      return;
    }
    setSelectedBlockId(id);
    setSelectedSectionId("");
  };

  /**
   * Validates and applies section selection ensuring it belongs to selected block.
   */
  const handleSectionChange = (id: string) => {
    const s = sections.find((x) => String(x.id) === String(id));
    if (!s) {
      igrpToast({
        title: "Erro",
        description: "Seção inválida",
        type: "error",
      });
      return;
    }
    if (selectedBlockId && String(s.blockId) !== String(selectedBlockId)) {
      igrpToast({
        title: "Erro",
        description: "A seção selecionada não pertence ao bloco",
        type: "error",
      });
      return;
    }
    setSelectedSectionId(id);
  };

  useEffect(() => {
    void fetchCemeteries();
  }, [fetchCemeteries]);
  useEffect(() => {
    const cid = String(searchParams.get("cemeteryId") ?? "");
    if (cid) setSelectedCemeteryId(cid);
  }, [searchParams]);
  useEffect(() => {
    if (!selectedCemeteryId) {
      try {
        const stored = localStorage.getItem("activeCemeteryId") ?? "";
        if (stored) setSelectedCemeteryId(stored);
      } catch {}
    }
  }, []);
  useEffect(() => {
    if (selectedCemeteryId) {
      void fetchBlocks(selectedCemeteryId);
      void fetchPlots({ cemeteryId: selectedCemeteryId });
    }
  }, [selectedCemeteryId, fetchBlocks, fetchPlots]);
  useEffect(() => {
    if (selectedCemeteryId) {
      try {
        localStorage.setItem("activeCemeteryId", selectedCemeteryId);
      } catch {}
    }
  }, [selectedCemeteryId]);
  useEffect(() => {
    if (selectedCemeteryId && selectedBlockId) {
      void fetchSections(selectedCemeteryId, selectedBlockId);
    }
  }, [selectedCemeteryId, selectedBlockId, fetchSections]);

  const filteredPlots = useMemo(() => {
    return plots.filter((p: Plot) => {
      const term = searchTerm.toLowerCase();
      const matchesSearch = term
        ? (p.plotNumber ?? "").toLowerCase().includes(term)
        : true;
      const matchesCemetery = selectedCemeteryId
        ? p.cemeteryId === selectedCemeteryId
        : true;
      const matchesBlock = selectedBlockId
        ? p.blockId === selectedBlockId
        : true;
      const matchesSection = selectedSectionId
        ? p.sectionId === selectedSectionId
        : true;
      return matchesSearch && matchesCemetery && matchesBlock && matchesSection;
    });
  }, [
    plots,
    searchTerm,
    selectedCemeteryId,
    selectedBlockId,
    selectedSectionId,
  ]);

  /**
   * Maps occupation status to badge props and tooltip text.
   */
  const getOccupationBadgeProps = (status: string) => {
    const s = String(status).toUpperCase();
    switch (s) {
      case "AVAILABLE":
        return {
          label: "Disponível",
          color: "success" as const,
          tooltip: "Sepultura disponível para reserva/ocupação",
        };
      case "RESERVED":
        return {
          label: "Reservada",
          color: "warning" as const,
          tooltip: "Sepultura reservada aguardando ocupação ou cancelamento",
        };
      case "OCCUPIED":
        return {
          label: "Ocupada",
          color: "secondary" as const,
          tooltip: "Sepultura ocupada sem disponibilidade",
        };
      default:
        return {
          label: s || "—",
          color: "info" as const,
          tooltip: "Status desconhecido",
        };
    }
  };
  // transformar em uma função que redireciona para a página de criação de sepultura
  const goToCreatePlot = () => {
    if (!selectedCemeteryId) return;
    router.push(`/cemeteries/${selectedCemeteryId}/plots/create`);
  };

  /**
   * Validates form and returns error message or null.
   */
  const validateForm = (): string | null => {
    if (!selectedCemeteryId) return "Cemetery is required";
    if (!selectedBlockId) return "Block is required";
    if (!selectedSectionId) return "Section is required";
    if (!form.plotNumber || form.plotNumber.trim().length < 1)
      return "Plot number is required";
    if (
      !form.dimensions ||
      form.dimensions.length <= 0 ||
      form.dimensions.width <= 0
    )
      return "Dimensions must be greater than 0";
    return null;
  };

  /**
   * Handles plot creation with toast notifications.
   */
  const handleCreate = async () => {
    const validation = validateForm();
    if (validation) {
      igrpToast({ title: "Erro", description: validation, type: "error" });
      return;
    }
    const payload: PlotFormData = {
      ...form,
      cemeteryId: selectedCemeteryId,
      blockId: selectedBlockId,
      sectionId: selectedSectionId,
    };
    const res = await createPlot(payload);
    if (res) {
      setForm({
        cemeteryId: "",
        blockId: "",
        sectionId: "",
        plotNumber: "",
        plotType: "GROUND",
        dimensions: { width: 0, length: 0, unit: "meters" },
        notes: "",
      });
      igrpToast({
        title: "Sucesso",
        description: "Sepultura criada com sucesso",
        type: "success",
      });
    }
  };

  /**
   * Handles plot update with toast notifications.
   */
  const handleUpdate = async () => {
    if (!editing) return;
    const validation = validateForm();
    if (validation) {
      igrpToast({ title: "Erro", description: validation, type: "error" });
      return;
    }
    const payload: PlotFormData = { ...form } as PlotFormData;
    const res = await updatePlot(editing.id, payload);
    if (res?.success) {
      setEditing(null);
      igrpToast({
        title: "Sucesso",
        description: "Sepultura atualizada com sucesso",
        type: "success",
      });
    }
  };

  const startEdit = (p: Plot) => {
    setEditing(p);
    setSelectedCemeteryId(p.cemeteryId);
    setSelectedBlockId(p.blockId ?? "");
    setSelectedSectionId(p.sectionId ?? "");
    setForm({
      cemeteryId: p.cemeteryId,
      blockId: p.blockId,
      sectionId: p.sectionId,
      plotNumber: p.plotNumber,
      plotType: p.plotType,
      dimensions: p.dimensions,
      notes: p.notes,
    } as PlotFormData);
  };

  /**
   * Handles plot reservation action with toast error placeholder.
   */
  const doReserve = async (p: Plot) => {
    igrpToast({
      title: "Erro",
      description: "Missing required reservation data",
      type: "error",
    });
  };
  /**
   * Handles reservation cancel action with toast error placeholder.
   */
  const doCancelReservation = async (p: Plot) => {
    igrpToast({
      title: "Erro",
      description: "Missing cancellation reason",
      type: "error",
    });
  };
  /**
   * Handles mark occupied action with toast error placeholder.
   */
  const doOccupy = async (p: Plot) => {
    igrpToast({
      title: "Erro",
      description: "Missing occupant information",
      type: "error",
    });
  };
  /**
   * Handles mark available action with toast error placeholder.
   */
  const doAvailable = async (p: Plot) => {
    igrpToast({
      title: "Erro",
      description: "Missing availability reason",
      type: "error",
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <IGRPPageHeader
        name={`pageHeader1`}
        iconBackButton={`ArrowLeft`}
        showBackButton={true}
        urlBackButton={`/cemeteries`}
        variant={`h3`}
        className={cn()}
        title={"Sepulturas"}
        description={"Gerencie as sepulturas do sistema"}
      >
        <div className="flex items-center gap-2">
          {selectedCemeteryId && activeCemeteryName && (
            <IGRPBadge color="info" variant="soft" size="sm">
              {activeCemeteryName}
            </IGRPBadge>
          )}
          <IGRPButton
            variant="default"
            size={`sm`}
            showIcon={true}
            iconName={"Plus"}
            onClick={() => {
              if (!selectedCemeteryId) {
                igrpToast({
                  title: "Erro",
                  description: "Selecione um cemitério primeiro",
                  type: "error",
                });
                return;
              }
              goToCreatePlot();
            }}
            disabled={!selectedCemeteryId}
          >
            Adicionar Sepultura
          </IGRPButton>

          <IGRPButton
            variant="outline"
            size={`sm`}
            showIcon={true}
            iconName={"Blocks"}
            onClick={() =>
              selectedCemeteryId &&
              router.push(`/blocks?cemeteryId=${selectedCemeteryId}`)
            }
            disabled={!selectedCemeteryId}
          >
            Gerir Blocos
          </IGRPButton>
          <IGRPButton
            variant="outline"
            size={`sm`}
            showIcon={true}
            iconName={"ListTree"}
            onClick={() =>
              selectedCemeteryId &&
              router.push(`/sections?cemeteryId=${selectedCemeteryId}`)
            }
            disabled={!selectedCemeteryId}
          >
            Gerir Seções
          </IGRPButton>
        </div>
      </IGRPPageHeader>

      <IGRPCard>
        <IGRPCardContent>
          <IGRPCard>
            <IGRPCardContent>
              <div className="flex space-x-4 mb-6">
                <div className="relative flex-1">
                  <IGRPInputText
                    placeholder="Buscar por número da sepultura..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                    iconName={"Search"}
                    showIcon={true}
                  />
                </div>
                <div>
                  <IGRPSelect
                    label=""
                    options={cemeteries.map((c: Cemetery) => ({
                      value: c.id,
                      label: c.name,
                    }))}
                    placeholder="Selecione o Cemitério"
                    value={selectedCemeteryId}
                    onValueChange={(v) => handleCemeteryChange(String(v))}
                  />
                </div>
                <div>
                  <IGRPSelect
                    label=""
                    options={blocks.map((b: CemeteryBlock) => ({
                      value: b.id,
                      label: b.name,
                    }))}
                    placeholder="Selecione o Bloco"
                    value={selectedBlockId}
                    onValueChange={(v) => handleBlockChange(String(v))}
                    disabled={!selectedCemeteryId}
                  />
                </div>
                <div>
                  <IGRPSelect
                    label=""
                    options={sections.map((s: CemeterySection) => ({
                      value: s.id,
                      label: s.name,
                    }))}
                    placeholder="Selecione a Seção"
                    value={selectedSectionId}
                    onValueChange={(v) => handleSectionChange(String(v))}
                    disabled={!selectedBlockId}
                  />
                </div>
                <IGRPButton
                  variant={"outline"}
                  size={"sm"}
                  showIcon={true}
                  iconName={"Funnel"}
                  className={cn()}
                />
              </div>
            </IGRPCardContent>
          </IGRPCard>

          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <IGRPIcon
                iconName="RefreshCw"
                className="h-6 w-6 animate-spin text-gray-400"
              />
              <span className="ml-2 text-gray-500">
                Carregando sepulturas...
              </span>
            </div>
          )}

          {!isLoading && (
            <IGRPDataTable<Plot, Plot>
              className={"rounded-md border"}
              columns={[
                {
                  header: ({ column }) => (
                    <IGRPDataTableHeaderSortToggle
                      column={column}
                      title={`Número`}
                    />
                  ),
                  accessorKey: "plotNumber",
                  cell: ({ row }) => row.getValue("plotNumber") as string,
                },
                {
                  header: ({ column }) => (
                    <IGRPDataTableHeaderSortToggle
                      column={column}
                      title={`Tipo`}
                    />
                  ),
                  accessorKey: "plotType",
                  cell: ({ row }) => String(row.getValue("plotType") ?? ""),
                },
                {
                  header: ({ column }) => (
                    <IGRPDataTableHeaderSortToggle
                      column={column}
                      title={`Ocupação`}
                    />
                  ),
                  accessorKey: "occupationStatus",
                  cell: ({ row }) => {
                    const status = String(
                      row.getValue("occupationStatus") ?? "",
                    );
                    const { label, color, tooltip } =
                      getOccupationBadgeProps(status);
                    return (
                      <IGRPBadge
                        color={color}
                        variant="soft"
                        size="sm"
                        title={tooltip}
                      >
                        {label}
                      </IGRPBadge>
                    );
                  },
                },
                {
                  id: "actions",
                  enableHiding: false,
                  cell: ({ row }) => {
                    const p = row.original as Plot;
                    const items: any[] = [
                      {
                        component: IGRPDataTableButtonLink,
                        props: {
                          labelTrigger: `Detalhes`,
                          href: `/plots/${p.id}`,
                          variant: `ghost`,
                          icon: `Eye`,
                        },
                      },
                    ];
                    const dropdownItems: any[] = [
                      {
                        component: IGRPDataTableDropdownMenuAlert,
                        props: {
                          modalTitle: `Reservar`,
                          labelTrigger: `Reservar`,
                          icon: `CalendarPlus`,
                          showIcon: true,
                          showCancel: true,
                          labelCancel: `Cancelar`,
                          variantCancel: `default` as const,
                          showConfirm: true,
                          labelConfirm: `Confirmar`,
                          variantConfirm: `secondary` as const,
                          onClickConfirm: () => {
                            void doReserve(p);
                          },
                          children: <>Confirmar reserva da sepultura?</>,
                        },
                      },
                      {
                        component: IGRPDataTableDropdownMenuAlert,
                        props: {
                          modalTitle: `Cancelar Reserva`,
                          labelTrigger: `Cancelar Reserva`,
                          icon: `Ban`,
                          showIcon: true,
                          showCancel: true,
                          labelCancel: `Cancelar`,
                          variantCancel: `default` as const,
                          showConfirm: true,
                          labelConfirm: `Confirmar`,
                          variantConfirm: `secondary` as const,
                          onClickConfirm: () => {
                            void doCancelReservation(p);
                          },
                          children: <>Deseja cancelar a reserva?</>,
                        },
                      },
                      {
                        component: IGRPDataTableDropdownMenuAlert,
                        props: {
                          modalTitle: `Ocupar`,
                          labelTrigger: `Ocupar`,
                          icon: `UserPlus`,
                          showIcon: true,
                          showCancel: true,
                          labelCancel: `Cancelar`,
                          variantCancel: `default` as const,
                          showConfirm: true,
                          labelConfirm: `Confirmar`,
                          variantConfirm: `secondary` as const,
                          onClickConfirm: () => {
                            void doOccupy(p);
                          },
                          children: <>Confirmar ocupação da sepultura?</>,
                        },
                      },
                      {
                        component: IGRPDataTableDropdownMenuAlert,
                        props: {
                          modalTitle: `Disponibilizar`,
                          labelTrigger: `Disponibilizar`,
                          icon: `Undo2`,
                          showIcon: true,
                          showCancel: true,
                          labelCancel: `Cancelar`,
                          variantCancel: `default` as const,
                          showConfirm: true,
                          labelConfirm: `Confirmar`,
                          variantConfirm: `secondary` as const,
                          onClickConfirm: () => {
                            void doAvailable(p);
                          },
                          children: (
                            <>Confirmar disponibilização da sepultura?</>
                          ),
                        },
                      },
                    ];

                    const filteredDropdownItems = dropdownItems.filter(
                      (item) => {
                        const status = String(
                          p.occupationStatus || "",
                        ).toUpperCase();
                        const label = item.props.labelTrigger;
                        if (label === "Reservar")
                          return status === "AVAILABLE" && canWritePlots;
                        if (label === "Cancelar Reserva")
                          return status === "RESERVED" && canWritePlots;
                        if (label === "Ocupar")
                          return status !== "OCCUPIED" && canWritePlots;
                        if (label === "Disponibilizar")
                          return status !== "AVAILABLE" && canWritePlots;
                        return true;
                      },
                    );

                    return (
                      <IGRPDataTableRowAction>
                        <IGRPDataTableButtonLink
                          labelTrigger={`Detalhes`}
                          href={`/plots/${p.id}`}
                          variant={`ghost`}
                          icon={`Eye`}
                        ></IGRPDataTableButtonLink>
                        <IGRPDataTableDropdownMenu
                          items={filteredDropdownItems}
                        />
                      </IGRPDataTableRowAction>
                    );
                  },
                },
              ]}
              clientFilters={[]}
              data={filteredPlots}
            />
          )}
        </IGRPCardContent>
      </IGRPCard>
    </div>
  );
}
