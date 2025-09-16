import { throwSpecificError } from '../middlewares/index.js'
import httpStatus from 'http-status'
import {
    LeadProviderComment,
    LeadProviderEventTimeline,
} from '../../models/index.js'
import { consoleLog } from '../utils/index.js'

export default {
    leadProviderTimeline: async ({ id }) => {
        try {
            const timeLineEvents = await LeadProviderEventTimeline.findAll({
                where: { leadProvider: id, isDeleted: false },
                order: [['createdAt', 'DESC']],
                raw: true,
            })

            const timeLineComments = await LeadProviderComment.findAll({
                where: { leadProvider: id, isDeleted: false },
                order: [['createdAt', 'DESC']],
                raw: true,
            })

            const eventsWithType = timeLineEvents.map((e) => ({
                ...e,
                type: 'event',
            }))
            const commentsWithType = timeLineComments.map((c) => ({
                ...c,
                type: 'comment',
            }))

            return [...eventsWithType, ...commentsWithType].sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            )
        } catch (error) {
            throwSpecificError(
                error,
                httpStatus.INTERNAL_SERVER_ERROR,
                'TIMELINE_E1'
            )
        }
    },
}
