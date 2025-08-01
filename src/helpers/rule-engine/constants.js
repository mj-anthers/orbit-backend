const RULE_ENGINE_ANY = 'rule_engine_any'

const OPERATOR_TYPES = Object.freeze({
    IS: 'is',
    NOT: 'not',
    EQ: 'eq',
    NEQ: 'neq',
    GT: 'gt',
    GTE: 'gte',
    LT: 'lt',
    LTE: 'lte',
    IN: 'in',
    NIN: 'nin',
})

const BASE_CONDITION_TYPES = Object.freeze({
    ALL: 'all',
    ANY: 'any',
})

export { RULE_ENGINE_ANY, OPERATOR_TYPES, BASE_CONDITION_TYPES }
