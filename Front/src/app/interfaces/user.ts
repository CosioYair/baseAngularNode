export interface User {
    Oid: string;
    Name: string;
    Email: string;
    Password?: string;
    Gender: number;
    Birthdate: any;
    Phone: any;
    NumExt: string;
    NumInt: string;
    Suburb: string;
    Town: string;
    Street: string;
    State: string;
    Country: string;
    PostalCode: string;
    TfaActive: Boolean;
    EmailConfirmed: Boolean;
    IdentityConfirmed: Boolean;
    Active: Boolean;
}
