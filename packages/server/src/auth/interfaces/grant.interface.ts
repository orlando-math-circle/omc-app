export type Permission =
  | 'create:own'
  | 'create:any'
  | 'read:own'
  | 'read:any'
  | 'update:own'
  | 'update:any'
  | 'delete:own'
  | 'delete:any';

export interface UserAuthFlags {
  /**
   * Requires that the user has a verified email address.
   */
  verified?: boolean;
}

export interface Grant {
  resource: string;
  permissions: Permission | Permission[];
  flags: UserAuthFlags;
}

export interface TransformedGrant {
  resource: string;
  permissions: Permission[];
  flags: UserAuthFlags;
}
