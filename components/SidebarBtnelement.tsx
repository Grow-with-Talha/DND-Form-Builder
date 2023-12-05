import React from "react";
import { FormElement } from "./FormElements";
import { Button } from "./ui/button";
import { useDraggable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";

const SidebarBtnelement = ({ formElement }: { formElement: FormElement }) => {
  const { label, icon: Icon } = formElement.DesignerBtnElement;
  const dragable = useDraggable({
    id: `designer-btn-${formElement.type}`,
    data: {
      type: formElement.type,
      isDesignerBtnElement: true,
    },
  });
  return (
    <Button
      ref={dragable.setNodeRef}
      variant={"outline"}
      className={cn("flex flex-col gap-2 h-[120px] w-[120px] cursor-grab",
            dragable.isDragging && "ring-2 ring-primary"
      )}
      {...dragable.listeners}
      {...dragable.attributes}
    >
      <Icon className="h-8 w-8 text-primary cursor-grab " />
      <p className="text-xs ">{label}</p>
    </Button>
  );
};

export default SidebarBtnelement;


export const SidebarBtnelementDragOverlay = ({ formElement }: { formElement: FormElement }) => {
    const { label, icon: Icon } = formElement.DesignerBtnElement;
    return (
      <Button
        variant={"outline"}
        className={cn("flex flex-col gap-2 h-[120px] w-[120px] cursor-grab",
        )}
      >
        <Icon className="h-8 w-8 text-primary cursor-grab " />
        <p className="text-xs ">{label}</p>
      </Button>
    );
  };
  
