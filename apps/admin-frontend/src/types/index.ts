export type User = {
  firstName: string;
  middleName?: string;
  lastName: string;
  mobileNumber: string;
  roles: string[];
  email: string;
  id: number;
};

export type JWTS = {
  accessToken: string;
  refreshToken: string;
};
