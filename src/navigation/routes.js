export const flows = Object.freeze({
  Auth: ['Welcome', 'Login', 'Register', 'VerifyPhone'],
  Chatbot: ['ChatList', 'ChatConversation'],
  Projects: [
    'ProjectList',
    'ProjectDetails',
    'PackageSelection',
    'Estimate',
    'Inspection',
    'InstallationStages',
  ],
  Products: ['ProductList', 'ProductDetails', 'ProductFilters'],
  Profile: ['ProfileDetails', 'ProfileEdit', 'Settings'],
  Notifications: ['NotificationList', 'NotificationDetails'],
  Maintenance: [
    'MaintenanceList',
    'MaintenanceDetails',
    'SunixMaintenanceRequest',
    'ExternalMaintenanceRequest',
    'MaintenanceHistory',
  ],
});
