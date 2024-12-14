import { SignJWT, jwtVerify, JWTPayload } from 'jose';

/**
 * TokenManager class for handling JWT operations.
 * This class provides methods for generating and verifying JSON Web Tokens.
 */
export class TokenManager {
  private secret: Uint8Array;

  /**
   * Creates an instance of TokenManager.
   * @param {string} secretKey - The secret key used for signing and verifying tokens.
   * @throws {Error} Will throw an error if secretKey is not provided.
   */
  constructor(secretKey: string) {
    if (!secretKey) {
      throw new Error('Secret key is required');
    }
    // Convert the secret key string to a Uint8Array for use with jose
    this.secret = new TextEncoder().encode(secretKey);
  }

  /**
   * Generates a new JWT token.
   * @param {JWTPayload} payload - The payload to be included in the token.
   * @param {string} [expiresIn='1h'] - The expiration time for the token (e.g., '1h', '7d').
   * @returns {Promise<string>} A promise that resolves with the generated token.
   */
  async generateToken(payload: JWTPayload, expiresIn: string = '1h'): Promise<string> {
    // Calculate the expiration time
    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + parseInt(expiresIn) * 60 * 60; // Convert hours to seconds

    // Create and sign the JWT
    return new SignJWT({ ...payload })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt(iat)
      .setExpirationTime(exp)
      .sign(this.secret);
  }

  /**
   * Verifies a JWT token.
   * @param {string} token - The token to verify.
   * @returns {Promise<JWTPayload | null>} A promise that resolves with the payload if the token is valid, or null if it's invalid.
   */
  async verifyToken(token: string): Promise<JWTPayload | null> {
    try {
      // Verify the token and extract the payload
      const { payload } = await jwtVerify(token, this.secret);
      return payload;
    } catch (error) {
      // Log the error and return null for invalid tokens
      console.error('Token verification failed:', error);
      return null;
    }
  }
}

