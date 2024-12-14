/**
 * SessionManager class for handling user sessions.
 * This class provides methods for creating and validating sessions.
 */
export class SessionManager {
  // In-memory session storage (replace with database or distributed cache in production)
  private sessions: Map<string, { userId: string; expiresAt: number }> = new Map();

  /**
   * Creates a new session for a user.
   * @param {string} userId - The ID of the user for whom to create a session.
   * @param {number} [expiresIn=3600000] - The session expiration time in milliseconds (default is 1 hour).
   * @returns {string} The created session ID.
   */
  createSession(userId: string, expiresIn: number = 3600000): string {
    const sessionId = Math.random().toString(36).substring(2);
    this.sessions.set(sessionId, {
      userId,
      expiresAt: Date.now() + expiresIn,
    });
    return sessionId;
  }

  /**
   * Validates a session.
   * @param {string} sessionId - The ID of the session to validate.
   * @returns {boolean} True if the session is valid, false otherwise.
   */
  validateSession(sessionId: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) return false;
    if (session.expiresAt < Date.now()) {
      // Session has expired, remove it
      this.sessions.delete(sessionId);
      return false;
    }
    return true;
  }
}

