import fs from 'fs'
import manifest from './dist/manifest.json' assert { type: 'json' }

const webAccessibleResources = manifest.web_accessible_resources

// fix csp
const updatedWebAccessibleResources = webAccessibleResources.map(resource => {
  if (resource.use_dynamic_url) {
    return {
      ...resource,
      use_dynamic_url: false,
    }
  }
  return resource
})

manifest.web_accessible_resources = updatedWebAccessibleResources

const json = JSON.stringify(manifest, null, 2)
fs.writeFileSync('./dist/manifest.json', json, 'utf8')