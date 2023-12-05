import React from 'react'
import SidebarBtnelement from './SidebarBtnelement'
import { FormElements } from './FormElements'
import useDesigner from './hooks/useDesigner'
import FormElementsSidebar from './FormElementsSidebar'
import PropertiesFormSidebar from './PropertiesFormSidebar'

const DesignerSidebar = () => {
  const {selectedElement} = useDesigner()
  return (
    <div>
      <aside className="w-[400px] max-w-[400px] flex flex-col flex-grow gap2 border-l-2 border-muted p-4 bg-background overflow-y-auto h-full">
      {!selectedElement ? (
        <FormElementsSidebar />
      ) : (
        <PropertiesFormSidebar />
      )}
      </aside>
    </div>
  )
}

export default DesignerSidebar