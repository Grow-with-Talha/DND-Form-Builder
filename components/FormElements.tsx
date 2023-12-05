import { Record } from "@prisma/client/runtime/library";
import { TextFieldFormElement } from "./fields/TextField";
import { TitleFieldFormElement } from "./fields/TitleField";
import { SubTitleFieldFormElement } from "./fields/SubTitleField";
import { ParagraphFieldFormElement } from "./fields/ParagraphField";
import { SepratorFieldFormElement } from "./fields/SeperatorField";
import { SpacerFieldFormElement } from "./fields/SpacerField";
import { NumberFieldFormElement } from "./fields/NumberField";
import { TextAreaFormElement } from "./fields/TextAreaField";
import { DateFieldFormElement } from "./fields/DateField";
import { SelectFieldFormElement } from "./fields/SelectField";
import { CheckBoxFieldFormElement } from "./fields/CheckboxField";

export type ElementType =
  | "TextField"
  | "TitleField"
  | "SubTitleField"
  | "ParagraphField"
  | "SepratorField"
  | "SpacerField"
  | "NumberField"
  | "TextAreaField"
  | "DateField"
  | "SelectField"
  | "CheckBoxField";

export type Submitfunction = (key: string, value: string) => void;

export type FormElement = {
  type: ElementType;

  construct: (id: string) => FormElementInstance;
  DesignerBtnElement: {
    icon: React.ElementType;
    label: string;
  };

  designerComponent: React.FC<{
    elementInstance: FormElementInstance;
  }>;
  FormComponent: React.FC<{
    elementInstance: FormElementInstance;
    submitValue?: (key: string, value: string) => void;
    isInvalid?: boolean;
    defaultValue?: string;
  }>;
  propertiesComponent: React.FC<{
    elementInstance: FormElementInstance;
  }>;

  validate: (formElement: FormElementInstance, currentValue: string) => boolean;
};

export type FormElementInstance = {
  id: string;
  type: ElementType;
  extraAttributes?: Record<string, any>;
};

type FormElementType = {
  [key in ElementType]: FormElement;
};
export const FormElements: FormElementType = {
  TextField: TextFieldFormElement,
  TitleField: TitleFieldFormElement,
  SubTitleField: SubTitleFieldFormElement,
  ParagraphField: ParagraphFieldFormElement,
  SepratorField: SepratorFieldFormElement,
  SpacerField: SpacerFieldFormElement,
  NumberField: NumberFieldFormElement,
  TextAreaField: TextAreaFormElement,
  DateField: DateFieldFormElement,
  SelectField: SelectFieldFormElement,
  CheckBoxField: CheckBoxFieldFormElement,
};
