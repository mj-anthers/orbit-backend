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
import { commissionService } from '../services/index.js'

import assetsRoute from './asset.route.js'
import organizationMetaRoute from './organization-meta.route.js'
import leadProviderMetaRoute from './lead-provider-meta.route.js'

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

router.get('/sample', asyncHandler(sampleController))

router.use('/auth', authRoutes)

router.use('/lead-provider', authMiddleware, leadProviderRouter)
router.use('/lead-provider-program', authMiddleware, leadProviderProgramRouter)
router.use('/lead', authMiddleware, leadRouter)

router.use('/organization', authMiddleware, organizationRoute)
router.use('/organization-setting', authMiddleware, organizationSettingRoutes)
router.use('/organization-address', authMiddleware, organizationAddressRoute)

router.use('/user-address', authMiddleware, userAddressRoute)

router.use('/callback', callBackRoute)

router.get('/test/:id', async (req, res) => {
    /*const datum = await commissionService.disperseCommission({
        lead: req.params.id,
    })*/
    return res.status(200).json({})
})

router.use('/asset', authMiddleware, assetsRoute)
router.use('/organization-meta', authMiddleware, organizationMetaRoute)
router.use('/lead-provider-meta', authMiddleware, leadProviderMetaRoute)

export default router
