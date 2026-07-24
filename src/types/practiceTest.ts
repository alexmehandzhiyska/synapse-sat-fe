export type PracticeTestType = 'diagnostic' | 'standard';

export interface PracticeTest {
    id: string;
    title: string;
    type: PracticeTestType;
    createdAt: string;
    updatedAt: string;
}
