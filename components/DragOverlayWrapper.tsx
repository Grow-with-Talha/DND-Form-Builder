import { Active, DragOverlay, useDndMonitor } from "@dnd-kit/core";
import React, { useState } from "react";
import { SidebarBtnelementDragOverlay } from "./SidebarBtnelement";
import { ElementType, FormElements } from "./FormElements";
import useDesigner from "./hooks/useDesigner";

const DragOverlayWrapper = () => {
  const [draggedItem, setDraggedItem] = useState<Active | null>(null);
  const { elements } = useDesigner();
  useDndMonitor({
    onDragStart: (event) => {
      setDraggedItem(event.active);
    },
    onDragCancel: (event) => {
      setDraggedItem(null);
    },
    onDragEnd: (event) => {
      setDraggedItem(null);
    },
  });
  if (!draggedItem) return;
  const isSidebarBtnElement = draggedItem?.data?.current?.isDesignerBtnElement;
  let node = <div>Drag Overlay</div>;
  if (isSidebarBtnElement) {
    const type = draggedItem?.data?.current?.type as ElementType;
    node = <SidebarBtnelementDragOverlay formElement={FormElements[type]} />;
  }
  const isDesignerElement = draggedItem.data?.current?.isDesignerElement;
  if (isDesignerElement) {
    const elementId = draggedItem.data?.current?.elementId;
    const element = elements.find((el) => el.id === elementId);
    if (!element) {
      node = <div>Element Not Found</div>;
    } else {
      const DesignerElementComponent =
        FormElements[element.type].designerComponent;
      node = (
        <div className="flex opacity-80 bg-accent  border rounded-md h-[120px] w-full py-2 px-4 pointer pointer-events-none ">
          <DesignerElementComponent elementInstance={element} />
        </div>
      );
    }
  }
  return <DragOverlay>{node}</DragOverlay>;
};

export default DragOverlayWrapper;
