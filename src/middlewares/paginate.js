export const defaultPagination = (req, res, next) => {
    const limit = parseInt(req.query.limit, 10)

    req.pagination = {
        limit: Number.isInteger(limit) && limit > 0 ? limit : 10,
        after: req.query.after || null,
        before: req.query.before || null,
    }

    next()
}
