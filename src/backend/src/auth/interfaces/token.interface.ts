export interface Token {
  iat: number;
  exp?: number;
}

export interface AuthPayload extends Token {
  aid?: number;
  uid?: number;
}
