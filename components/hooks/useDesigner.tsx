"use client"

import React, { useContext } from 'react'
import { Designercontext } from '../context/DesignerContext'

const useDesigner = () => {
    const context = useContext(Designercontext)
    if(!context) {
        throw new Error("useDesginer must be used in a DesginerContext")
    }
  return context
}

export default useDesigner