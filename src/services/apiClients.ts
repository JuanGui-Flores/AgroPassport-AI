export class ApiError extends Error {
  public status: number;
  public data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

interface RequestOptions extends RequestInit {
  timeoutMs?: number;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

async function fetchWithTimeout(url: string, options: RequestOptions = {}): Promise<Response> {
  const { timeoutMs = 10000, ...fetchOptions } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });
    return response;
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new ApiError("La solicitud excedió el tiempo de espera (Timeout)", 408);
    }
    throw error;
  } finally {
    clearTimeout(id);
  }
}

function getErrorMessage(errorData: unknown, fallback: string): string {
  if (typeof errorData === "object" && errorData !== null && "message" in errorData) {
    const message = (errorData as { message?: unknown }).message;

    if (typeof message === "string" && message.trim().length > 0) {
      return message;
    }

    if (message !== undefined && message !== null) {
      const serializedMessage = JSON.stringify(message);
      if (serializedMessage) {
        return serializedMessage;
      }
    }
  }

  if (typeof errorData === "string" && errorData.trim().length > 0) {
    return errorData;
  }

  return fallback;
}

function buildRequestHeaders(options: RequestOptions): HeadersInit {
  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;

  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };
}

async function getErrorData(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return await response.text();
  }
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const headers = buildRequestHeaders(options);
  const config: RequestOptions = {
    ...options,
    headers,
  };

  const url = endpoint.startsWith("http") ? endpoint : `${BASE_URL}${endpoint}`;

  try {
    const response = await fetchWithTimeout(url, config);

    if (!response.ok) {
      const errorData = await getErrorData(response);
      throw new ApiError(
        getErrorMessage(errorData, `Error HTTP ${response.status}: ${response.statusText}`),
        response.status,
        errorData
      );
    }

    if (response.status === 204) {
      return {} as T;
    }

    return (await response.json()) as T;
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      throw error;
    }

    const message = error instanceof Error ? error.message : "Error de red desconocido";
    throw new ApiError(message, 500);
  }
}