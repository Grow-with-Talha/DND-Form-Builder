"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ElementType, FormElement, FormElementInstance } from "../FormElements";
import useDesigner from "../hooks/useDesigner";
import { Label } from "../ui/label";

import { BsTextParagraph } from "react-icons/bs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "../ui/form";
import { Textarea } from "../ui/textarea";

const type: ElementType = "ParagraphField";
const extraAttributes = {
  text: "textHere"
};

const propertiesSchema = z.object({
  text: z.string().min(2).max(500),
});

export const ParagraphFieldFormElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes,
  }),
  DesignerBtnElement: {
    icon: BsTextParagraph,
    label: "Paragraph Field",

  },
  designerComponent: DesignerComponent,
  FormComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
  validate: () => true,

};

type propertiesFormSchemaType = z.infer<typeof propertiesSchema>;
export function PropertiesComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const element = elementInstance as customInstance;

  const { updateElement } = useDesigner();

  const form = useForm<propertiesFormSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: "onBlur",
    defaultValues: {
      text: element.extraAttributes.text,
    },
  });
  useEffect(() => {
    form.reset(element.extraAttributes);
  }, [element, form]);

  function applyChanges(value: propertiesFormSchemaType) {
    const { text } = value;
    const { id } = element;
    updateElement(id, {
      ...element,
      extraAttributes: {
        text,
      },
    });
  }
  return (
    <Form {...form}>
      <form
        onSubmit={(e) => e.preventDefault()}
        onBlur={form.handleSubmit(applyChanges)}
        className="space-y-3 "
      >
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Text</FormLabel>
              <FormControl>
                <Textarea
                rows={5}
                  {...field}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.currentTarget.blur();
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

type customInstance = FormElementInstance & {
  extraAttributes: typeof extraAttributes;
};
export function DesignerComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const element = elementInstance as customInstance;
  const {text} = element.extraAttributes
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className="text-muted-foreground">
        Paragraph  
      </Label>
      <p>{text}</p>
    </div>
  );
}

export function FormComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const element = elementInstance as customInstance;
  const {text} = element.extraAttributes

  return (
    <p>{text}</p>
  );
}
