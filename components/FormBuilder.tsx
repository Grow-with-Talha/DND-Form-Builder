"use client";
import { Form } from "@prisma/client";
import React, { useEffect, useState } from "react";
import PreviewDialogBtn from "./PreviewDialogBtn";
import SaveFormBtn from "./SaveFormBtn";
import PublishFormBtn from "./PublishFormBtn";
import Designer from "./Designer";
import Confetti from "react-confetti"
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import DragOverlayWrapper from "./DragOverlayWrapper";
import useDesigner from "./hooks/useDesigner";
import { ImSpinner2 } from "react-icons/im";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "./ui/use-toast";
import Link from "next/link";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";

const FormBuilder = ({ form }: { form: Form }) => {
  const { setElement, setSelectedElement } = useDesigner();
  const [isReady, setisReady] = useState(false);

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 300,
      tolerance: 5,
    },
  });
  const sensors = useSensors(mouseSensor, touchSensor);

  useEffect(() => {
    if(isReady) return;
    setSelectedElement(null)
    const elements = JSON.parse(form.content);
    setElement(elements);
    const readyTimeOut = setTimeout(() => setisReady(true), 500);

    return () => clearTimeout(readyTimeOut);
  }, [form, setElement, isReady,setSelectedElement]);

  if (!isReady) {
    return;
    <div className="flex flex-col items-center justify-center w-full h-full">
      <ImSpinner2 className="animate-spin h-12 w-12" />
    </div>;
  }
  const shareUrl = `${window.location.origin}/submit/${form.shareUrl}`

  if(form.published){
    return <>
    <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} numberOfPieces={1000} />
      <div className="flex flex-col items-center justify-center w-full h-full ">
      <div className="max-w-md">
          <h1 className="text-center text-4xl text-primary font-bold border-b pb-2 mb-10">
            🙌🎉 Form Published Succesfully 🎉🙌
          </h1>
          <h2 className="text-2xl ">Share this Form</h2>
          <h3 className="text-xl text-muted-foreground border-b pb-10  ">Anyone with the link can view and submit this form</h3>
          <div className="my-4 flex flex-col gap-2 items-center w-full border-b pb-4 ">
            <Input className="w-full " readOnly value={shareUrl} />
            <Button className="mt-2 w-full " onClick={() => {
              navigator.clipboard.writeText(shareUrl)
              toast({
                title: "Copied!!",
                description: "Link copied to clipboard"
              })}
            }>Copy Link</Button>
          </div>
          <div className="flex justify-between">
            <Button variant={"link"} asChild>
              <Link href={"/"} className="gap-2 ">
                <BsArrowLeft />
                Go back to home
              </Link>
            </Button>
            <Button variant={"link"} asChild>
              <Link href={`/forms/${form.Id}`} className="gap-2 ">
                Form Details
                <BsArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  }

  return (
    <DndContext sensors={sensors}>
      <main className="flex flex-col w-full">
        <nav className="flex justify-between border-b-2 p-4  gap-3 items-center">
          <h2 className="truncate font-medium">
            <span className="text-muted-foreground mr-2">Form: </span>
          </h2>
          <div className="flex items-center gap-2">
            <PreviewDialogBtn />
            {!form.published && (
              <>
                <SaveFormBtn id={form.Id} />
                <PublishFormBtn id={form.Id}/>
              </>
            )}
          </div>
        </nav>
        <div className="flex w-full flex-grow items-center justify-center relative overflow-y-auto h-[200px] bg-accent bg-[url(/Paper.svg)] dark:bg-[url(/Paper-Dark.svg)]">
          <Designer />
        </div>
      </main>
      <DragOverlayWrapper />
    </DndContext>
  );
};

export default FormBuilder;
