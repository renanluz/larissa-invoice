import ClientsManager from './ClientsManager'
import ItemTemplatesManager from './ItemTemplatesManager'

export default function Registrations({ clients, itemTemplates, onSaveClient, onDeleteClient, onSaveTemplate, onDeleteTemplate }) {
  return (
    <>
      <ClientsManager clients={clients} onSave={onSaveClient} onDelete={onDeleteClient} />
      <ItemTemplatesManager templates={itemTemplates} onSave={onSaveTemplate} onDelete={onDeleteTemplate} />
    </>
  )
}
