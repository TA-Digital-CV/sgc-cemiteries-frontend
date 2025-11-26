"use client";

import { IGRPTemplateThemeSelector } from "@igrp/framework-next-ui";
import { useEffect, useState } from "react";
import {
  IGRPSelect,
  useIGRPToast,
} from "@igrp/igrp-framework-react-design-system";

export const dynamic = "force-dynamic";

export default function SettingsPage() {
  type Municipality = { id: string; name: string };
  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  const [selectedMunicipalityId, setSelectedMunicipalityId] =
    useState<string>("");
  const [loadingMunicipalities, setLoadingMunicipalities] = useState(false);
  const [municipalityError, setMunicipalityError] = useState<string | null>(
    null,
  );
  const { igrpToast } = useIGRPToast();

  /**
   * isLocalStorageAvailable
   * Checks whether localStorage is accessible and functional.
   */
  function isLocalStorageAvailable(): boolean {
    try {
      if (typeof window === "undefined") return false;
      const { localStorage } = window;
      const testKey = "__igrp_ls_test__";
      localStorage.setItem(testKey, "1");
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * fetchMunicipalities
   * Loads municipality list from API and restores stored context if present.
   */
  useEffect(() => {
    const load = async () => {
      console.log("[SystemSettings] load: start");
      setLoadingMunicipalities(true);
      setMunicipalityError(null);
      try {
        const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";
        const res = await fetch(`${API_BASE}/municipalities`, {
          headers: { Accept: "application/json" },
          cache: "no-store",
        });
        console.log("[SystemSettings] load: status", res.status);
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
        const json: unknown = await res.json();
        const obj = (json ?? {}) as Record<string, unknown>;
        const arr: unknown[] = Array.isArray(json)
          ? (json as unknown[])
          : Array.isArray(obj.content as unknown[])
            ? ((obj.content as unknown[]) ?? [])
            : Array.isArray(obj.data as unknown[])
              ? ((obj.data as unknown[]) ?? [])
              : [];
        const list: Municipality[] = arr
          .map((item: unknown) => {
            const o = (item ?? {}) as Record<string, unknown>;
            return {
              id: String(o.id ?? ""),
              name: String(
                (o.name as string) ??
                  (o.label as string) ??
                  (o.description as string) ??
                  "",
              ),
            } as Municipality;
          })
          .filter((m) => m.id);
        setMunicipalities(list.filter((m) => m.id));
        console.log("[SystemSettings] load: municipalities", list.length);
        try {
          if (isLocalStorageAvailable()) {
            console.log("[SystemSettings] localStorage available");
            const stored =
              window.localStorage.getItem("activeMunicipalityId") ?? "";
            console.log("[SystemSettings] stored activeMunicipalityId", stored);
            if (stored) {
              setSelectedMunicipalityId(stored);
              console.log(
                "[SystemSettings] selectedMunicipalityId set from storage",
                stored,
              );
            }
          }
        } catch {}
      } catch (err) {
        console.error("[SystemSettings] load: error", err);
        setMunicipalityError(
          err instanceof Error ? err.message : "Failed to load municipalities",
        );
      } finally {
        setLoadingMunicipalities(false);
        console.log("[SystemSettings] load: end");
      }
    };
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * validateSelectedMunicipality
   * Ensures selectedMunicipalityId matches a loaded municipality or clears it.
   */
  useEffect(() => {
    try {
      if (!municipalities.length) return;
      if (!selectedMunicipalityId) return;
      const exists = municipalities.some(
        (m) => String(m.id) === String(selectedMunicipalityId),
      );
      console.log(
        "[SystemSettings] validate: selectedMunicipalityId",
        selectedMunicipalityId,
        "exists:",
        exists,
      );
      if (!exists) {
        setSelectedMunicipalityId("");
        setMunicipalityError("Stored municipality not found");
        console.warn("[SystemSettings] validate: clearing invalid stored id");
      } else {
        setMunicipalityError(null);
        // Force re-apply value to ensure controlled select reflects label after async options
        setSelectedMunicipalityId((prev) => String(prev));
      }
    } catch {}
  }, [municipalities, selectedMunicipalityId]);

  /**
   * syncWithStorageEvents
   * Keeps selection in sync when activeMunicipalityId changes elsewhere.
   */
  useEffect(() => {
    if (!isLocalStorageAvailable()) return;
    const handler = (e: StorageEvent) => {
      if (e.key === "activeMunicipalityId") {
        setSelectedMunicipalityId(String(e.newValue ?? ""));
        console.log(
          "[SystemSettings] storage event: activeMunicipalityId",
          e.newValue,
        );
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log(
      "[SystemSettings] state: value",
      selectedMunicipalityId,
      "options",
      municipalities.map((m) => m.id),
    );
  }, [selectedMunicipalityId, municipalities]);

  /**
   * handleMunicipalityChange
   * Applies selected municipality and persists context.
   */
  const handleMunicipalityChange = (id: string) => {
    const exists = municipalities.some((m) => String(m.id) === String(id));
    if (!exists) {
      igrpToast({
        title: "Erro",
        description: "Município inválido",
        type: "error",
      });
      return;
    }
    setSelectedMunicipalityId(id);
    try {
      if (isLocalStorageAvailable()) {
        window.localStorage.setItem("activeMunicipalityId", id);
      }
      const name = municipalities.find((m) => m.id === id)?.name ?? "";
      try {
        if (isLocalStorageAvailable() && name) {
          window.localStorage.setItem("activeMunicipalityName", name);
        }
      } catch {}
      igrpToast({
        title: "Contexto definido",
        description: name
          ? `Município ativo: ${name}`
          : `Município ativo atualizado`,
        type: "success",
      });
    } catch {}
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">System Settings</h1>
      <p className="text-muted-foreground">
        Configure global preferences e contexto
      </p>
      <div>
        <IGRPTemplateThemeSelector />
      </div>
      <div>
        <IGRPSelect
          key={`municipality-${municipalities.length}-${selectedMunicipalityId}`}
          label=""
          name={`municipality`}
          options={municipalities.map((m) => ({ value: m.id, label: m.name }))}
          value={selectedMunicipalityId}
          onValueChange={(val) => {
            console.log("[SystemSettings] select onValueChange", val);
            handleMunicipalityChange(String(val ?? ""));
          }}
          placeholder={`Selecionar município`}
          showSearch={true}
        ></IGRPSelect>
        {municipalityError && (
          <p className="text-sm text-red-600 mt-2">{municipalityError}</p>
        )}
        {loadingMunicipalities && (
          <p className="text-sm text-muted-foreground mt-2">
            Carregando municípios...
          </p>
        )}
      </div>
    </div>
  );
}
