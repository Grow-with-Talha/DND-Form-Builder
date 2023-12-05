"use client";

import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useState,
} from "react";
import { FormElementInstance } from "../FormElements";

type DesignerContextType = {
  elements: FormElementInstance[];
  addElement: (index: number, element: FormElementInstance) => void;
  removeElement: (id: string) => void;
  setElement: Dispatch<SetStateAction<FormElementInstance[]>>;

  selectedElement: FormElementInstance | null;
  setSelectedElement: Dispatch<SetStateAction<FormElementInstance | null>>;

  updateElement: (id: string, element: FormElementInstance) => void;
};

export const Designercontext = createContext<DesignerContextType | null>(null);

export default function DesignercontextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [Elements, setElement] = useState<FormElementInstance[]>([]);
  const [selectedElement, setSelectedElement] =
    useState<FormElementInstance | null>(null);

  const addElement = (index: number, element: FormElementInstance) => {
    setElement((prev) => {
      const newElements = [...prev];
      newElements.splice(index, 0, element);
      return newElements;
    });
  };

  const removeElement = (id: string) => {
    setElement((prev) => prev.filter((element) => element.id !== id));
  };

  const updateElement = (id: string, element: FormElementInstance) => {
    setElement((prev) => {
      const newElements = [ ...prev ];
      const index = newElements.findIndex(el => el.id === id);
      newElements[index] = element;
      return newElements;
    });
  };
  return (
    <Designercontext.Provider
      value={{
        elements: Elements,
        addElement,
        removeElement,
        selectedElement,
        setSelectedElement,
        updateElement,
        setElement,
      }}
    >
      {children}
    </Designercontext.Provider>
  );
}
