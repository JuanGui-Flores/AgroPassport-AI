// src/app/components/EntitySelector.tsx
"use client";

import React, { useState } from "react";
import { INITIAL_BANKS, INITIAL_INSURANCES, EntityOption } from "@/app/data/entities";
interface EntitySelectorProps {
  selectedEntity: EntityOption;
  onSelectEntity: (entity: EntityOption) => void;
}

export const EntitySelector: React.FC<EntitySelectorProps> = ({
  selectedEntity,
  onSelectEntity,
}) => {
  const [banks, setBanks] = useState<EntityOption[]>(INITIAL_BANKS);
  const [insurances, setInsurances] = useState<EntityOption[]>(INITIAL_INSURANCES);
  const [customName, setCustomName] = useState("");
  const [customType, setCustomType] = useState<"bank" | "insurance">("bank");
  const [isAdding, setIsAdding] = useState(false);

  const handleAddCustom = () => {
    if (!customName.trim()) return;

    const newEntity: EntityOption = {
      id: customName.toLowerCase().replace(/\s+/g, "-"),
      name: customName.trim(),
      type: customType,
      defaultTasa: customType === "bank" ? 15.0 : undefined,
    };

    if (customType === "bank") {
      setBanks([...banks, newEntity]);
    } else {
      setInsurances([...insurances, newEntity]);
    }

    onSelectEntity(newEntity);
    setCustomName("");
    setIsAdding(false);
  };

  return (
    <div className="relative inline-block text-left">
      {!isAdding ? (
        <div className="flex items-center gap-2">
          <select
            value={selectedEntity.id}
            onChange={(e) => {
              const id = e.target.value;
              if (id === "add_new") {
                setIsAdding(true);
                return;
              }
              const all = [...banks, ...insurances];
              const found = all.find((item) => item.id === id);
              if (found) onSelectEntity(found);
            }}
            className="bg-slate-800 text-white border border-slate-700 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            <optgroup label="Bancos">
              {banks.map((bank) => (
                <option key={bank.id} value={bank.id}>
                  🏦 {bank.name}
                </option>
              ))}
            </optgroup>
            <optgroup label="Aseguradoras">
              {insurances.map((ins) => (
                <option key={ins.id} value={ins.id}>
                  🛡️ {ins.name}
                </option>
              ))}
            </optgroup>
            <optgroup label="Opciones">
              <option value="add_new">+ Agregar otra entidad...</option>
            </optgroup>
          </select>
        </div>
      ) : (
        <div className="flex items-center gap-2 bg-slate-800 p-1.5 rounded-lg border border-slate-700">
          <input
            type="text"
            placeholder="Nombre de Banco o Seguros..."
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            className="bg-slate-900 text-white text-xs px-2 py-1 rounded border border-slate-600 focus:outline-none"
          />
          <select
            value={customType}
            onChange={(e) => setCustomType(e.target.value as "bank" | "insurance")}
            className="bg-slate-900 text-white text-xs px-2 py-1 rounded border border-slate-600"
          >
            <option value="bank">Banco</option>
            <option value="insurance">Aseguradora</option>
          </select>
          <button
            onClick={handleAddCustom}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-2.5 py-1 rounded font-medium"
          >
            Guardar
          </button>
          <button
            onClick={() => setIsAdding(false)}
            className="text-slate-400 hover:text-white text-xs px-1"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};