import { GetFormContetByUrl } from '@/actions/Form'
import { FormElementInstance } from '@/components/FormElements'
import FormSubmitComponent from '@/components/FormSubmitComponent'
import React from 'react'

const SubmitPage = async ({params} : {params: {
    formUrl: string,
}}) => {

    const form = await GetFormContetByUrl(params.formUrl)
    if(!form) {
        throw new Error("Form not found")
    }

    const formcontent = JSON.parse(form.content) as FormElementInstance[]

  return <FormSubmitComponent content={formcontent} formUrl={params.formUrl} />
}

export default SubmitPage