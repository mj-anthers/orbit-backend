import RuleEngine from './RuleEngine.js'

class MultiRuleEngine {
    constructor(rules = []) {
        this.rules = rules
    }

    evaluate(context) {
        const matchedRules = []
        for (const rule of this.rules) {
            const matched = new RuleEngine(rule).evaluate(context)
            if (matched) {
                matchedRules.push({
                    ruleId: rule._id,
                    title: rule.title,
                    action: rule.action || null,
                    conditionsMatched: matched,
                })
            }
        }
        return matchedRules
    }
}

export default MultiRuleEngine
