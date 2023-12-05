"use client";

import React, { useCallback, useRef, useState, useTransition } from "react";
import { FormElementInstance, FormElements } from "./FormElements";
import { Button } from "./ui/button";
import { HiCursorClick } from "react-icons/hi";
import { string } from "zod";
import { toast } from "./ui/use-toast";
import { ImSpinner2 } from "react-icons/im";
import { SubmitForm } from "@/actions/Form";

const FormSubmitComponent = ({
  formUrl,
  content,
}: {
  content: FormElementInstance[];
  formUrl: string;
}) => {
  const formValues = useRef<{ [key: string]: string }>({});
  const formErrors = useRef<{ [key: string]: boolean }>({});
  const [renderKey, setRenderKey] = useState(new Date().getTime());
  const [submitted, setsubmitted] = useState(false);

  const [pending, startTransition] = useTransition();

  const validateForm: () => boolean = useCallback(() => {
    for (const field of content) {
      const actualValue = formValues.current[field.id] || "";
      const valid = FormElements[field.type].validate(field, actualValue);

      if (!valid) {
        formErrors.current[field.id] = true;
      }
    }

    if (Object.keys(formErrors.current).length > 0) {
      return false;
    }
    return true;
  }, [content]);

  const submitValue = useCallback((key: string, value: string) => {
    formValues.current[key] = value;
  }, []);
  const submitForm = async () => {
    console.log("Form Values", formValues.current);
    formErrors.current = {};

    const validForm = validateForm();
    if (!validForm) {
      setRenderKey(new Date().getTime());
      toast({
        title: "Error",
        description: "Please check the form for errors",
        variant: "destructive",
      });
    }
    try {
        const jsoncontent = JSON.stringify(formValues.current)
        await SubmitForm(formUrl, jsoncontent)
        setsubmitted(true )
    } catch {
      toast({
        title: "Error",
        description: "Something Went Wrong",
        variant: "destructive",
      });
    }
  };

  if(submitted) {
    return (
        <div className="flex justify-center w-full h-full items-center p-8">
            <div className="max-w-[620px] flex flex-col gap-4 flex-grow bg-background w-full p-8 overflow-y-auto border shadow-xl shadow-blue-700 rounded">
                <h1 className="text-2xl font-bold">
                    Form Submitted.
                </h1>
                <p className="text-muted-foreground">Thank You For submitting the form, you can close this page</p>
            </div>
        </div>
    )
  }
  return (
    <div className="flex justify-center w-full h-full items-center p-8 ">
      <div
        key={renderKey}
        className="max-w-[620px] flex flex-col gap-4 flex-grow bg-background w-full p-8 overflow-y-auto border shadow-xl shadow-blue-700 rounded"
      >
        {content.map((element) => {
          const FormElement = FormElements[element.type].FormComponent;
          return (
            <FormElement
              isInvalid={formErrors.current[element.id]}
              key={element.id}
              elementInstance={element}
              submitValue={submitValue}
              defaultValue={formValues.current[element.id]}
            />
          );
        })}
        <Button onClick={() => submitForm()} disabled={pending}>
          {!pending && (
            <>
              <HiCursorClick className="mr-2" /> Submit
            </>
          )}
          {pending && <ImSpinner2 className="animate-spin" />}
        </Button>
      </div>
    </div>
  );
};

export default FormSubmitComponent;
