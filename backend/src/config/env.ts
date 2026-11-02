import dotenv from 'dotenv';
import { z } from 'zod';

// Load local .env if present
dotenv.config();

/**
 * Zod schema for backend environment configuration.
 * Validates types, ranges, production constraints, and security requirements.
 */
export const envSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z
      .union([z.string(), z.number()])
      .default(5000)
      .transform((val, ctx) => {
        const parsed = typeof val === 'number' ? val : parseInt(val, 10);
        if (isNaN(parsed) || parsed < 1 || parsed > 65535) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'PORT must be a valid integer between 1 and 65535',
          });
          return z.NEVER;
        }
        return parsed;
      }),
    MONGODB_URI: z
      .string()
      .optional()
      .refine(
        (val) => !val || val.startsWith('mongodb://') || val.startsWith('mongodb+srv://'),
        { message: 'MONGODB_URI must start with mongodb:// or mongodb+srv://' }
      ),
    FRONTEND_URL: z.string().url('FRONTEND_URL must be a valid URL').optional(),
    JWT_SECRET: z.string().optional(),
    OMNIDIMENSION_API_KEY: z.string().min(1, 'OMNIDIMENSION_API_KEY cannot be empty').optional(),
    OMNIDIMENSION_BASE_URL: z.string().url('OMNIDIMENSION_BASE_URL must be a valid URL').optional(),
    OMNIDIMENSION_AGENT_ID: z.string().min(1, 'OMNIDIMENSION_AGENT_ID cannot be empty').optional(),
    OMNIDIMENSION_WEBHOOK_SECRET: z.string().min(1, 'OMNIDIMENSION_WEBHOOK_SECRET cannot be empty').optional(),
  })
  .superRefine((data, ctx) => {
    // Validate JWT secret strength when authentication is enabled (JWT_SECRET provided)
    if (data.JWT_SECRET) {
      if (data.JWT_SECRET.length < 32) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['JWT_SECRET'],
          message: 'JWT_SECRET must be at least 32 characters long for cryptographic security',
        });
      }
      const weakSecrets = ['secret', 'changeme', 'jwt_secret', '12345678901234567890123456789012'];
      if (weakSecrets.includes(data.JWT_SECRET.toLowerCase())) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['JWT_SECRET'],
          message: 'JWT_SECRET is using an insecure well-known placeholder value',
        });
      }
    }

    // Fail safely when required production configuration is missing
    if (data.NODE_ENV === 'production') {
      if (!data.FRONTEND_URL) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['FRONTEND_URL'],
          message: 'FRONTEND_URL is required in production environment',
        });
      }
    }
  });

export type EnvConfig = z.infer<typeof envSchema>;

/**
 * Validates raw environment variable object against the Zod schema.
 * Throws a clean, safe Error without leaking secret values.
 */
export const validateEnv = (rawEnv: Record<string, unknown> = process.env): EnvConfig => {
  const result = envSchema.safeParse(rawEnv);
  if (!result.success) {
    const errorDetails = result.error.issues
      .map((err) => `  - ${err.path.join('.') || 'root'}: ${err.message}`)
      .join('\n');
    throw new Error(`Environment validation failed:\n${errorDetails}`);
  }
  return result.data;
};

/**
 * Singleton configuration object parsed from process.env.
 */
export const config: EnvConfig = (() => {
  if (process.env.NODE_ENV === 'test') {
    const result = envSchema.safeParse(process.env);
    if (result.success) return result.data;
    return {
      NODE_ENV: 'test',
      PORT: 5000,
    } as EnvConfig;
  }
  return validateEnv(process.env);
})();

export default config;
