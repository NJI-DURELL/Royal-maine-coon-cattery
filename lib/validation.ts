import { z } from 'zod';

export const verifyFundsSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().min(10, 'Enter a valid phone number'),
  location: z.string().min(2, 'Location is required'),
  country: z.string().min(2, 'Country is required'),
  kittenIds: z.array(z.string()).min(1, 'Select at least one kitten'),
  proofDescription: z.string().max(500).optional(),
  proofAmount: z.number().min(500, 'Minimum available amount is $500'),
  transportationPlan: z.enum(['NANNY', 'PICKUP']),
  deliveryLocation: z.string().optional(),
  hasVet: z.boolean(),
  monthlyBudget: z.number().min(50, 'Minimum monthly budget is $50'),
  housingSituation: z.string().min(20, 'Describe your housing situation'),
  familyApproval: z.boolean().refine((value) => value === true, {
    message: 'Family approval is required'
  }),
  agreementVideoCall: z.boolean().refine((value) => value === true, {
    message: 'You must agree to the video call requirement'
  }),
  agreementDeposit: z.boolean().refine((value) => value === true, {
    message: 'Deposit terms are required'
  }),
  agreementTerms: z.boolean().refine((value) => value === true, {
    message: 'You must agree to the terms and conditions'
  })
});

export const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8).regex(/[A-Z]/, 'Must contain an uppercase letter').regex(/[0-9]/, 'Must contain a number'),
  confirmPassword: z.string().min(8),
  phone: z.string().optional(),
  location: z.string().optional(),
  country: z.string().optional(),
  agreeTerms: z.boolean().refine((value) => value === true, { message: 'Terms must be accepted' })
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords must match',
  path: ['confirmPassword']
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});
