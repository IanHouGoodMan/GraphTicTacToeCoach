targetScope = 'resourceGroup'

@description('Azure region for the Static Web App. Free SKU supports a limited set of regions.')
param location string = 'eastasia'

@description('Static Web App name. Include ianhou, teaching, and love-kids wording for the requested site identity.')
param staticWebAppName string = 'ianhou-teaching-love-kids-graph'

@allowed([
  'Free'
  'Standard'
])
@description('Static Web App SKU.')
param sku string = 'Free'

resource staticWebApp 'Microsoft.Web/staticSites@2022-09-01' = {
  name: staticWebAppName
  location: location
  sku: {
    name: sku
    tier: sku
  }
  tags: {
    project: 'graph-theory-teaching'
    owner: 'ianhou'
    purpose: 'love-kids-teaching'
    app: 'react-typescript-only'
  }
  properties: {
    buildProperties: {
      appLocation: 'web-react'
      outputLocation: 'dist'
    }
  }
}

output endpoint string = 'https://${staticWebApp.properties.defaultHostname}'
output staticWebAppName string = staticWebApp.name
