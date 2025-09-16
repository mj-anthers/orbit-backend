import { Op } from 'sequelize'

export default {
    parseSequelizeWhere: (query, searchableFields = []) => {
        try {
            const where = {}

            for (const [field, value] of Object.entries(query)) {
                if (field === 'q' && searchableFields.length > 0) {
                    // Free-text search across multiple fields
                    where[Op.or] = searchableFields.map((f) => ({
                        [f]: { [Op.iLike]: `%${value}%` }, // Use Op.like for MySQL
                    }))
                } else if (Array.isArray(value)) {
                    // case: leadProvider[]=id1&id2
                    where[field] = { [Op.in]: value }
                } else if (typeof value === 'object' && value !== null) {
                    // case: amount[gte]=200 → { amount: { gte: '200' } }
                    where[field] = {}
                    for (const [op, val] of Object.entries(value)) {
                        where[field][Op[op]] = isNaN(val) ? val : Number(val)
                    }
                } else {
                    // case: single query param → leadProvider=uuid
                    where[field] = {
                        [Op.eq]: isNaN(value) ? value : Number(value),
                    }
                }
            }

            return where
        } catch (error) {
            consoleLog(error)
            return {}
        }
    },
}
