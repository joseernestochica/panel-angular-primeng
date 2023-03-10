
export class LocationLeafletModel {

	constructor (
		public label?: string,
		public keyword?: string,
		public raw?: any,
		public x?: number, // latitud
		public y?: number, // longitud
	) { }

}

export class LocationModel {

	constructor (
		public id?: string,
		public name?: string,
	) { }

}

export class ICountryModel {

	constructor (

		public name?: string,
		public phonecode?: string,
		public isoCode?: string,
		public flag?: string,
		public currency?: string,
		public latitude?: string,
		public longitude?: string,
		public timezones?: Timezones[],

	) { }
}

export class Timezones {

	constructor (

		public zoneName?: string,
		public gmtOffset?: number,
		public gmtOffsetName?: string,
		public abbreviation?: string,
		public tzName?: string,

	) { }
}