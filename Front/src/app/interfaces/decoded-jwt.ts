import { Privilege } from './privilege';

export interface DecodedJwt {
    Oid: string;
    Privileges: Privilege[];
    Exp: Date;
    Iat: Date;
}
