export interface AuthUser {
    id: string;
    username: string;
  }
  
  export interface AuthResponse {
    data: AuthUser;
    message: string;
  }