export class UserModel {

	constructor (

		public id?: number,
		public img?: string,
		public sex?: string,
		public birthDate?: Date,
		public createdAt?: Date | string,
		public roles?: string[],
		public isActive?: boolean,
		public isLoginGoogle?: boolean,
		public isLoginFacebook?: boolean,
		public email?: string,
		public name?: string,
		public surnames?: string,
		public password?: string,
		public address?: string,
		public phone?: string,
		public postalCode?: string,
		public city?: string,
		public state?: string,
		public country?: string,
		public nif?: string,

	) { }
}