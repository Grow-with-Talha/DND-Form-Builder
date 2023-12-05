"use client";
import React, { useState } from "react";
import DesignerSidebar from "./DesignerSidebar";
import {
  DragEndEvent,
  useDndMonitor,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import { ElementType, FormElementInstance, FormElements } from "./FormElements";
import useDesigner from "./hooks/useDesigner";
import { isGenerator } from "@/lib/idGenetator";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { BiSolidTrash } from "react-icons/bi";

const Designer = () => {
  const { elements, addElement, setSelectedElement, selectedElement, removeElement } = useDesigner();

  
  
  const droppable = useDroppable({
    id: "designer-dropable-are",
    data: {
      isDesignerDropArea: true,
    },
  });
  useDndMonitor({
    onDragEnd: (Event: DragEndEvent) => {
      const { active, over } = Event;
      if (!active || !over) return;

      const isDesignerBtnElement = active.data?.current?.isDesignerBtnElement
      const isDroppingOverDesignerDropArea = over.data?.current?.isDesignerDropArea

      if (isDesignerBtnElement && isDroppingOverDesignerDropArea) {
        const type = active.data?.current?.type;
        const newElement = FormElements[type as ElementType].construct(
          isGenerator());
        addElement(elements.length, newElement);
        return;
      }

      const isDroppingOverDesignerElementTopHalf = over.data?.current?.isTopHalfDesignerElement 
      const isDroppingOverDesignerElementBottomHalf = over.data?.current?.isBottomHalfDesignerElement 

      const isDroppingOverDesignerElement = isDroppingOverDesignerElementTopHalf || isDroppingOverDesignerElementBottomHalf

      const isDroppingOverDesignerButtonElement = isDesignerBtnElement && isDroppingOverDesignerElement;


      if(isDroppingOverDesignerButtonElement){
        const type = active.data?.current?.type;
        const newElement = FormElements[type as ElementType].construct(
          isGenerator());
            const overId = over.data?.current?.elementId;
          const OverElementIndex = elements.findIndex(el => el.id === overId)
          if(OverElementIndex === -1){
            throw new Error("element not found")
          }
          let indexForNewElement = OverElementIndex;

          if(isDroppingOverDesignerElementBottomHalf){
            indexForNewElement = OverElementIndex + 1
          }
        addElement(indexForNewElement, newElement);
        return;
      }

      const isDraggingDesignerElement = active.data?.current?.isDesignerElement;
      const draggingDesignerElementOverAnotherDesignerElement = isDroppingOverDesignerElement && isDraggingDesignerElement
      if(draggingDesignerElementOverAnotherDesignerElement){
        const activeId = active.data?.current?.elementId;
        const overId= over.data?.current?.elementId;
        const activeElementIndex = elements.findIndex(el => el.id === activeId)
        const overElementIndex = elements.findIndex(el => el.id === overId)

        if(activeElementIndex === -1){
          throw new Error("Element not found")
        }
        const activeElement = {...elements[activeElementIndex]}
        removeElement(activeId)
        const OverElementIndex = elements.findIndex(el => el.id === overId)

        let indexForNewElement = OverElementIndex;

          if(isDroppingOverDesignerElementBottomHalf){
            indexForNewElement = OverElementIndex + 1
          }

        addElement(indexForNewElement, activeElement)
      }
    },
  });


  return (
    <div className="flex w-full h-full">
      <div className="p-4 w-full" onClick={(e) => {
        e.stopPropagation()
        setSelectedElement(null)
      }}>
        <div
          ref={droppable.setNodeRef}
          className={cn("bg-background max-w-[920px] h-full m-auto rounded-xl flex flex-col flex-grow items-center justify-start flex-1 overflow-y-auto", droppable.isOver && "ring-4 ring-primary ring-inset")}
        >
          {!droppable.isOver && elements.length === 0 && (
            <p className="text-3xl text-muted-foreground flex flex-grow items-center font-bold">
              Drop Here
            </p>
          )}
          {droppable.isOver && elements.length === 0 && (
            <div className="p-4 w-full">
              <div className="h-[120px] rounded-md bg-primary/20"></div>
            </div>
          )}
          {elements.length > 0 && (
            <div className="flex flex-col w-full gap-2 p-4 ">
              {elements.map((element) => (
                <DesginerElementWrapper key={element.id} element={element} />
              ))}
            </div>
          )}
        </div>
      </div>
      <DesignerSidebar />
    </div>
  );
};

function DesginerElementWrapper({ element }: { element: FormElementInstance }) {
  const DesignerElement = FormElements[element.type].designerComponent;
  const [isMouseOver, setIsMouseOver] = useState<boolean>(false);
  const { removeElement, selectedElement, setSelectedElement } = useDesigner();
  const dragable = useDraggable({
    id: element.id + "-drag-handler",
    data: {
      type: element.type,
      elementId: element.id,
      isDesignerElement: true,
    },
  });

  const topHalf = useDroppable({
    id: element.id + "-top",
    data: {
      type: element.type,
      elementId: element.id,
      isTopHalfDesignerElement: true,
    },
  });
  const BottomHalf = useDroppable({
    id: element.id + "-bottom",
    data: {
      type: element.type,
      elementId: element.id,
      isBottomHalfDesignerElement: true,
    },
  });
  if (dragable.isDragging) return null;
  
  return (
    <div
      className="relative h-[120px] flex flex-col text-foreground hover:cursor-pointer rounded-md ring-1 ring-accent ring-inset "
      ref={dragable.setNodeRef}
      {...dragable.listeners}
      {...dragable.attributes}
      onMouseOver={() => setIsMouseOver(true)}
      onMouseOut={() => setIsMouseOver(false)}

      onClick={(e) => {
        e.stopPropagation()
        setSelectedElement(element)
      }}
    >
      <div
        ref={topHalf.setNodeRef}
        className={"absolute w-full -z-10 h-1/2 rounded-t-md"}
      />
      <div
        ref={BottomHalf.setNodeRef}
        className="absolute w-full bottom-0 -z-10 h-1/2 rounded-b-md "
      />
      {isMouseOver && (
        <>
          <div className="absolute right-0 h-full ">
            <Button
              className="flex justify-center h-full border rounded-md rounded-l-none z-[100] bg-red-500"
              variant={"outline"}
              onClick={(e) => {
                e.stopPropagation()
                removeElement(element.id)
              }}
            >
              <BiSolidTrash className="h-6 w-6 " />{" "}
            </Button>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse ">
            <p className="text-muted-foreground text-sm ">
              Click for Properties or Drag to move
            </p>
          </div>
        </>
      )}
      {topHalf.isOver && (
        <div className="absolute top-0 w-full rounded-md h-[7px] bg-primary rounded-b-none "></div>
      )}
      <div
        className={cn(
          "flex w-full h-[120px] items-center rounded-md bg-accent/40 opacity-100  px-4 py-4 pointer-events-none",
          isMouseOver && "opacity-30",
        )}
      >
        <DesignerElement elementInstance={element} />
      </div>
      {BottomHalf.isOver && (
        <div className="absolute bottom-0 w-full rounded-md h-[7px] bg-primary rounded-t-none "></div>
      )}
    </div>
  );
}

export default Designer;
