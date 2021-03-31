export interface UserModel {
    id: number;
    name: string;
    email: string;
    user: string;
    type: number;
    password?: string;
    configuration: {};
    party: number;
}
