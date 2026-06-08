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

export const kittenSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  color: z.string().min(1, 'Color is required'),
  ageWeeks: z.coerce.number().int().min(0, 'Age must be 0 or more').max(104, 'Age looks too high'),
  price: z.coerce.number().min(0, 'Price must be 0 or more'),
  gender: z.enum(['Male', 'Female']),
  description: z.string().max(2000).optional().or(z.literal('')),
  mainImageUrl: z.string().url('A main image is required'),
  galleryImages: z.array(z.string().url()).optional().default([]),
  pedigree: z.string().max(2000).optional().or(z.literal('')),
  healthTests: z.string().max(2000).optional().or(z.literal('')),
  status: z.enum(['AVAILABLE', 'RESERVED', 'SOLD']).default('AVAILABLE')
});

export type KittenInput = z.infer<typeof kittenSchema>;
