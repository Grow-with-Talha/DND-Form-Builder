"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { MdTextFields } from "react-icons/md";
import { z } from "zod";
import { ElementType, FormElement, FormElementInstance, Submitfunction } from "../FormElements";
import useDesigner from "../hooks/useDesigner";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { IoMdCheckbox } from "react-icons/io"

import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Switch } from "../ui/switch";
import { Checkbox } from "../ui/checkbox";

const type: ElementType = "CheckBoxField";
const extraAttributes = {
  label: "CheckBox Field",
  helperText: "Helper Text",
  required: false,
};

const propertiesSchema = z.object({
  label: z.string().min(2).max(50),
  helperText: z.string().max(200),
  required: z.boolean().default(false),
});

export const CheckBoxFieldFormElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes,
  }),
  DesignerBtnElement: {
    icon: IoMdCheckbox,
    label: "CheckBox Field",
  },
  designerComponent: DesignerComponent,
  FormComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
  validate: (FormElements: FormElementInstance, currentValue: string):boolean => {
    const element = FormElements as customInstance;
    if(element.extraAttributes.required) {
      return currentValue === "true" 
    }

    return true
  }
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
      label: element.extraAttributes.label,
      helperText: element.extraAttributes.helperText,
      required: element.extraAttributes.required,
    },
  });
  useEffect(() => {
    form.reset(element.extraAttributes);
  }, [element, form]);

  function applyChanges(value: propertiesFormSchemaType) {
    const { label, helperText, required } = value;
    const { id } = element;
    updateElement(id, {
      ...element,
      extraAttributes: {
        label,
        helperText,
        required,
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
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Label</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.currentTarget.blur();
                    }
                  }}
                />
              </FormControl>
              <FormDescription>
                The label of the field. <br /> It will be displayed above the
                field.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="helperText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>HelperText</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.currentTarget.blur();
                    }
                  }}
                />
              </FormControl>
              <FormDescription>
                The Helper Text of the field. <br />
                It will be displayed below the field.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="required"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm ">
              <div className="space-y-0.5 ">
                <FormLabel>HelperText</FormLabel>

                <FormDescription>
                  The Helper Text of the field. <br />
                  It will be displayed below the field.
                </FormDescription>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </div>
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
  const id = `checkbox-${element.id}`
  return (
    <div className="flex items-top space-x-2 ">
      <Checkbox id={id} />
      <div className="grid gap-1.5 leading-none ">
        <Label htmlFor={id}>
          {element.extraAttributes?.label}
          {element.extraAttributes.required && "*"}
        </Label>
        
        {element.extraAttributes?.helperText && (
          <p className="text-muted-foreground text-[0.8rem]">
            {element.extraAttributes?.helperText}
          </p>
        )}
      </div>
    </div>
  );
}

export function FormComponent({
  elementInstance,
  submitValue,
  isInvalid,
  defaultValue
}: {
  elementInstance: FormElementInstance;
  submitValue?: Submitfunction, 
  isInvalid: boolean,
  defaultValue?: string, 
}) {
  const element = elementInstance as customInstance;
  const [value, setValue] = useState<boolean>(defaultValue === "true" ? true : false)
  const [error, seterror] = useState(false)

  useEffect(() => {
    seterror(isInvalid === true)
  }, [isInvalid])

  const id = `checkbox-${element.id}`
  return (
    <div className="flex items-top space-x-2 ">
      <Checkbox id={id} checked={value} className={cn(error && "border-red-500")} onCheckedChange={(checked) => {
        let value = false;
        if(checked === true) value = true
        const stringValue = value ? "true" : "false"
        setValue(value)
        if(!submitValue) return;
        const valid = CheckBoxFieldFormElement.validate(element,stringValue )
        seterror(!valid)
        submitValue(element.id, stringValue)
      }} />
      <div className="grid gap-1.5 leading-none ">
        <Label htmlFor={id} className={cn(error && "text-red-500")}>
          {element.extraAttributes?.label}
          {element.extraAttributes.required && "*"}
        </Label>
        
        {element.extraAttributes?.helperText && (
          <p className={cn("text-muted-foreground text-[0.8rem]", error && "text-red-500")}>
            {element.extraAttributes?.helperText}
          </p>
        )}
      </div>
    </div>
  );
}
