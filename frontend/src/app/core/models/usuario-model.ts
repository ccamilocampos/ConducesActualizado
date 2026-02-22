export interface User {
  id: number;
  username: string;
  enabled: boolean;
  roles: string[];
  permissions: string[];
}
