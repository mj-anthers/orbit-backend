import { OPERATOR_TYPES, RULE_ENGINE_ANY } from './constants.js'

class ConditionEvaluator {
    static evaluate(condition, context) {
        const contextValue = context[condition.type]

        const op = condition.operator.toLowerCase()
        const condValues = condition.values

        if (op === OPERATOR_TYPES.IS && condValues.includes(RULE_ENGINE_ANY)) {
            return Array.isArray(contextValue) && contextValue.length > 0
        }

        switch (op) {
            case OPERATOR_TYPES.IS:
            case OPERATOR_TYPES.IN:
                if (Array.isArray(contextValue)) {
                    return condValues.some((v) => contextValue.includes(v))
                } else {
                    return condValues.includes(contextValue)
                }
            case OPERATOR_TYPES.NOT:
            case OPERATOR_TYPES.NIN:
                if (Array.isArray(contextValue)) {
                    return condValues.every((v) => !contextValue.includes(v))
                } else {
                    return !condValues.includes(contextValue)
                }
            //Single value comparison
            case OPERATOR_TYPES.EQ:
                return contextValue === condValues[0]

            case OPERATOR_TYPES.NEQ:
                return contextValue !== condValues[0]

            case OPERATOR_TYPES.GT:
                return contextValue > condValues[0]

            case OPERATOR_TYPES.GTE:
                return contextValue >= condValues[0]

            case OPERATOR_TYPES.LT:
                return contextValue < condValues[0]

            case OPERATOR_TYPES.LTE:
                return contextValue <= condValues[0]

            default:
                return false
        }
    }
}

export default ConditionEvaluator
