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
import { commissionService } from '../services/index.js'
import httpStatus from 'http-status'

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
router.use('/organization-setting', authMiddleware, organizationSettingRoutes)
router.use('/lead-provider-program', authMiddleware, leadProviderProgramRouter)
router.use('/lead', authMiddleware, leadRouter)
router.use('/organization-address', authMiddleware, organizationAddressRoute)
router.use('/user-address', authMiddleware, userAddressRoute)

router.get('/test/:id', async (req, res) => {
    /*const datum = await commissionService.disperseCommission({
        lead: req.params.id,
    })*/
    return res.status(200).json({})
})

export default router
