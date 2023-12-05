
import { GetFormById } from '@/actions/Form'
import FormBuilder from '@/components/FormBuilder'
import React from 'react'

const BuilderPage = async ({params} : {params: {id: String}}) => {
  const form = await GetFormById(Number(params.id))
  if(!form){
    throw new Error("Form not found")
  }

  return (
      <FormBuilder form={form} />
    )
}

export default BuilderPage