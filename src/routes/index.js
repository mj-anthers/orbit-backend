import httpStatus from 'http-status'
import { Router } from 'express'
import { authMiddleware } from '../middlewares/auth.middleware.js'
import sampleController from '../controllers/sample.controller.js'
import asyncHandler from '../utils/async-handler.js'
import ResponseHandler from '../utils/response-handler.js'
import authRoutes from './auth.route.js'
import leadProviderRouter from './lead-provider.js'
import organizationSettingRoutes from './organization-settings.route.js'
import leadProviderProgramRouter from './lead-provider-program.js'
import leadRouter from './lead.route.js'
import organizationAddressRoute from './organization-address.route.js'
import userAddressRoute from './user-address.route.js'
import callBackRoute from './callback.route.js'
import organizationRoute from './organization.route.js'

import assetsRoute from './asset.route.js'
import organizationMetaRoute from './organization-meta.route.js'
import leadProviderMetaRoute from './lead-provider-meta.route.js'
import event from '../../event/index.js'
import EVENTS from '../../event/config.js'

const router = Router()

// Base routes
router.get('/', (req, res) => {
    return ResponseHandler.success(
        req,
        res,
        {
            code: httpStatus.OK,
            messageCode: 'GLOBAL_S1',
            data: null,
        },
        'API is working'
    )
})

router.use('/auth', authRoutes)

router.use('/lead', authMiddleware, leadRouter)
router.use('/lead-provider', authMiddleware, leadProviderRouter)
router.use('/lead-provider-program', authMiddleware, leadProviderProgramRouter)
router.use('/lead-provider-meta', authMiddleware, leadProviderMetaRoute)

router.use('/organization', authMiddleware, organizationRoute)
router.use('/organization-setting', authMiddleware, organizationSettingRoutes)
router.use('/organization-address', authMiddleware, organizationAddressRoute)
router.use('/organization-meta', authMiddleware, organizationMetaRoute)

router.use('/user-address', authMiddleware, userAddressRoute)
router.use('/asset', authMiddleware, assetsRoute)
router.use('/callback', callBackRoute)

router.get('/sample', asyncHandler(sampleController))

router.get('/test', async (req, res) => {
    await event.invokeEvent({
        source: EVENTS.ASSET_CREATE,
        data: { id: 1, key: 2 },
    })
    return res.status(200).json({})
})

export default router
