export interface UserModel {
    id: number;
    name: string;
    email: string;
    user: string;
    type: number;
    password?: string;
    configuration: {
        permission: {
            edit: false,
            delete: false,
        },
        zone: any,
    };
    sections: [];
    active: number;
    structures: [];
}
