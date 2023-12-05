import React from "react";
import SidebarBtnelement from "./SidebarBtnelement";
import { FormElements } from "./FormElements";
import { Separator } from "./ui/separator";

const FormElementsSidebar = () => {
  return (
    <div>
      <p className="text-sm text-foreground/70">Drag and Drop elements</p>
      <Separator className="my-2 " />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 place-items-center">
        <p className="text-sm text-muted-foreground col-span-1 md:col-span-2 my-2 place-self-start ">
          Layout Elements
        </p>
        <SidebarBtnelement formElement={FormElements.TitleField} />
        <SidebarBtnelement formElement={FormElements.SubTitleField} />
        <SidebarBtnelement formElement={FormElements.ParagraphField } />
        <SidebarBtnelement formElement={FormElements.SepratorField } />
        <SidebarBtnelement formElement={FormElements.SpacerField } />


        <p className="text-sm text-muted-foreground col-span-1 md:col-span-2 my-2 place-self-start ">
          Form Elements
        </p>
        <SidebarBtnelement formElement={FormElements.TextField} />
        <SidebarBtnelement formElement={FormElements.NumberField} />
        <SidebarBtnelement formElement={FormElements.TextAreaField} />
        <SidebarBtnelement formElement={FormElements.DateField} />
        <SidebarBtnelement formElement={FormElements.SelectField} />
        <SidebarBtnelement formElement={FormElements.CheckBoxField} />

      </div>
    </div>
  );
};

export default FormElementsSidebar;
