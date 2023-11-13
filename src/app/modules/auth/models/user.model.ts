export class UserModel {

	constructor (

		public id?: number,
		public name?: string,
		public surnames?: string,
		public email?: string,
		public img?: string,
		public phone?: string,
		public nif?: string,
		public address?: string,
		public city?: string,
		public state?: string,
		public country?: string,
		public postal_code?: string,
		public active?: boolean,
		public roles?: string[],
		public password?: string,
		public created_at?: Date | string,

	) { }
}
