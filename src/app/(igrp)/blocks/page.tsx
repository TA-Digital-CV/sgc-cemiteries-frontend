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
  useIGRPToast,
} from "@igrp/igrp-framework-react-design-system";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useCemetery } from "@/app/(myapp)/hooks/useCemetery";
import type { Cemetery, CemeteryBlock } from "@/app/(myapp)/types/cemetery";

export function selectBlocksForCemetery(
  list: CemeteryBlock[],
  cemeteryId: string,
): CemeteryBlock[] {
  if (!cemeteryId) return [];
  return list.filter((b) => String(b.cemeteryId) === String(cemeteryId));
}

export default function BlocksPage() {
  /**
   * BlocksPage renders CRUD UI for cemetery blocks:
   * - Select cemetery → list blocks with search/filter
   * - Create and edit blocks with required validations
   */
  const { cemeteries, fetchCemeteries, blocks, fetchBlocks, isLoading, error } =
    useCemetery();
  const [selectedCemeteryId, setSelectedCemeteryId] = useState<string>("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { igrpToast } = useIGRPToast();

  /**
   * Navigates to block create form for the selected cemetery.
   */
  const goToCreateBlock = () => {
    if (!selectedCemeteryId) {
      igrpToast({
        title: "Erro",
        description: "Selecione um cemitério primeiro",
        type: "error",
      });
      return;
    }
    router.push(`/cemeteries/${selectedCemeteryId}/blocks/create`);
  };

  /**
   * applyActiveCemeteryContext
   * Uses activeCemeteryId context from localStorage; no manual selector UI.
   */

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
    if (selectedCemeteryId) {
      void fetchBlocks(selectedCemeteryId);
    }
  }, [selectedCemeteryId, fetchBlocks]);
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

  const filteredBlocks = useMemo(() => {
    const base = selectBlocksForCemetery(blocks, selectedCemeteryId);
    const term = searchTerm.toLowerCase();
    return base.filter((b) =>
      term
        ? String(b.name || "")
            .toLowerCase()
            .includes(term)
        : true,
    );
  }, [blocks, selectedCemeteryId, searchTerm]);

  const visibleBlocks = filteredBlocks;

  // Removed non-related create/edit logic to keep page focused on listing

  return (
    <div className="container mx-auto p-6 space-y-6">
      <IGRPPageHeader
        name={`pageHeaderBlocks`}
        iconBackButton={`ArrowLeft`}
        showBackButton={true}
        urlBackButton={`/cemeteries`}
        variant={`h3`}
        title={"Blocos"}
        description={"Lista de blocos por cemitério"}
      >
        <div className="flex items-center gap-2">
          {selectedCemeteryId &&
            cemeteries.find((x) => x.id === selectedCemeteryId)?.name && (
              <IGRPBadge color="primary" variant="soft" size="sm">
                {cemeteries.find((x) => x.id === selectedCemeteryId)?.name}
              </IGRPBadge>
            )}
          <IGRPButton
            variant="default"
            size={`sm`}
            showIcon={true}
            iconName={"Plus"}
            onClick={goToCreateBlock}
            disabled={!selectedCemeteryId}
          >
            Adicionar Bloco
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
                placeholder="Buscar bloco por nome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                iconName={"Search"}
                showIcon={true}
              />
            </div>
            {/* Cemetery selection UI removed: relies on activeCemeteryId context */}
            <IGRPButton
              variant={"outline"}
              size={"sm"}
              showIcon={true}
              iconName={"Funnel"}
              onClick={() =>
                selectedCemeteryId && fetchBlocks(selectedCemeteryId)
              }
              disabled={!selectedCemeteryId || isLoading}
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
          <span className="ml-2 text-gray-500">Carregando blocos...</span>
        </div>
      )}

      {!isLoading && (
        <IGRPCard>
          <IGRPCardContent>
            <IGRPDataTable<CemeteryBlock, CemeteryBlock>
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
                  header: ({ column }) => (
                    <IGRPDataTableHeaderSortToggle
                      column={column}
                      title={`Ocupação`}
                    />
                  ),
                  accessorKey: "occupancyRate",
                  cell: ({ row }) => {
                    const rate = Number(row.getValue("occupancyRate") ?? 0);
                    return `${rate.toFixed(1)}%`;
                  },
                },
                {
                  id: "actions",
                  enableHiding: false,
                  cell: ({ row }) => {
                    const b = row.original as CemeteryBlock;
                    const items: IGRPDataTableActionDropdown[] = [
                      {
                        component: IGRPDataTableDropdownMenuLink,
                        props: {
                          labelTrigger: `Editar`,
                          icon: `SquarePen`,
                          href: `/cemeteries/${String(b.cemeteryId)}/blocks/${String(b.id)}/edit`,
                          showIcon: true,
                        },
                      },
                      {
                        component: IGRPDataTableDropdownMenuLink,
                        props: {
                          labelTrigger: `Adicionar Seção`,
                          icon: `ListTree`,
                          href: `/cemeteries/${String(b.cemeteryId)}/sections/create`,
                          showIcon: true,
                        },
                      },
                    ];
                    return (
                      <IGRPDataTableRowAction>
                        <IGRPDataTableButtonLink
                          labelTrigger={`Detalhes`}
                          href={`/cemeteries/${String(b.cemeteryId)}`}
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
              data={visibleBlocks}
            />
          </IGRPCardContent>
        </IGRPCard>
      )}
    </div>
  );
}
