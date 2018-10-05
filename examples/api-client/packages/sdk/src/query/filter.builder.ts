export namespace Filter {
    class Operators {
        public static readonly OR: string = ',';
        public static readonly AND: string = ';';
        public static readonly GT: string = '=gt=';
        public static readonly GE: string = '=ge=';
        public static readonly LT: string = '=lt=';
        public static readonly LE: string = '=le=';
        public static readonly EQ: string = '==';
        public static readonly NEQ: string = '!=';
    }

    /**
     * Collection of strategies for wilcard string matching.
     */
    export class MatchMode {
        /**
         * Match the start of a string.
         */
        public static readonly START: string = 'START';

        /**
         * Match the end of a string.
         */
        public static readonly END: string = 'END';

        /**
         * Match anywhere in the string.
         */
        public static readonly ANYWHERE: string = 'ANYWHERE';
    }

    /**
     * A filter item that can define a comparison/condition.
     */
    export interface Property {
        /**
         * Create a filter condition to evaluate whether the property is equal to the specified value.
         *
         * @param value the pattern to evaluate
         * @param moreValues optional additional patterns to evaluate that will be treated as an OR condition
         * @returns an evaluatable filter condition
         */
        equalTo(value: (boolean | number | string), ...moreValues: (boolean | number | string)[]): CompleteCondition;

        /**
         * Create a filter condition to evaluate whether the property is not equal to the specified value.
         *
         * @param value the pattern to evaluate
         * @returns an evaluatable filter condition
         */
        notEqualTo(value: (boolean | number | string)): CompleteCondition;

        /**
         * Create a filter condition to evaluate whether the property is less than the specified value.
         *
         * @param value the pattern to evaluate
         * @returns an evaluatable filter condition
         */
        lessThan(value: number): CompleteCondition;

        /**
         * Create a filter condition to evaluate whether the property is less than or equal to the specified value.
         *
         * @param value the pattern to evaluate
         * @returns an evaluatable filter condition
         */
        lessOrEqualTo(value: number): CompleteCondition;

        /**
         * Create a filter condition to evaluate whether the property is greater than the specified value.
         *
         * @param value the pattern to evaluate
         * @returns an evaluatable filter condition
         */
        greaterThan(value: number): CompleteCondition;

        /**
         * Create a filter condition to evaluate whether the property is greater than or equal to the specified value.
         *
         * @param value the pattern to evaluate
         * @returns an evaluatable filter condition
         */
        greaterOrEqualTo(value: number): CompleteCondition;

        /**
         * Create a filter condition to evaluate whether the property is a wildcard match with the specified value.
         *
         * @param value the pattern to evaluate
         * @param mode the type of wildcard evaluation to perform
         * @returns an evaluatable filter condition
         */
        like(value: string, mode: MatchMode): CompleteCondition;
    }

    /**
     * A representation of a condition that is incomplete by itself, like an empty condition, aggregation wrapper, or junction.
     */
    export interface PartialCondition {
        /**
         * Create a simple property to be evaulated as a filter condition.
         *
         * @param property the name of the property
         * @returns a Property instance for defining a filter condition
         */
        is(property: string): Property;

        /**
         * Create a conjunction (AND) condition from existing conditions.
         *
         * @param condition1 first condition
         * @param condition2 second condition
         * @param conditionN any additional conditions
         * @returns an evaluatable filter condition
         */
        and(condition1: CompleteCondition, condition2: CompleteCondition, conditionN?: CompleteCondition[]): CompleteCondition;

        /**
         * Create a disjunction (OR) condition from existing conditions.
         *
         * @param condition1 first condition
         * @param condition2 second condition
         * @param conditionN any additional conditions
         * @returns an evaluatable filter condition
         */
        or(condition1: CompleteCondition, condition2: CompleteCondition, conditionN?: CompleteCondition[]): CompleteCondition;
    }

    /**
     * An evaluatable filter condition.
     */
    export interface CompleteCondition {
        /**
         * Add a condtion to this condition.
         *
         * This new condition will be ANDed to the existing condition.
         *
         * @returns an incomplete (empty) condition
         */
        and(): PartialCondition;

        /**
         * Add a condtion to this condition.
         *
         * This new condition will be ORed to the existing condition.
         *
         * @returns an incomplete (empty) condition
         */
        or(): PartialCondition;

        /**
         * Build the FIQL representation of the condition.
         *
         * @returns a FIQL string
         */
        query(): string;
    }

    class BuilderChain implements CompleteCondition, PartialCondition, Property {
        private result: string = '';
        private parent: BuilderChain;
        private currentCompositeOp: string;

        constructor(parent?: BuilderChain) {
            this.parent = parent;
        }

        public query(): string {
            return this.buildPartial();
        }

        public and(): PartialCondition;
        public and(condition1: CompleteCondition, condition2: CompleteCondition, conditionN?: CompleteCondition[]): CompleteCondition;
        public and(condition1?: CompleteCondition, condition2?: CompleteCondition, conditionN?: CompleteCondition[]): PartialCondition | CompleteCondition {
            if (!condition1) {
                return this.simpleAnd();
            }

            this.result += "(" + (<BuilderChain> condition1).buildPartial() + Operators.AND + (<BuilderChain> condition2).buildPartial();
            if (conditionN && conditionN.length) {
                conditionN.forEach((condition) => {
                    this.result += Operators.AND + (<BuilderChain> condition).buildPartial();
                });
            }

            this.result += ")";
            return this;
        }

        private simpleAnd(): PartialCondition {
            if (this.currentCompositeOp == Operators.OR || this.parent && this.parent.currentCompositeOp == Operators.OR) {
                if (this.parent) {
                    this.parent.result = '(' + this.parent.result;
                    this.result += ')';
                } else {
                    this.wrap();
                }

                this.currentCompositeOp = Operators.AND;
            }

            this.result += Operators.AND;
            return this;
        }

        public or(): PartialCondition;
        public or(condition1: CompleteCondition, condition2: CompleteCondition, conditionN?: CompleteCondition[]): CompleteCondition;
        public or(condition1?: CompleteCondition, condition2?: CompleteCondition, conditionN?: CompleteCondition[]): PartialCondition | CompleteCondition {
            if (!condition1) {
                return this.simpleOr();
            }

            this.result += "(" + (<BuilderChain> condition1).buildPartial() + Operators.OR + (<BuilderChain> condition2).buildPartial();
            if (conditionN && conditionN.length) {
                conditionN.forEach((condition) => {
                    this.result += Operators.OR + (<BuilderChain> condition).buildPartial();
                });
            }

            this.result += ")";
            return this;
        }

        private simpleOr(): PartialCondition {
            if (this.currentCompositeOp == Operators.AND || (this.parent && this.parent.currentCompositeOp == Operators.AND)) {
                if (this.parent) {
                    this.parent.result = '(' + this.parent.result;
                    this.result += ')';
                } else {
                    this.wrap();
                }

                this.currentCompositeOp = Operators.OR;
            }

            this.result += Operators.OR;
            return this;
        }

        private wrap(): CompleteCondition {
            this.result = '(' + this.result + ')';
            this.currentCompositeOp = null;
            return this;
        }

        private buildPartial(): string {
            return (this.parent) ? this.parent.buildPartial() + this.result : this.result;
        }

        public is(property: string): Property {
            let builder: BuilderChain = new BuilderChain(this);
            builder.result = property;
            return builder;
        }

        public equalTo(value: (boolean | number | string), ...moreValues: (boolean | number | string)[]): CompleteCondition {
            return this.condition(Operators.EQ, value, ...moreValues);
        }

        public notEqualTo(value: (boolean | number | string)): CompleteCondition {
            return this.condition(Operators.NEQ, value);
        }

        public lessThan(value: number): CompleteCondition {
            return this.condition(Operators.LT, value);
        }

        public lessOrEqualTo(value: number): CompleteCondition {
            return this.condition(Operators.LE, value);
        }

        public greaterThan(value: number): CompleteCondition {
            return this.condition(Operators.GT, value);
        }

        public greaterOrEqualTo(value: number): CompleteCondition {
            return this.condition(Operators.GE, value);
        }

        public like(value: string, mode: MatchMode = MatchMode.START): CompleteCondition {
            let wildcardValue: string;
            switch (mode) {
                case MatchMode.START:
                    wildcardValue = `${value}*`;
                    break;
                case MatchMode.END:
                    wildcardValue = `*${value}`;
                    break;
                case MatchMode.ANYWHERE:
                    wildcardValue = `*${value}*`;
                    break;
                default:
                    wildcardValue = value;
                    break;
            }

            return this.condition(Operators.EQ, wildcardValue);
        }

        private condition(operator: string, value: any, ...moreValues: any[]): CompleteCondition {
            const name = this.result;
            this.result += operator + encodeURI(value as string);
            if (moreValues.length) {
                moreValues.forEach((next) => {
                    this.result += ',' + name + operator + encodeURI(next as string);
                });

                this.currentCompositeOp = Operators.OR;
            }

            return this;
        }
    }

    /**
     * Builds a FIQL search condition using a fluent interface.
     */
    export class Builder implements PartialCondition {
        /**
         * Create a simple property to be evaulated as a filter condition.
         *
         * @param property the name of the property
         * @returns a Property instance for defining a filter condition
         */
        is(property: string): Property {
            return new BuilderChain().is(property);
        }

        /**
         * Create a conjunction (AND) condition from existing conditions.
         *
         * @param condition1 first condition
         * @param condition2 second condition
         * @param conditionN any additional conditions
         * @returns an evaluatable filter condition
         */
        and(condition1: CompleteCondition, condition2: CompleteCondition, conditionN?: CompleteCondition[]): CompleteCondition {
            return new BuilderChain().and(condition1, condition2, conditionN);
        }

        /**
         * Create a disjunction (OR) condition from existing conditions.
         *
         * @param condition1 first condition
         * @param condition2 second condition
         * @param conditionN any additional conditions
         * @returns an evaluatable filter condition
         */
        or(condition1: CompleteCondition, condition2: CompleteCondition, conditionN?: CompleteCondition[]): CompleteCondition {
            return new BuilderChain().or(condition1, condition2, conditionN);
        }
    }
}