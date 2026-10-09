import { apiClient } from "./apiClients";
import type { Lote } from "@/app/data/lotes";

export interface CreateLoteDTO {
  nombre: string;
  hectareas: number;
  entityId?: string;
  score?: number;
  ndvi?: number;
  rindeEst?: string;
  estado?: string;
}

export interface UpdateLoteDTO extends Partial<CreateLoteDTO> {
  id: string;
}

export const lotesService = {
  /**
   * Obtiene todos los lotes, opcionalmente filtrados por entidad
   */
  async getAll(entityId?: string): Promise<Lote[]> {
    const query = entityId ? `?entityId=${encodeURIComponent(entityId)}` : "";
    return await apiClient<Lote[]>(`/lotes${query}`);
  },

  /**
   * Obtiene un lote por ID
   */
  async getById(id: string): Promise<Lote> {
    return await apiClient<Lote>(`/lotes/${id}`);
  },

  /**
   * Crea un nuevo lote en PostgreSQL
   */
  async create(data: CreateLoteDTO): Promise<Lote> {
    return await apiClient<Lote>("/lotes", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Actualiza la información o hectáreas de un lote
   */
  async update(id: string, data: UpdateLoteDTO): Promise<Lote> {
    return await apiClient<Lote>(`/lotes/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  /**
   * Elimina un lote
   */
  async delete(id: string): Promise<void> {
    return await apiClient<void>(`/lotes/${id}`, {
      method: "DELETE",
    });
  },
};