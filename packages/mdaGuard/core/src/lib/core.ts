import { hash, compare } from 'bcrypt';

/**
 * CoreAuth class for handling basic authentication operations.
 * This class provides methods for user registration and login.
 */
export class CoreAuth {
  // In-memory user storage (replace with database in production)
  private users: { email: string; password: string }[] = [];

  /**
   * Registers a new user.
   * @param {string} email - The email of the user to register.
   * @param {string} password - The password of the user to register.
   * @returns {Promise<boolean>} A promise that resolves to true if registration is successful.
   */
  async register(email: string, password: string): Promise<boolean> {
    // Hash the password before storing
    const hashedPassword = await hash(password, 10);
    this.users.push({ email, password: hashedPassword });
    return true;
  }

  /**
   * Authenticates a user.
   * @param {Object} credentials - The login credentials.
   * @param {string} credentials.email - The email of the user.
   * @param {string} credentials.password - The password of the user.
   * @returns {Promise<boolean>} A promise that resolves to true if login is successful, false otherwise.
   */
  async login(credentials: { email: string; password: string }): Promise<boolean> {
    const user = this.users.find(u => u.email === credentials.email);
    if (!user) return false;
    // Compare the provided password with the stored hash
    return compare(credentials.password, user.password);
  }
}

