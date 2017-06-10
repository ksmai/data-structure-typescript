import { IComparator } from "./IComparator";

export type ISort<T> = (a: T[], c: IComparator<T>) => void;
