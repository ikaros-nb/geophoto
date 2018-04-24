import { User } from "./user";

export interface Photo {
    createdAt: string;
    pictureURL: string;
    user: User;
}