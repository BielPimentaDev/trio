export interface useCase<IN, OUT> {
	execute(entrada: IN): Promise<OUT>;
}
