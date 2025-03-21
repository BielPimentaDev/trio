import { MENU } from './../../domain/entities/constants/menu';
import { useCase } from './useCase';

export class visualizeMenuUseCase implements useCase<void, typeof MENU> {
	async execute(): Promise<typeof MENU> {
		return MENU;
	}
}
