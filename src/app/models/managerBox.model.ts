export interface ManagerBoxModel {
    id: number;
    name: string;
    fatherLastName: string;
    motherLastName: string;
    street: string;
    colony: string;
    curp: string;
    electorKey: string;
    ocr?: string;
    gender: string;
    phone: string;
    cellphone: string;
    type: string;
    district: string;
    municipality: string;
    section: string;
    localDistrict?: string;
    box: string;
    user_id: number;
    political_parties_id: number;
    structure_id: number;
}
