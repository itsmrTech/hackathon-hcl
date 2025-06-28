import { Request } from "express";

export interface ILoggedInRequest extends Request {
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
    }
}