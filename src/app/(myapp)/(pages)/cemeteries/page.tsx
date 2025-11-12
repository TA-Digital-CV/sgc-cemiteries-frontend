import {
  IGRPButton,
  IGRPCard,
  IGRPCardContent,
  IGRPCardDescription,
  IGRPCardHeader,
  IGRPCardTitle,
  IGRPIcon,
} from "@igrp/igrp-framework-react-design-system";
import Link from "next/link";
import { CemeteryList } from "@/components/cemeteries/CemeteryList";
import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics";
/**
 * CemeteriesPage shows overview metrics and the cemetery list.
 * Uses IGRP components for layout and actions and removes lucide-react.
 */

export default function CemeteriesPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cemitérios</h1>
          <p className="text-muted-foreground">
            Gerencie todos os cemitérios do sistema
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/cemeteries/new">
            <IGRPButton>
              <IGRPIcon iconName="Plus" className="h-4 w-4 mr-2" />
              Novo Cemitério
            </IGRPButton>
          </Link>
          <Link href="/analytics">
            <IGRPButton variant="outline">
              <IGRPIcon iconName="BarChart3" className="h-4 w-4 mr-2" />
              Analytics
            </IGRPButton>
          </Link>
          <Link href="/maps">
            <IGRPButton variant="outline">
              <IGRPIcon iconName="Map" className="h-4 w-4 mr-2" />
              Mapas
            </IGRPButton>
          </Link>
        </div>
      </div>

      {/* Dashboard Overview */}
      <DashboardMetrics />

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <IGRPCard>
          <IGRPCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <IGRPCardTitle className="text-sm font-medium">
              Total de Cemitérios
            </IGRPCardTitle>
            <div className="h-4 w-4 text-muted-foreground">
              <IGRPIcon iconName="Map" className="h-4 w-4" />
            </div>
          </IGRPCardHeader>
          <IGRPCardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Ativos no sistema</p>
          </IGRPCardContent>
        </IGRPCard>

        <IGRPCard>
          <IGRPCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <IGRPCardTitle className="text-sm font-medium">
              Capacidade Total
            </IGRPCardTitle>
            <div className="h-4 w-4 text-muted-foreground">
              <IGRPIcon iconName="BarChart3" className="h-4 w-4" />
            </div>
          </IGRPCardHeader>
          <IGRPCardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Sepulturas disponíveis
            </p>
          </IGRPCardContent>
        </IGRPCard>

        <IGRPCard>
          <IGRPCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <IGRPCardTitle className="text-sm font-medium">
              Taxa de Ocupação
            </IGRPCardTitle>
            <div className="h-4 w-4 text-muted-foreground">
              <IGRPIcon iconName="Settings" className="h-4 w-4" />
            </div>
          </IGRPCardHeader>
          <IGRPCardContent>
            <div className="text-2xl font-bold">0%</div>
            <p className="text-xs text-muted-foreground">Média geral</p>
          </IGRPCardContent>
        </IGRPCard>
      </div>

      {/* Cemetery List */}
      <IGRPCard>
        <IGRPCardHeader>
          <IGRPCardTitle>Lista de Cemitérios</IGRPCardTitle>
          <IGRPCardDescription>
            Visualize e gerencie todos os cemitérios cadastrados
          </IGRPCardDescription>
        </IGRPCardHeader>
        <IGRPCardContent>
          <CemeteryList />
        </IGRPCardContent>
      </IGRPCard>
    </div>
  );
}
