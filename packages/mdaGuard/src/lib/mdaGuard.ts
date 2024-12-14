// // packages/mdaGuard/src/lib/madaGuard.ts
// import { CoreAuth } 
// import { SessionManager } from '@mdaGuard/session';
// import { TokenManager } from '@mdaGuard/token';
// import { Authorization } from '@mdaGuard/authorization';

// export interface MdaGuardConfig {
//   modules: {
//     core?: boolean;
//     session?: boolean;
//     token?: boolean;
//     authorization?: boolean;
//   };
// }

// export class MdaGuard {
//   private config: MdaGuardConfig;
//   private modules: {
//     core?: CoreAuth;
//     session?: SessionManager;
//     token?: TokenManager;
//     authorization?: Authorization;
//   };

//   constructor(config: MdaGuardConfig) {
//     this.config = config;
//     this.modules = {};
//     this.initModules();
//   }

//   private initModules() {
//     if (this.config.modules.core) {
//       this.modules.core = new CoreAuth();
//     }
//     if (this.config.modules.session) {
//       this.modules.session = new SessionManager();
//     }
//     if (this.config.modules.token) {
//       this.modules.token = new TokenManager();
//     }
//     if (this.config.modules.authorization) {
//       this.modules.authorization = new Authorization();
//     }
//   }

//   public async login(credentials: { email: string; password: string }) {
//     if (!this.modules.core) {
//       throw new Error('Core module not initialized');
//     }
//     return this.modules.core.login(credentials);
//   }

//   // Add other public methods as needed
// }


 // packages/mdaGuard/src/lib/madaGuard.ts

import { CoreAuth } from '@mdaGuard/core';
import { SessionManager } from '@mdaGuard/session';
import { TokenManager } from '@mdaGuard/token';
import { Authorization } from '@mdaGuard/authorization';

/**
 * Configuration interface for MdaGuard.
 * Specifies which modules should be initialized.
 */
export interface MdaGuardConfig {
  modules: {
    core?: boolean;
    session?: boolean;
    token?: boolean;
    authorization?: boolean;
  };
  tokenSecret?: string; // Added for TokenManager initialization
}

/**
 * MdaGuard class that integrates all authentication and authorization modules.
 */
export class MdaGuard {
  private config: MdaGuardConfig;
  private modules: {
    core?: CoreAuth;
    session?: SessionManager;
    token?: TokenManager;
    authorization?: Authorization;
  };

  /**
   * Creates an instance of MdaGuard.
   * @param {MdaGuardConfig} config - Configuration specifying which modules to initialize.
   */
  constructor(config: MdaGuardConfig) {
    this.config = config;
    this.modules = {};
    this.initModules();
  }

  /**
   * Initializes the modules based on the configuration.
   * @private
   */
  private initModules() {
    if (this.config.modules.core) {
      this.modules.core = new CoreAuth();
    }
    if (this.config.modules.session) {
      this.modules.session = new SessionManager();
    }
    if (this.config.modules.token) {
      if (!this.config.tokenSecret) {
        throw new Error('Token secret is required when token module is enabled');
      }
      this.modules.token = new TokenManager(this.config.tokenSecret);
    }
    if (this.config.modules.authorization) {
      this.modules.authorization = new Authorization();
    }
  }

  /**
   * Attempts to log in a user with the provided credentials.
   * @param {Object} credentials - The login credentials.
   * @param {string} credentials.email - The user's email.
   * @param {string} credentials.password - The user's password.
   * @returns {Promise<boolean>} A promise that resolves to true if login is successful, false otherwise.
   * @throws {Error} If the core module is not initialized.
   */
  public async login(credentials: { email: string; password: string }): Promise<boolean> {
    if (!this.modules.core) {
      throw new Error('Core module not initialized');
    }
    return this.modules.core.login(credentials);
  }

  /**
   * Creates a new session for a user.
   * @param {string} userId - The ID of the user for whom to create a session.
   * @returns {string | null} The session ID if successful, null if the session module is not initialized.
   */
  public createSession(userId: string): string | null {
    if (!this.modules.session) {
      console.warn('Session module not initialized');
      return null;
    }
    return this.modules.session.createSession(userId);
  }

  /**
   * Generates a token for a user.
   * @param {Object} payload - The payload to be included in the token.
   * @returns {Promise<string | null>} A promise that resolves to the token if successful, null if the token module is not initialized.
   */
  public async generateToken(payload: object): Promise<string | null> {
    if (!this.modules.token) {
      console.warn('Token module not initialized');
      return null;
    }
    return this.modules.token.generateToken(payload);
  }

  /**
   * Assigns a role to a user.
   * @param {string} userId - The ID of the user to assign the role to.
   * @param {string} role - The role to assign.
   * @returns {boolean} True if the role was assigned, false if the authorization module is not initialized.
   */
  public assignRole(userId: string, role: string): boolean {
    if (!this.modules.authorization) {
      console.warn('Authorization module not initialized');
      return false;
    }
    this.modules.authorization.assignRole(userId, role);
    return true;
  }

  // Additional methods can be added here as needed
}

