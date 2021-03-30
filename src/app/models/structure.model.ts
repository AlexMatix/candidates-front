import {UserModel} from './user.model';

export interface StructureModel {
    id: number;
    structure_name: string;
    quantity: number;
    users?: UserModel[];
}
