import { GetTableOfContentIndexFunction, GetTableOfContentLevelFunction, TableOfContentDataItem } from './types';
export declare const getLastHeadingOnLevel: (headings: TableOfContentDataItem[], level: number) => TableOfContentDataItem | undefined;
export declare const getHeadlineLevel: GetTableOfContentLevelFunction;
export declare const getLinearIndexes: GetTableOfContentIndexFunction;
export declare const getHierarchicalIndexes: GetTableOfContentIndexFunction;
export declare function debounce(func: (...args: any[]) => void, wait: number): (...args: any[]) => void;
