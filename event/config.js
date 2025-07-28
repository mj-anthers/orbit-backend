const EVENTS = Object.freeze({
    ASSET_CREATE: 'asset.create',
    ASSET_UPDATE: 'asset.update',
    ASSET_DELETE: 'asset.delete',

    AUTH_CREATE: 'auth.create',
    AUTH_UPDATE: 'auth.update',
    AUTH_DELETE: 'auth.delete',

    CALLBACK_CREATE: 'callback.create',
    CALLBACK_UPDATE: 'callback.update',
    CALLBACK_DELETE: 'callback.delete',

    LEAD_PROVIDER_META_CREATE: 'leadProviderMeta.create',
    LEAD_PROVIDER_META_UPDATE: 'leadProviderMeta.update',
    LEAD_PROVIDER_META_DELETE: 'leadProviderMeta.delete',

    LEAD_PROVIDER_PROGRAM_CREATE: 'leadProviderProgram.create',
    LEAD_PROVIDER_PROGRAM_UPDATE: 'leadProviderProgram.update',
    LEAD_PROVIDER_PROGRAM_DELETE: 'leadProviderProgram.delete',

    LEAD_PROVIDER_CREATE: 'leadProvider.create',
    LEAD_PROVIDER_UPDATE: 'leadProvider.update',
    LEAD_PROVIDER_DELETE: 'leadProvider.delete',

    LEAD_CREATE: 'lead.create',
    LEAD_UPDATE: 'lead.update',
    LEAD_DELETE: 'lead.delete',

    ORGANIZATION_ADDRESS_CREATE: 'organizationAddress.create',
    ORGANIZATION_ADDRESS_UPDATE: 'organizationAddress.update',
    ORGANIZATION_ADDRESS_DELETE: 'organizationAddress.delete',

    ORGANIZATION_META_CREATE: 'organizationMeta.create',
    ORGANIZATION_META_UPDATE: 'organizationMeta.update',
    ORGANIZATION_META_DELETE: 'organizationMeta.delete',

    ORGANIZATION_SETTING_CREATE: 'organizationSetting.create',
    ORGANIZATION_SETTING_UPDATE: 'organizationSetting.update',
    ORGANIZATION_SETTING_DELETE: 'organizationSetting.delete',

    ORGANIZATION_CREATE: 'organization.create',
    ORGANIZATION_UPDATE: 'organization.update',
    ORGANIZATION_DELETE: 'organization.delete',

    USER_ADDRESS_CREATE: 'userAddress.create',
    USER_ADDRESS_UPDATE: 'userAddress.update',
    USER_ADDRESS_DELETE: 'userAddress.delete',
})

export default EVENTS
