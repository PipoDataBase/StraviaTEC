import { Category } from "../category.module";

export interface AvailableRace {
    name?: string;
    inscriptionPrice?: number;
    date?: string;
    private?: boolean;
    routePath?: string;
    type?: string;
    manager?: string
}