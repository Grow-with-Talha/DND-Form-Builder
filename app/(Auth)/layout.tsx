import Logo from '@/components/Logo'
import Modetoggle from '@/components/Modetoggle'
import { UserButton } from '@clerk/nextjs'
import React from 'react'

const layout = ({ children } : { children : React.ReactNode}) => {
  return (
    <div className='flex flex-col min-h-screen min-w-full bg-background max-h-screen'>
      <nav className='flex justify-between items-center border-b border-border h-[60px] py-2 px-4'>
        <Logo />
        <div className='flex gap-4 items-center '>
          <Modetoggle />
        </div>
      </nav>
      <main className='flex flex-grow w-full h-full items-center justify-center'>
      {children}
      </main>
    </div>
  )
}

export default layout