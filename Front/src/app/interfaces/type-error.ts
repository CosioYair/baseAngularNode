import { Error } from './error';

export interface TypeError extends Error {
    Type: string;
}
