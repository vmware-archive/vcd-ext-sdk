import { VmQuestionAnswerChoiceType } from "./VmQuestionAnswerChoiceType";
import { ResourceType } from "./ResourceType";
export declare class VmPendingQuestionType extends ResourceType {
    question?: string;
    questionId?: string;
    choices?: VmQuestionAnswerChoiceType[];
}
export declare namespace VmPendingQuestionType {
    class Fields extends ResourceType.Fields {
        static readonly QUESTION: "question";
        static readonly QUESTION_ID: "questionId";
        static readonly CHOICES: "choices";
    }
}
