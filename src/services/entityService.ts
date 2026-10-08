// Define o importa el tipo EntityOption según tu proyecto
export interface EntityOption {
  id: string | number;
  name: string;
  // Añade aquí otros campos requeridos por tu interfaz
}

/**
 * Obtiene el listado de entidades desde la API / backend.
 */
export const fetchEntities = async (): Promise<EntityOption[]> => {
  try {
    const response = await fetch('/api/entities'); // Ajusta el endpoint según tu API
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener entidades:', error);
    return [];
  }
};