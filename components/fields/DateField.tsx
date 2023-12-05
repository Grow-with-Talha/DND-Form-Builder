"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ElementType, FormElement, FormElementInstance, Submitfunction } from "../FormElements";
import useDesigner from "../hooks/useDesigner";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

import { cn } from "@/lib/utils";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { BsCalendarDateFill } from "react-icons/bs";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Switch } from "../ui/switch";

const type: ElementType = "DateField";
const extraAttributes = {
  label: "Date Field",
  helperText: "Pick a Date",
  required: false,
};

const propertiesSchema = z.object({
  label: z.string().min(2).max(50),
  helperText: z.string().max(200),
  required: z.boolean().default(false),
});

export const DateFieldFormElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes,
  }),
  DesignerBtnElement: {
    icon: BsCalendarDateFill,
    label: "Date Field",
  },
  designerComponent: DesignerComponent,
  FormComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
  validate: (FormElements: FormElementInstance, currentValue: string):boolean => {
    const element = FormElements as customInstance;
    if(element.extraAttributes.required) {
      return currentValue.length > 0 
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
              <div className="space-y-1 ">
                <FormLabel>Required</FormLabel>
                <FormControl className="ml-4">
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
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label>
        {element.extraAttributes?.label}
        {element.extraAttributes.required && "*"}
      </Label>
      <Button variant={"outline"} className="w-full justify-start text-left font-normal ">
        <CalendarIcon className="mr-2 h-4 w-4 " />
        <span className="">Pick A Date</span>
      </Button>
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
  isInvalid?: boolean,
  defaultValue?: string, 
}) {
  const element = elementInstance as customInstance;
  const [date, setDate] = useState<Date | undefined>(defaultValue ? new Date(defaultValue) : undefined)
  const [error, seterror] = useState(false)

  useEffect(() => {
    seterror(isInvalid === true)
  }, [isInvalid])

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className={cn(error && "text-red-500")}>
        {element.extraAttributes?.label}
        {element.extraAttributes.required && "*"}
      </Label>
      <Popover>
        <PopoverTrigger asChild>
        <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal ",
        !date && "text-muted-foreground",
        error && "border-red-500")}>
        <CalendarIcon className="mr-2 h-4 w-4 " />
        {date ? format(date, "PPP"): <span className="">Pick A Date</span> }
      </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 " align="start">
          <Calendar  mode="single" selected={date} onSelect={date => {
            setDate(date);

            if(!submitValue) return;
            const value = date?.toUTCString() || ""
            const valid = DateFieldFormElement.validate(element, value)
            seterror(!valid)
            submitValue(element.id, value)
          }}
          initialFocus/>
        </PopoverContent>
      </Popover>
      {element.extraAttributes?.helperText && (
        <p className={cn("text-muted-foreground text-[0.8rem]", error && "text-red-500 ")}>
          {element.extraAttributes?.helperText}
        </p>
      )}
    </div>
  );
}
