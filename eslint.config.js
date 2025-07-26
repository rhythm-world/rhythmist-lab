import ts from '@typed-sigterm/eslint-config';

export default ts({
  ignores: [
    './server/utils/db/auth-schema.ts',
  ],
}, {
  rules: {
    'no-redeclare': [0],
  },
});
