"use client";
import { Button } from "./ui/button";
import React, { useEffect, useState } from "react";

const VisitBtn = ({ shareUrl }: { shareUrl: string }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;
  const sharelink = `${window.location.origin}/submit/${shareUrl}`;

  return (
    <Button
      className="w-[200px]"
      onClick={() => {
        window.open(sharelink, "_blank");
      }}
    >
      Visit
    </Button>
  );
};

export default VisitBtn;
