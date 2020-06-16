export type Permission =
  | 'create:own'
  | 'create:any'
  | 'read:own'
  | 'read:any'
  | 'update:own'
  | 'update:any'
  | 'delete:own'
  | 'delete:any';

export interface Grant {
  resource: string;
  permissions: Permission | Permission[];
}

export interface TransformedGrant {
  resource: string;
  permissions: Permission[];
}
