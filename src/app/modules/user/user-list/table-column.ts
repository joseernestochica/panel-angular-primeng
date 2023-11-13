
import { TableColumnModel } from 'shared/components/table/models/table-column.model';

export const tableColumns: TableColumnModel[] = [
	{
		field: 'img',
		title: 'Avatar',
		active: true,
		styleClass: 'flex justify-content-between align-items-center',
		hasSort: false,
	},
	{
		field: 'name',
		title: 'Nombre',
		active: true,
		styleClass: 'flex justify-content-between align-items-center',
		hasSort: true,
		filter: {
			type: 'text',
			display: 'menu',
			placeholder: 'Buscar por nombre',
			matchMode: 'CONTAINS'
		}
	},
	{
		field: 'surnames',
		title: 'Apellidos',
		active: true,
		styleClass: 'flex justify-content-between align-items-center',
		hasSort: true,
		filter: {
			type: 'text',
			display: 'menu',
			placeholder: 'Buscar por apellidos',
			matchMode: 'CONTAINS'
		}
	},
	{
		field: 'email',
		title: 'Email',
		active: true,
		styleClass: 'flex justify-content-between align-items-center',
		hasSort: true,
		filter: {
			type: 'text',
			display: 'menu',
			placeholder: 'Buscar por email',
			matchMode: 'CONTAINS'
		}
	},
	{
		field: 'phone',
		title: 'Teléfono',
		active: true,
		styleClass: 'flex justify-content-between align-items-center',
		hasSort: true
	},
	{
		field: 'nif',
		title: 'NIF',
		active: true,
		styleClass: 'flex justify-content-between align-items-center',
		hasSort: true
	},
	{
		field: 'created_at',
		title: 'Alta',
		active: false,
		styleClass: 'flex justify-content-between align-items-center',
		hasSort: true
	},
	{
		field: 'postal_code',
		title: 'Código postal',
		active: false,
		styleClass: 'flex justify-content-between align-items-center',
		hasSort: true
	},
	{
		field: 'roles',
		title: 'Role',
		active: false,
		styleClass: 'flex justify-content-between align-items-center',
		hasSort: true,
	},
	{
		field: 'active',
		title: 'Activo',
		active: false,
		styleClass: 'flex justify-content-between align-items-center',
		hasSort: true,
		filter: {
			type: 'boolean',
			display: 'menu',
			placeholder: 'Buscar por activo',
			matchMode: 'CONTAINS'
		}
	},
];