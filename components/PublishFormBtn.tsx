import React, { startTransition, useTransition } from "react";
import { Button } from "./ui/button";
import { MdOutlinePublish } from "react-icons/md";
import useDesigner from "./hooks/useDesigner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { FaIcons, FaSpinner } from "react-icons/fa";
import { toast } from "./ui/use-toast";
import { PublishForm } from "@/actions/Form";
import { useRouter } from "next/navigation";



const PublishFormBtn = ({id}: {id: number}) => {
  const { elements } = useDesigner();
  const [ loading, startTransition] = useTransition();
  const router = useRouter()
  async function publishForm() {
    try {
      await PublishForm(id)
      toast({
        title: "Success",
        description: "form published Succesfully",
      })
      router.refresh()
    } catch {
      toast({
        title: "Error",
        description: "something Went Wrong",
        variant: "destructive"
      })
    }
    
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="gap-2 text-white bg-gradient-to-r from-indigo-400 to-cyan-400">
          <MdOutlinePublish className="h-6 w-6" />
          Publish
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This Action cannot be undone, After publishing you will not be able
            to edit this form. <br />
            <br />
            <span className="font-medium">
              By publishing this form you will make it public and you will be
              able to collect submisssions
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction className="flex gap-4 items-center" disabled={loading} onClick={(e) => {e.preventDefault(); startTransition(publishForm)}}>Proceed {loading && <FaSpinner className="animate-spin" />}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PublishFormBtn;
