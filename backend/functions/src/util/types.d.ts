import { admin } from "./admin";
import { Request } from "express";
export interface userRequest extends Request {
  user?: admin.auth.DecodedIdToken;
  headers: {
    authorization?: string;
  };
}
