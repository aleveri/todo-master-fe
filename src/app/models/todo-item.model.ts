import { ProgressionModel } from './progression.model';

export interface TodoItemModel {
     id: number;
     title: string;
     description: string;
     category: string;
     isCompleted: boolean;
     progressions: ProgressionModel[];
}