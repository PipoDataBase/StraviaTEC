import { Category } from "./category.module";

export interface Race {
    name?: string;
    inscriptionPrice?: number;
    date?: string;
    private?: boolean;
    routePath?: string;
    type?: number;
    categories?: Category[]
}