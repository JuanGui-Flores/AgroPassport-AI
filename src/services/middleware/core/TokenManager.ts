// src/services/middleware/core/TokenManager.ts

interface TokenCache {
  accessToken: string;
  expiresAt: number;
}

export class TokenManager {
  private static tokens: Record<string, TokenCache> = {};

  /**
   * Obtiene un token válido para la entidad solicitada. 
   * Si ya existe y no expiró, lo reutiliza. Si no, lo renueva.
   */
  public static async getAccessToken(entityId: string): Promise<string> {
    const cached = this.tokens[entityId];
    const now = Date.now();

    // Si el token existe y le quedan más de 60 segundos de vida, se reutiliza
    if (cached && cached.expiresAt > now + 60000) {
      return cached.accessToken;
    }

    // De lo contrario, solicitamos uno nuevo al servidor OAuth2 del banco
    const newTokenData = await this.requestNewTokenFromBank(entityId);
    
    this.tokens[entityId] = {
      accessToken: newTokenData.access_token,
      expiresAt: now + (newTokenData.expires_in * 1000), // expires_in viene en segundos
    };

    return newTokenData.access_token;
  }

  private static async requestNewTokenFromBank(entityId: string) {
    // Aquí se realiza la llamada real al endpoint de Auth del banco usando mTLS o Client Credentials
    // Ejemplo de endpoint: https://auth.galicia.ar/oauth/token
    console.log(`[TokenManager] Solicitando nuevo token OAuth2 para: ${entityId}`);
    
    // Simulación de respuesta del servidor de autorización
    return {
      access_token: `mock_real_token_${entityId}_${Date.now()}`,
      expires_in: 900, // 15 minutos de duración
    };
  }
}