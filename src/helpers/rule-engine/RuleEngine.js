import { BASE_CONDITION_TYPES } from './constants.js'
import ConditionEvaluator from './ConditionEvaluator.js'

class RuleEngine {
    constructor(rule) {
        this.rule = rule
    }

    evaluate(context) {
        const results = this.rule.conditions.map((cond) =>
            ConditionEvaluator.evaluate(cond, context)
        )

        let conditionsPassed = false
        if (this.rule.baseRule === BASE_CONDITION_TYPES.ALL) {
            conditionsPassed = results.every(Boolean)
        } else if (this.rule.baseRule === BASE_CONDITION_TYPES.ANY) {
            conditionsPassed = results.some(Boolean)
        }

        return {
            matched: conditionsPassed,
            ruleId: this.rule.id,
            title: this.rule.title,
            conditions: results,
        }
    }
}
export default RuleEngine
