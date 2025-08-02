module.exports = {
  root: true,
  env: { 
    browser: true, 
    es2020: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    '@eslint/js',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { 
    ecmaVersion: 'latest', 
    sourceType: 'module' 
  },
  settings: { 
    react: { version: '18.2' } 
  },
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'react/prop-types': 'off', // Disable prop-types for development
    'no-unused-vars': 'off', // Disable unused vars for development
    'react/no-unescaped-entities': 'off', // Disable unescaped entities rule
    'react-hooks/exhaustive-deps': 'off', // Disable exhaustive deps
    'react/jsx-uses-react': 'off', // Not needed with new JSX transform
    'react/react-in-jsx-scope': 'off', // Not needed with new JSX transform
    'react/no-unknown-property': 'off', // Disable unknown property warnings
    'no-undef': 'off', // Disable undefined variable warnings
    'react-refresh/only-export-components': 'off', // Disable fast refresh warnings
  },
}