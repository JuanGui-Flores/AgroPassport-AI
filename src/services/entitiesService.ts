import { apiClient } from "./apiClients";
import type { EntityOption } from "@/app/data/entities";

export interface CreateEntityDTO {
  name: string;
  type: "branch" | "partner";
  cuit?: string;
  code?: string;
  address?: string;
  phone?: string;
}

export interface UpdateEntityDTO extends Partial<CreateEntityDTO> {
  id: string;
}

export const entitiesService = {
  /**
   * Obtiene la lista completa de entidades (Sucursales y Aliados)
   */
  async getAll(): Promise<EntityOption[]> {
    return await apiClient<EntityOption[]>("/entities");
  },

  /**
   * Obtiene una entidad específica por su ID
   */
  async getById(id: string): Promise<EntityOption> {
    return await apiClient<EntityOption>(`/entities/${id}`);
  },

  /**
   * Crea una nueva entidad en la base de datos
   */
  async create(data: CreateEntityDTO): Promise<EntityOption> {
    return await apiClient<EntityOption>("/entities", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Actualiza los datos de una entidad existente
   */
  async update(id: string, data: UpdateEntityDTO): Promise<EntityOption> {
    return await apiClient<EntityOption>(`/entities/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  /**
   * Elimina una entidad
   */
  async delete(id: string): Promise<void> {
    return await apiClient<void>(`/entities/${id}`, {
      method: "DELETE",
    });
  },
};