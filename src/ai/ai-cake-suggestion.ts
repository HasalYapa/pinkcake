'use server';

/**
 * @fileOverview AI-powered cake suggestion flow.
 *
 * This file defines a Genkit flow that suggests cakes to users based on their
 * selections, providing a tailored experience. It exports:
 * - `suggestCake`: The main function to trigger the cake suggestion flow.
 * - `SuggestCakeInput`: The input type for the `suggestCake` function.
 * - `SuggestCakeOutput`: The output type for the `suggestCake` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestCakeInputSchema = z.object({
  category: z.string().describe('The category of cake the user is interested in (e.g., Birthday, Wedding).'),
  message: z.string().describe('The message the user wants to add on the cake. This can give a hint about the occasion.').optional(),
});
export type SuggestCakeInput = z.infer<typeof SuggestCakeInputSchema>;

const SuggestCakeOutputSchema = z.object({
  suggestion: z.string().describe('A suggested cake based on the user input.'),
  reason: z.string().describe('The reason for the suggested cake.'),
});
export type SuggestCakeOutput = z.infer<typeof SuggestCakeOutputSchema>;

export async function suggestCake(input: SuggestCakeInput): Promise<SuggestCakeOutput> {
  const {output} = await suggestCakeFlow(input);
  if (!output) {
    throw new Error('AI failed to generate a suggestion.');
  }
  return output;
}

const suggestCakePrompt = ai.definePrompt({
  name: 'suggestCakePrompt',
  input: {schema: SuggestCakeInputSchema},
  output: {schema: SuggestCakeOutputSchema},
  prompt: `Based on the user's cake preferences, suggest a specific cake and reason for the suggestion.\n\nCake Category: {{{category}}}\nMessage on Cake (for occasion context): {{{message}}}\n\nSuggestion:`
});

const suggestCakeFlow = ai.defineFlow(
  {
    name: 'suggestCakeFlow',
    inputSchema: SuggestCakeInputSchema,
    outputSchema: SuggestCakeOutputSchema,
  },
  async input => {
    const {output} = await suggestCakePrompt(input);
    return output!;
  }
);
