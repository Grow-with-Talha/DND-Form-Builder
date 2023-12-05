"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ElementType, FormElement, FormElementInstance } from "../FormElements";
import useDesigner from "../hooks/useDesigner";
import { Label } from "../ui/label";

import { LuSeparatorHorizontal } from "react-icons/lu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "../ui/form";
import { Slider } from "../ui/slider";

const type: ElementType = "SpacerField";
const extraAttributes = {
  height: 20, // px
};

const propertiesSchema = z.object({
  height: z.number().min(5).max(200),
});

export const SpacerFieldFormElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes,
  }),
  DesignerBtnElement: {
    icon: LuSeparatorHorizontal,
    label: "Spacer Field",

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
      height: element.extraAttributes.height,
    },
  });
  useEffect(() => {
    form.reset(element.extraAttributes);
  }, [element, form]);

  function applyChanges(value: propertiesFormSchemaType) {
    const { height } = value;
    const { id } = element;
    updateElement(id, {
      ...element,
      extraAttributes: {
        height,
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
          name="height"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Height (px): {form.watch("height")}</FormLabel>
              <FormControl className="pt-2">
                <Slider defaultValue={[field.value]} min={5} max={200} step={1} onValueChange={(value) => {
                  field.onChange(value[0])
                }} />
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
  const {height} = element.extraAttributes
  return (
    <div className="flex flex-col gap-2 w-full items-center">
      <Label className="text-muted-foreground">
        SpacerField: {height}px
      </Label>
      <LuSeparatorHorizontal className={'h-8 w-8 '} />
    </div>
  );
}

export function FormComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const element = elementInstance as customInstance;
  const {height} = element.extraAttributes

  return (
    <div  style={{ height, width: "100%"}}></div>
    );
}
