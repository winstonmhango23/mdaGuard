type Role = 'user' | 'admin' | 'superadmin';

/**
 * Authorization class for handling user roles and permissions.
 * This class provides methods for assigning roles and checking permissions.
 */
export class Authorization {
  // In-memory role storage (replace with database in production)
  private userRoles: Map<string, Set<Role>> = new Map();

  /**
   * Assigns a role to a user.
   * @param {string} userId - The ID of the user to assign the role to.
   * @param {Role} role - The role to assign.
   */
  assignRole(userId: string, role: Role): void {
    const userRoles = this.userRoles.get(userId) || new Set();
    userRoles.add(role);
    this.userRoles.set(userId, userRoles);
  }

  /**
   * Checks if a user has a specific role.
   * @param {string} userId - The ID of the user to check.
   * @param {Role} role - The role to check for.
   * @returns {boolean} True if the user has the role, false otherwise.
   */
  hasRole(userId: string, role: Role): boolean {
    const userRoles = this.userRoles.get(userId);
    return userRoles ? userRoles.has(role) : false;
  }

  /**
   * Gets all roles assigned to a user.
   * @param {string} userId - The ID of the user to get roles for.
   * @returns {Role[]} An array of roles assigned to the user.
   */
  getRoles(userId: string): Role[] {
    return Array.from(this.userRoles.get(userId) || []);
  }
}

