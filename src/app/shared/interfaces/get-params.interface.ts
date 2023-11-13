
export interface GetParams<T> {

	id?: number;
	ids?: number[];
	page?: number;
	limit?: number
	sortc?: string;
	sortd?: string;
	showFields?: string[];
	search?: string;
	queryParams?: GetParamsQueryParams[];
	body?: T;

}

export interface GetParamsQueryParams {
	name: string;
	value: string;
}