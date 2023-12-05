"use client"
import React, { useEffect, useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { ImShare } from 'react-icons/im'
import { toast } from './ui/use-toast'

const FormLinkShare = ({shareUrl}: {shareUrl: string}) => {
    const sharelink = `${window.location.origin}/submit/${shareUrl}`
    const [mounted, setMounted] = useState(false)

  useEffect(()=> {
    setMounted(true)
  }, [])
  if(!mounted) return null;
  return (
    <div className='flex flex-grow gap-4 items-center '>
        <Input value={sharelink} readOnly />
        <Button className='w-[250px]' onClick={()=> {
            navigator.clipboard.writeText(sharelink)
            toast({
                title: "Copied!!",
                description: "link copied to clipboard"
            })
        }}>
            <ImShare className={"mr-2 h-4 w-4 "} />
            share link
        </Button>
    </div>
  )
}

export default FormLinkShare