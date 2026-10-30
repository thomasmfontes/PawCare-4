const fs = require('fs');
const path = require('path');

const target = path.join(
  __dirname,
  '..',
  'node_modules',
  'expo-notifications',
  'build',
  'TopicSubscriptionModule.android.js'
);

if (fs.existsSync(target)) {
  const content = `import { requireOptionalNativeModule, requireNativeModule } from 'expo-modules-core';

let nativeModule = null;
try {
  if (typeof requireOptionalNativeModule === 'function') {
    nativeModule = requireOptionalNativeModule('ExpoTopicSubscriptionModule');
  } else {
    nativeModule = requireNativeModule('ExpoTopicSubscriptionModule');
  }
} catch (e) {
  nativeModule = null;
}

export default nativeModule || {};
`;
  fs.writeFileSync(target, content, 'utf8');
  console.log('[PawCare] Patch aplicado com sucesso para ExpoTopicSubscriptionModule no Expo Go!');
}
