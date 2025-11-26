"use client";
import type { IGRPDataTableActionDropdown } from "@igrp/igrp-framework-react-design-system";
import {
  IGRPBadge,
  IGRPButton,
  IGRPCard,
  IGRPCardContent,
  IGRPDataTable,
  IGRPDataTableButtonLink,
  IGRPDataTableDropdownMenu,
  IGRPDataTableDropdownMenuLink,
  IGRPDataTableHeaderSortToggle,
  IGRPDataTableRowAction,
  IGRPIcon,
  IGRPInputText,
  IGRPPageHeader,
  IGRPSelect,
  useIGRPToast,
} from "@igrp/igrp-framework-react-design-system";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useCemetery } from "@/app/(myapp)/hooks/useCemetery";
import type {
  Cemetery,
  CemeteryBlock,
  CemeterySection,
} from "@/app/(myapp)/types/cemetery";

export default function SectionsPage() {
  /**
   * SectionsPage renders CRUD UI for cemetery sections (sectores):
   * - Select cemetery and block → list sections with search/filter
   * - Create and edit sections with required validations
   */
  const {
    cemeteries,
    fetchCemeteries,
    blocks,
    fetchBlocks,
    sections,
    fetchSections,
    isLoading,
    error,
  } = useCemetery();
  const perms = String(process.env.NEXT_PUBLIC_PERMISSIONS || "")
    .split(",")
    .map((p) => p.trim().toUpperCase());
  const _canWriteStructure = perms.includes("CEMETERY_WRITE");

  const [selectedCemeteryId, setSelectedCemeteryId] = useState<string>("");
  const [selectedBlockId, setSelectedBlockId] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const { igrpToast } = useIGRPToast();

  /**
   * Navigates to section create form for the selected cemetery.
   */
  const goToCreateSection = () => {
    if (!selectedCemeteryId) {
      igrpToast({
        title: "Erro",
        description: "Selecione um cemitério primeiro",
        type: "error",
      });
      return;
    }
    router.push(`/cemeteries/${selectedCemeteryId}/sections/create`);
  };

  /**
   * Validates and applies cemetery selection for sections filters, clearing dependent block.
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
  }, [selectedCemeteryId]);

  useEffect(() => {
    if (selectedCemeteryId) void fetchBlocks(selectedCemeteryId);
  }, [selectedCemeteryId, fetchBlocks]);

  useEffect(() => {
    if (selectedCemeteryId && selectedBlockId)
      void fetchSections(selectedCemeteryId, selectedBlockId);
  }, [selectedCemeteryId, selectedBlockId, fetchSections]);

  useEffect(() => {
    if (selectedCemeteryId) {
      try {
        localStorage.setItem("activeCemeteryId", selectedCemeteryId);
      } catch {}
    }
  }, [selectedCemeteryId]);

  useEffect(() => {
    if (error) {
      igrpToast({ title: "Erro", description: String(error), type: "error" });
    }
  }, [error, igrpToast]);

  const filteredSections = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return sections.filter((s) =>
      term
        ? String(s.name || "")
            .toLowerCase()
            .includes(term)
        : true,
    );
  }, [sections, searchTerm]);

  const _startEdit = (_s: CemeterySection) => {
    // Navegar para a página de edição dedicada
    // Mantemos apenas ações de listagem aqui
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <IGRPPageHeader
        name={`pageHeaderSections`}
        iconBackButton={`ArrowLeft`}
        showBackButton={true}
        urlBackButton={`/cemeteries/${selectedCemeteryId}`}
        variant={`h3`}
        title={"Sectores"}
        description={"Lista de sectores por bloco"}
      >
        <div className="flex items-center gap-2">
          {selectedCemeteryId &&
            cemeteries.find((x) => x.id === selectedCemeteryId)?.name && (
              <IGRPBadge color="info" variant="soft" size="sm">
                {cemeteries.find((x) => x.id === selectedCemeteryId)?.name}
              </IGRPBadge>
            )}
          <IGRPButton
            variant="default"
            size={`sm`}
            showIcon={true}
            iconName={"Plus"}
            onClick={goToCreateSection}
            disabled={!selectedCemeteryId}
          >
            Adicionar Seção
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
            iconName={"Crosshair"}
            onClick={() =>
              selectedCemeteryId &&
              router.push(`/plots?cemeteryId=${selectedCemeteryId}`)
            }
            disabled={!selectedCemeteryId}
          >
            Gerir Sepulturas
          </IGRPButton>
        </div>
      </IGRPPageHeader>

      <IGRPCard>
        <IGRPCardContent>
          <div className="flex space-x-4 mb-6">
            <div className="relative flex-1">
              <IGRPInputText
                placeholder="Buscar sector por nome..."
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
            <IGRPButton
              variant={"outline"}
              size={"sm"}
              showIcon={true}
              iconName={"Funnel"}
              onClick={() =>
                selectedCemeteryId &&
                selectedBlockId &&
                fetchSections(selectedCemeteryId, selectedBlockId)
              }
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
          <span className="ml-2 text-gray-500">Carregando sectores...</span>
        </div>
      )}

      {!isLoading && (
        <IGRPCard>
          <IGRPCardContent>
            <IGRPDataTable<CemeterySection, CemeterySection>
              className={"rounded-md border"}
              columns={[
                {
                  header: ({ column }) => (
                    <IGRPDataTableHeaderSortToggle
                      column={column}
                      title={`Nome`}
                    />
                  ),
                  accessorKey: "name",
                  cell: ({ row }) => row.getValue("name") as string,
                },
                {
                  header: ({ column }) => (
                    <IGRPDataTableHeaderSortToggle
                      column={column}
                      title={`Capacidade`}
                    />
                  ),
                  accessorKey: "maxCapacity",
                  cell: ({ row }) =>
                    new Intl.NumberFormat("pt-CV").format(
                      Number(row.getValue("maxCapacity") ?? 0),
                    ),
                },
                {
                  id: "actions",
                  enableHiding: false,
                  cell: ({ row }) => {
                    const s = row.original as CemeterySection;
                    const items: IGRPDataTableActionDropdown[] = [
                      {
                        component: IGRPDataTableDropdownMenuLink,
                        props: {
                          labelTrigger: `Editar`,
                          icon: `SquarePen`,
                          href: `/cemeteries/${String(s.cemeteryId)}/sections/${String(s.id)}/edit`,
                          showIcon: true,
                        },
                      },
                    ];
                    return (
                      <IGRPDataTableRowAction>
                        <IGRPDataTableButtonLink
                          labelTrigger={`Detalhes`}
                          href={`/cemeteries/${String(s.cemeteryId)}`}
                          variant={`ghost`}
                          icon={`Eye`}
                        ></IGRPDataTableButtonLink>
                        <IGRPDataTableDropdownMenu items={items} />
                      </IGRPDataTableRowAction>
                    );
                  },
                },
              ]}
              clientFilters={[]}
              data={filteredSections}
            />
          </IGRPCardContent>
        </IGRPCard>
      )}
    </div>
  );
}
