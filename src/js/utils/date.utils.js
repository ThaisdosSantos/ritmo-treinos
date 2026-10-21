export function formatDate(value,options={day:'numeric',month:'long'}){return new Date(value).toLocaleDateString('pt-BR',options)}
