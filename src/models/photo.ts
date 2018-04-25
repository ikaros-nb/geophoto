import { User } from "./user";

export interface Photo {
    name: string;
    pictureURL: string;
    createdAt: string;
    user: User;
}