import React, { useTransition } from "react";
import { Button } from "./ui/button";
import { HiSave, HiSaveAs } from "react-icons/hi";
import useDesigner from "./hooks/useDesigner";
import { UpdateFormContent } from "@/actions/Form";
import { toast } from "./ui/use-toast";
import { FaSpinner } from "react-icons/fa";
const SaveFormBtn = ({id}: {id: number}) => {
  const { elements } = useDesigner();
  const [loading, startTransition] = useTransition();
  const updateFormContent = async () => {
    try {
      const jsonElements = JSON.stringify(elements);
      await UpdateFormContent(id, jsonElements);
      toast({
        title: "Success",
        description: "Your Form has been Saved",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went Wrong",
        variant: "destructive",
      });
    }
  };

  setInterval(async function() {
    try {
      const jsonElements = JSON.stringify(elements);
      await UpdateFormContent(id, jsonElements);
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went Wrong",
        variant: "destructive",
      });
    }
  }, 10000)
  return (
    <Button variant={"outline"} className="gap-2" disabled={loading} onClick={() => {
      startTransition(updateFormContent)
    }}>
      <HiSave className="h-6 w-6" /> save
      {loading && <FaSpinner className="animate-spin" />}
    </Button>
  );
};

export default SaveFormBtn;
