import sequelize from '../config/db/database.js'

import { consoleLog } from '../src/utils/index.js'

// Import model definition functions (not just their final output)
import { ADDRESS_TYPE_ENUM } from './enum.js'
import { User, USER_TYPES } from './user.model.js'
import { Organization, ORGANIZATION_TYPES } from './organization.model.js'
import {
    UserOrganization,
    USER_ORGANIZATION_USER_TYPES,
} from './user-organization.model.js'
import { LeadProvider } from './lead-provider.model.js'
import { OrganizationSetting } from './organization-settings.model.js'
import { Customer } from './customer.model.js'
import { Lead, LEAD_STATUS_ENUM, LEAD_SOURCE_ENUM } from './lead.model.js'
import {
    LeadProviderProgram,
    LEAD_PROVIDER_PROGRAM_BASE_RULE_ENUM,
    LEAD_PROVIDER_PROGRAM_TYPE_ENUM,
    LEAD_PROVIDER_PROGRAM_COMMISSION_BASE_ENUM,
    LEAD_PROVIDER_PROGRAM_UNINSTALLATION_EVENT_ENUM,
} from './lead-provider-program.model.js'
import {
    LeadProviderProgramCondition,
    LEAD_PROVIDER_PROGRAM_CONDITION_OPERATOR_ENUM,
} from './lead-provider-program-condition.model.js'
import {
    Commission,
    COMMISSION_TYPES,
    CREDIT_DEBIT_ENUM,
} from './commission.model.js'
import { UserAddress } from './user-address.model.js'
import { OrganizationAddress } from './organization-address.model.js'
import { LeadProviderProgramCommissionEvent } from './lead-provider-program-commission-event.model.js'
import { LeadCommissionEvent } from './lead-commission-event.model.js'
import { Asset } from './asset.model.js'

// Add models to sequelize instance (optional if already bound in each file)
const models = {
    User,
    Organization,
    UserOrganization,
    LeadProvider,
    OrganizationSetting,
    LeadProviderProgram,
    LeadProviderProgramCondition,
    Customer,
    Lead,
    Commission,
    OrganizationAddress,
    UserAddress,
    LeadProviderProgramCommissionEvent,
    LeadCommissionEvent,
}

// Call associate for each model
Object.keys(models).forEach((modelName) => {
    if (models[modelName].associate) {
        models[modelName].associate(models)
    }
})

// Debug associations:
consoleLog('✅ Associations setup:')
Object.entries(models).forEach(([name, model]) => {
    consoleLog(`${name}:`, Object.keys(model.associations || {}))
})

export {
    sequelize,
    User,
    Organization,
    UserOrganization,
    LeadProvider,
    OrganizationSetting,
    LeadProviderProgram,
    Customer,
    Lead,
    Commission,
    OrganizationAddress,
    UserAddress,
    LeadProviderProgramCommissionEvent,
    LeadCommissionEvent,
    Asset,
    USER_TYPES,
    LEAD_PROVIDER_PROGRAM_BASE_RULE_ENUM,
    LeadProviderProgramCondition,
    LEAD_PROVIDER_PROGRAM_CONDITION_OPERATOR_ENUM,
    LEAD_PROVIDER_PROGRAM_TYPE_ENUM,
    LEAD_PROVIDER_PROGRAM_COMMISSION_BASE_ENUM,
    LEAD_PROVIDER_PROGRAM_UNINSTALLATION_EVENT_ENUM,
    LEAD_STATUS_ENUM,
    COMMISSION_TYPES,
    LEAD_SOURCE_ENUM,
    CREDIT_DEBIT_ENUM,
    ADDRESS_TYPE_ENUM,
    USER_ORGANIZATION_USER_TYPES,
    ORGANIZATION_TYPES,
}
