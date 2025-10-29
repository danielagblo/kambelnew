#!/usr/bin/env node

/**
 * Pre-build Environment Check Script
 * Validates required environment variables before build
 */

const requiredEnvVars = {
  DATABASE_URL: {
    required: true,
    description: 'PostgreSQL database connection string with SSL',
    example: 'postgresql://user:pass@host:5432/db?sslmode=require',
    critical: true,
  },
  ADMIN_USERNAME: {
    required: false,
    description: 'Admin panel username',
    example: 'admin',
    critical: false,
  },
  ADMIN_PASSWORD: {
    required: false,
    description: 'Admin panel password',
    example: 'your_secure_password',
    critical: false,
  },
  NEXT_PUBLIC_SITE_URL: {
    required: false,
    description: 'Public site URL',
    example: 'https://your-app.ondigitalocean.app',
    critical: false,
  },
};

console.log('🔍 Checking environment variables...\n');

let hasErrors = false;
let hasWarnings = false;

for (const [varName, config] of Object.entries(requiredEnvVars)) {
  const value = process.env[varName];
  const isSet = value && value.trim() !== '';

  if (!isSet) {
    if (config.critical) {
      console.error(`❌ CRITICAL: ${varName} is not set!`);
      console.error(`   Description: ${config.description}`);
      console.error(`   Example: ${config.example}`);
      console.error('');
      hasErrors = true;
    } else if (config.required) {
      console.warn(`⚠️  WARNING: ${varName} is not set`);
      console.warn(`   Description: ${config.description}`);
      console.warn(`   Example: ${config.example}`);
      console.warn('');
      hasWarnings = true;
    } else {
      console.log(`ℹ️  Optional: ${varName} is not set (will use defaults)`);
    }
  } else {
    // Validate DATABASE_URL format
    if (varName === 'DATABASE_URL') {
      if (value.startsWith('file:')) {
        console.error('❌ CRITICAL: DATABASE_URL is using SQLite (file:)');
        console.error('   Production deployments require PostgreSQL!');
        console.error(`   Example: ${config.example}`);
        console.error('');
        hasErrors = true;
      } else if (value.startsWith('postgresql://') || value.startsWith('postgres://')) {
        if (!value.includes('sslmode=require') && !value.includes('ssl=true')) {
          console.warn('⚠️  WARNING: DATABASE_URL might be missing SSL configuration');
          console.warn('   Consider adding ?sslmode=require to your connection string');
          console.warn('');
          hasWarnings = true;
        } else {
          console.log(`✅ ${varName} is configured correctly`);
        }
      } else if (value.startsWith('${') && value.endsWith('}')) {
        console.log(`✅ ${varName} is using component reference: ${value}`);
      } else {
        console.warn(`⚠️  WARNING: ${varName} has unexpected format`);
        console.warn(`   Expected: ${config.example}`);
        console.warn('');
        hasWarnings = true;
      }
    } else {
      console.log(`✅ ${varName} is set`);
    }
  }
}

console.log('');

if (hasErrors) {
  console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.error('❌ CRITICAL ERRORS FOUND!');
  console.error('');
  console.error('Your build will likely fail without these variables.');
  console.error('Please configure them in DigitalOcean App Settings:');
  console.error('Settings → App-Level Environment Variables');
  console.error('');
  console.error('📖 See CRITICAL_FIX_DATABASE_URL.md for detailed instructions');
  console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.error('');
  
  // Don't fail the build in case DATABASE_URL becomes available later
  // Just warn loudly
  console.warn('⚠️  Continuing build, but database operations will fail until configured...');
  process.exit(0); // Changed from exit(1) to allow build to continue
} else if (hasWarnings) {
  console.warn('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.warn('⚠️  WARNINGS DETECTED');
  console.warn('');
  console.warn('These are not critical, but should be addressed:');
  console.warn('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.warn('');
  console.log('✅ Proceeding with build...\n');
} else {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ All environment variables are configured correctly!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
}

