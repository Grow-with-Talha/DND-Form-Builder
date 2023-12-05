"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { RxDropdownMenu } from "react-icons/rx";
import { z } from "zod";
import {
  ElementType,
  FormElement,
  FormElementInstance,
  Submitfunction
} from "../FormElements";
import useDesigner from "../hooks/useDesigner";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

import { cn } from "@/lib/utils";
import { AiOutlineClose, AiOutlinePlus } from "react-icons/ai";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Separator } from "../ui/separator";
import { Switch } from "../ui/switch";
import { toast } from "../ui/use-toast";

const type: ElementType = "SelectField";
const extraAttributes = {
  label: "Label Field",
  helperText: "Helper Text",
  required: false,
  placeholder: "Enter here",
  options: [],
};

const propertiesSchema = z.object({
  label: z.string().min(2).max(50),
  helperText: z.string().max(200),
  required: z.boolean().default(false),
  placeholder: z.string().max(50),
  options: z.array(z.string()).default([]),
});

export const SelectFieldFormElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes,
  }),
  DesignerBtnElement: {
    icon: RxDropdownMenu,
    label: "Select Field",
  },
  designerComponent: DesignerComponent,
  FormComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
  validate: (
    FormElements: FormElementInstance,
    currentValue: string
  ): boolean => {
    const element = FormElements as customInstance;
    if (element.extraAttributes.required) {
      return currentValue.length > 0;
    }

    return true;
  },
};

type propertiesFormSchemaType = z.infer<typeof propertiesSchema>;
export function PropertiesComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const element = elementInstance as customInstance;

  const { updateElement, setSelectedElement } = useDesigner();

  const form = useForm<propertiesFormSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: "onSubmit",
    defaultValues: {
      label: element.extraAttributes.label,
      helperText: element.extraAttributes.helperText,
      required: element.extraAttributes.required,
      placeholder: element.extraAttributes.placeholder,
      options: element.extraAttributes.options,
    },
  });
  useEffect(() => {
    form.reset(element.extraAttributes);
  }, [element, form]);

  function applyChanges(value: propertiesFormSchemaType) {
    const { label, helperText, required, placeholder, options } = value;
    const { id } = element;
    updateElement(id, {
      ...element,
      extraAttributes: {
        label,
        helperText,
        required,
        placeholder,
        options,
      },
    });
    toast({
      title: "Success",
      description: "Properties Saved Successfully"
    })

    setSelectedElement(null )
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(applyChanges)} className="space-y-3 ">
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
          name="placeholder"
          render={({ field }) => (
            <FormItem>
              <FormLabel>PlaceHolder</FormLabel>
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
              <FormDescription>the place holder of the field.</FormDescription>
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
        <Separator />
        <FormField
          control={form.control}
          name="options"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between items-center ">
                <FormLabel>Options</FormLabel>
                <Button
                  variant={"outline"}
                  className="gap-2"
                  onClick={(e) => {
                    e.preventDefault();
                    form.setValue("options", field.value.concat("New option"));
                  }}
                >
                  <AiOutlinePlus />
                  Add
                </Button>
              </div>
              <div className="flex flex-col gap-2 ">
                {form.watch("options").map((option, index) => (
                  <div
                    className="flex items-center justify-between gap-1 "
                    key={index}
                  >
                    <Input
                      placeholder=""
                      value={option}
                      onChange={(e) => {
                        field.value[index] = e.target.value;
                        field.onChange(field.value);
                      }}
                    />
                    <Button
                      variant={"ghost"}
                      size={"icon"}
                      onClick={(e) => {
                        e.preventDefault();
                        const newOptions = [...field.value];
                        newOptions.splice(index, 1);
                        field.onChange(newOptions);
                      }}
                    >
                      <AiOutlineClose />
                    </Button>
                  </div>
                ))}
              </div>

              <FormDescription>
                The Helper Text of the field. <br />
                It will be displayed below the field.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Separator />
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
        <Separator />
        <Button className="w-full " type="submit"></Button>
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
      <Select>
        <SelectTrigger className="w-full ">
          <SelectValue placeholder={element.extraAttributes?.placeholder} />
        </SelectTrigger>
      </Select>
      {element.extraAttributes?.helperText && (
        <p className="text-muted-foreground text-[0.8rem]">
          {element.extraAttributes?.helperText}
        </p>
      )}
    </div>
  );
}

export function FormComponent({
  elementInstance,
  submitValue,
  isInvalid,
  defaultValue,
}: {
  elementInstance: FormElementInstance;
  submitValue?: Submitfunction;
  isInvalid?: boolean;
  defaultValue?: string;
}) {
  const element = elementInstance as customInstance;
  const [value, setValue] = useState(defaultValue || "");
  const [error, seterror] = useState(false);

  useEffect(() => {
    seterror(isInvalid === true);
  }, [isInvalid]);

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className={cn(error && "text-red-500")}>
        {element.extraAttributes?.label}
        {element.extraAttributes.required && "*"}
      </Label>
      <Select
      defaultValue={value}
        onValueChange={(value) => {
          setValue(value);
          if (!submitValue) return;
          const valid = SelectFieldFormElement.validate(element, value);
          seterror(!valid);
          submitValue(element.id, value);
        }}
      >
        <SelectTrigger className={cn("w-full ", error && "border-red-500")}>
          <SelectValue placeholder={element.extraAttributes?.placeholder} />
        </SelectTrigger>
        <SelectContent>
          {element.extraAttributes?.options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {element.extraAttributes?.helperText && (
        <p
          className={cn(
            "text-muted-foreground text-[0.8rem]",
            error && "text-red-500 "
          )}
        >
          {element.extraAttributes?.helperText}
        </p>
      )}
    </div>
  );
}
