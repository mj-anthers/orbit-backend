import event from '../../event/index.js'
import { EMAIL_EVENTS, EVENTS, SUB_TYPES } from '../../event/config.js'
import {
    LeadProvider,
    LeadProviderEventTimeline,
    LeadProviderProgram,
    Organization,
    User,
    Notification,
} from '../../models/index.js'
import { TIMELINE_STATUS } from '../../models/enum.js'
import { consoleLog } from '../utils/index.js'
import htmlRenderer from '../helpers/html-render.js'

export default {
    invokeCreateEvent: async ({ leadProvider, organization }) => {
        let leadProviderTimelineDatum
        try {
            const leadProviderDatum = await LeadProvider.findOne({
                where: {
                    id: leadProvider.id,
                },
                include: [
                    {
                        model: User,
                        required: false,
                        as: 'userLeadProviderDatum',
                        where: { isDeleted: false },
                    },
                    {
                        model: LeadProviderProgram,
                        required: false,
                        as: 'leadProviderProgramDatum',
                        where: { isDeleted: false },
                    },
                    {
                        model: Organization,
                        required: false,
                        as: 'organizationDatum',
                        where: { isDeleted: false },
                    },
                    {
                        model: Organization,
                        required: false,
                        as: 'organizationDatum',
                        where: { isDeleted: false },
                    },
                    {
                        model: User,
                        required: false,
                        as: 'userCreatedByDatum',
                        where: { isDeleted: false },
                    },
                ],
            })

            consoleLog({
                leadProviderDatum,
            })

            leadProviderTimelineDatum = await LeadProviderEventTimeline.create({
                organization: organization.id,
                leadProvider: leadProviderDatum.id,
                event: SUB_TYPES.EMAIL,
                subEvent: EMAIL_EVENTS.LEAD_PROVIDER_CREATED,
                status: TIMELINE_STATUS.PENDING,
            })

            const notificationDatum = await Notification.findOne({
                where: {
                    organization: organization.id,
                    event: EMAIL_EVENTS.LEAD_PROVIDER_CREATED,
                    isActive: true,
                    isDeleted: false,
                },
            })

            if (!notificationDatum) {
                await LeadProviderEventTimeline.update(
                    {
                        status: TIMELINE_STATUS.FAILED,
                    },
                    {
                        where: {
                            id: leadProviderTimelineDatum.id,
                            meta: 'Notification was not setup',
                        },
                    }
                )
            }

            const parsedTemplate = await htmlRenderer.render({
                data: leadProviderDatum,
                template: notificationDatum.template,
            })

            const parsedSubject = await htmlRenderer.render({
                data: leadProviderDatum,
                template: notificationDatum.subject,
            })

            if (notificationDatum) {
                await event.invokeEvent({
                    source: {
                        type: EVENTS.LEAD_PROVIDER_CREATE,
                        subTypes: [SUB_TYPES.EMAIL],
                    },
                    data: {
                        leadProviderDatum,
                        leadProviderTimelineDatum,
                        notification: {
                            subject: parsedSubject,
                            content: [
                                {
                                    type: 'text/plain',
                                    value: 'View HTML for complete details',
                                },
                                {
                                    type: 'text/html',
                                    value: parsedTemplate,
                                },
                            ],
                            cc: notificationDatum.cc.map((each) => {
                                return {
                                    name: each,
                                    email: each,
                                }
                            }),
                            bcc: notificationDatum.bcc.map((each) => {
                                return {
                                    name: each,
                                    email: each,
                                }
                            }),
                        },
                    },
                })
            }
        } catch (error) {
            consoleLog(error)
            if (leadProviderTimelineDatum) {
                await LeadProviderEventTimeline.update(
                    {
                        status: TIMELINE_STATUS.FAILED,
                    },
                    {
                        where: {
                            id: LeadProviderEventTimeline.id,
                            meta: error.message,
                        },
                    }
                )
            }
        }
    },
}
