import { JwtPayload } from "jsonwebtoken";

export interface UserPayload extends JwtPayload {
    id: number,
    name : string,
    email : string
}

declare module "express" {
    interface Request {
        // Module augmentation: adds the user payload to Express's Request interface
        user?: UserPayload;
    }
}
