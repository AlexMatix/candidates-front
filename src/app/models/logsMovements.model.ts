import {UserModel} from './user.model';

export interface LogsMovementsModel {
    id: number;
    date: string;
    type: string;
    detail: string;
    user: UserModel;
}
