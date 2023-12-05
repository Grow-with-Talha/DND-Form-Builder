"use client";

import { ElementType, FormElement, FormElementInstance } from "../FormElements";
import { Label } from "../ui/label";

import { RiSeparator } from "react-icons/ri";
import { Separator } from "../ui/separator";

const type: ElementType = "SepratorField";

export const SepratorFieldFormElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    
  }),
  DesignerBtnElement: {
    icon: RiSeparator,
    label: "Seprator",

  },
  designerComponent: DesignerComponent,
  FormComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
  validate: () => true,

};

export function PropertiesComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {

  return (
    <p className="">No properties for this element</p>
    )
  } 



export function DesignerComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className="text-muted-foreground">
        Separator field 
      </Label>
      <Separator />
    </div>
  );
}

export function FormComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const element = elementInstance;

  return (
    <Separator />
  );
}
