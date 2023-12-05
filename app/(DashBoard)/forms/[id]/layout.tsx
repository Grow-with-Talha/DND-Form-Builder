import Logo from '@/components/Logo'
import Modetoggle from '@/components/Modetoggle'
import { UserButton } from '@clerk/nextjs'
import React from 'react'

const layout = ({ children } : { children : React.ReactNode}) => {
  return (
    <div className='flex w-full mx-auto flex-col'>      
      {children}
    </div>
  )
}

export default layout