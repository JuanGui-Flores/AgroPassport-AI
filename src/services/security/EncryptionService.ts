// src/services/security/EncryptionService.ts

import nodeCrypto from 'node:crypto';

const ALGORITHM = 'aes-256-gcm';
// En producción, esta clave debe venir exclusivamente de una variable de entorno segura (ej. process.env.ENCRYPTION_MASTER_KEY)
const SECRET_KEY = nodeCrypto.scryptSync(process.env.ENCRYPTION_MASTER_KEY || 'agro_secure_default_master_key_2026', 'salt', 32);

export class EncryptionService {
  public static encrypt(text: string): string {
    const iv = nodeCrypto.randomBytes(12);
    const cipher = nodeCrypto.createCipheriv(ALGORITHM, SECRET_KEY, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag().toString('hex');

    // Retorna el IV, el texto cifrado y el tag de autenticación unidos
    return `${iv.toString('hex')}:${authTag}:${encrypted}`;
  }

  public static decrypt(encryptedData: string): string {
    const [ivHex, authTagHex, encryptedText] = encryptedData.split(':');
    
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const decipher = nodeCrypto.createDecipheriv(ALGORITHM, SECRET_KEY, iv);
    
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }
}