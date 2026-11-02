import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { validateEnv, envSchema } from '../src/config/env';

describe('Environment Configuration Validation (Zod)', () => {
  const strongSecret = 'a-very-secure-jwt-secret-with-at-least-32-characters!';

  describe('Default and Minimum Configuration', () => {
    it('should validate with minimal default values', () => {
      const config = validateEnv({});
      assert.equal(config.NODE_ENV, 'development');
      assert.equal(config.PORT, 5000);
      assert.equal(config.MONGODB_URI, undefined);
      assert.equal(config.FRONTEND_URL, undefined);
      assert.equal(config.JWT_SECRET, undefined);
      assert.equal(config.OMNIDIMENSION_API_KEY, undefined);
    });

    it('should coerce PORT from valid string to number', () => {
      const config = validateEnv({ PORT: '8080' });
      assert.equal(config.PORT, 8080);
    });

    it('should allow valid numeric PORT', () => {
      const config = validateEnv({ PORT: 3000 });
      assert.equal(config.PORT, 3000);
    });
  });

  describe('Invalid NODE_ENV and PORT', () => {
    it('should throw error for invalid NODE_ENV', () => {
      assert.throws(
        () => validateEnv({ NODE_ENV: 'staging' }),
        /NODE_ENV/
      );
    });

    it('should throw error for non-numeric PORT', () => {
      assert.throws(
        () => validateEnv({ PORT: 'invalid-port' }),
        /PORT/
      );
    });

    it('should throw error for out-of-range PORT (< 1)', () => {
      assert.throws(
        () => validateEnv({ PORT: '0' }),
        /PORT/
      );
    });

    it('should throw error for out-of-range PORT (> 65535)', () => {
      assert.throws(
        () => validateEnv({ PORT: '70000' }),
        /PORT/
      );
    });
  });

  describe('Optional MONGODB_URI Validation', () => {
    it('should accept valid mongodb:// connection string', () => {
      const config = validateEnv({ MONGODB_URI: 'mongodb://localhost:27017/jusbid_test' });
      assert.equal(config.MONGODB_URI, 'mongodb://localhost:27017/jusbid_test');
    });

    it('should accept valid mongodb+srv:// connection string', () => {
      const config = validateEnv({ MONGODB_URI: 'mongodb+srv://cluster.example.com/jusbid' });
      assert.equal(config.MONGODB_URI, 'mongodb+srv://cluster.example.com/jusbid');
    });

    it('should reject invalid protocol for MONGODB_URI', () => {
      assert.throws(
        () => validateEnv({ MONGODB_URI: 'http://localhost:27017/jusbid' }),
        /MONGODB_URI/
      );
    });

    it('should start without MONGODB_URI (optional in this phase)', () => {
      const config = validateEnv({});
      assert.equal(config.MONGODB_URI, undefined);
    });
  });

  describe('Optional FRONTEND_URL Validation', () => {
    it('should accept valid URL for FRONTEND_URL', () => {
      const config = validateEnv({ FRONTEND_URL: 'http://localhost:5173' });
      assert.equal(config.FRONTEND_URL, 'http://localhost:5173');
    });

    it('should reject invalid URL string for FRONTEND_URL', () => {
      assert.throws(
        () => validateEnv({ FRONTEND_URL: 'not-a-valid-url' }),
        /FRONTEND_URL/
      );
    });
  });

  describe('JWT Secret Strength Validation', () => {
    it('should accept strong JWT_SECRET (>= 32 characters)', () => {
      const config = validateEnv({ JWT_SECRET: strongSecret });
      assert.equal(config.JWT_SECRET, strongSecret);
    });

    it('should reject short JWT_SECRET (< 32 characters)', () => {
      assert.throws(
        () => validateEnv({ JWT_SECRET: 'short-secret-123' }),
        /at least 32 characters long/
      );
    });

    it('should reject known insecure weak secret placeholders', () => {
      assert.throws(
        () => validateEnv({ JWT_SECRET: '12345678901234567890123456789012' }),
        /insecure well-known placeholder value/
      );
    });

    it('should allow omitting JWT_SECRET when auth is not configured', () => {
      const config = validateEnv({});
      assert.equal(config.JWT_SECRET, undefined);
    });
  });

  describe('OmniDimension Credentials (Optional Startup)', () => {
    it('should start without OmniDimension credentials', () => {
      const config = validateEnv({});
      assert.equal(config.OMNIDIMENSION_API_KEY, undefined);
      assert.equal(config.OMNIDIMENSION_BASE_URL, undefined);
      assert.equal(config.OMNIDIMENSION_AGENT_ID, undefined);
      assert.equal(config.OMNIDIMENSION_WEBHOOK_SECRET, undefined);
    });

    it('should validate valid OmniDimension configurations when provided', () => {
      const config = validateEnv({
        OMNIDIMENSION_API_KEY: 'test-api-key',
        OMNIDIMENSION_BASE_URL: 'https://api.omnidimension.ai/v1',
        OMNIDIMENSION_AGENT_ID: 'agent_123',
        OMNIDIMENSION_WEBHOOK_SECRET: 'whsec_test',
      });
      assert.equal(config.OMNIDIMENSION_API_KEY, 'test-api-key');
      assert.equal(config.OMNIDIMENSION_BASE_URL, 'https://api.omnidimension.ai/v1');
      assert.equal(config.OMNIDIMENSION_AGENT_ID, 'agent_123');
      assert.equal(config.OMNIDIMENSION_WEBHOOK_SECRET, 'whsec_test');
    });

    it('should reject invalid OMNIDIMENSION_BASE_URL', () => {
      assert.throws(
        () => validateEnv({ OMNIDIMENSION_BASE_URL: 'invalid-url' }),
        /OMNIDIMENSION_BASE_URL/
      );
    });
  });

  describe('Production Fail-Safe Requirements', () => {
    it('should fail safely in production if FRONTEND_URL is missing', () => {
      assert.throws(
        () => validateEnv({ NODE_ENV: 'production' }),
        /FRONTEND_URL is required in production environment/
      );
    });

    it('should succeed in production when required settings are present', () => {
      const config = validateEnv({
        NODE_ENV: 'production',
        FRONTEND_URL: 'https://app.jusbid.in',
        JWT_SECRET: strongSecret,
      });
      assert.equal(config.NODE_ENV, 'production');
      assert.equal(config.FRONTEND_URL, 'https://app.jusbid.in');
      assert.equal(config.JWT_SECRET, strongSecret);
    });
  });
});

