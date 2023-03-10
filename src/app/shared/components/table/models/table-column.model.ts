export class TableColumnModel {

	constructor (

		public field: string,
		public title: string,
		public active: boolean,
		public styleClass: string = 'flex justify-content-between align-items-center',
		public hasSort: boolean,
		public filter?: TableColumnFilterModel,


	) { }
}

export class TableColumnFilterModel {

	constructor (

		public type: string = 'text',
		public display: string = 'menu',
		public placeholder: string = '',
		public matchMode: string = 'CONTAINS',
		public showMatchModes?: boolean,
		public showOperator?: boolean,
		public showAddButton?: boolean,
		public styleClass?: string,

	) { }
}