import type { resGroup } from "./resGroup";

export interface resGroupSelectItemProps {
    element: resGroup;
    handleSelect: (id: string) => void;
}