"use client";

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { getAiCakeSuggestion } from '@/lib/actions';
import { Wand2, Loader2 } from 'lucide-react';

interface AiSuggestionProps {
  getValues: () => { occasion: string; category: string };
}

export default function AiSuggestion({ getValues }: AiSuggestionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestion, setSuggestion] = useState('');
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSuggestion = () => {
    const { occasion, category } = getValues();
    if (!category) {
        setError("Please select a cake category first to get a suggestion.");
        setIsOpen(true);
        return;
    }
    
    setError('');
    setSuggestion('');
    setIsOpen(true);
    startTransition(async () => {
      // Pass the form's "occasion" as the "message" for the AI
      const result = await getAiCakeSuggestion(occasion, category);
      if (result.error) {
        setError(result.error);
      } else {
        setSuggestion(result.suggestion || '');
      }
    });
  };

  return (
    <>
      <Button type="button" size="sm" variant="outline" onClick={handleSuggestion} className="bg-background hover:bg-accent">
        <Wand2 className="mr-2 h-4 w-4" />
        Get AI Suggestion
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wand2 className="h-5 w-5 text-primary"/> AI Cake Suggestion
            </DialogTitle>
            <DialogDescription>
              Here's a little inspiration for your special occasion!
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {isPending && (
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Thinking of the perfect cake...</span>
              </div>
            )}
            {error && <p className="text-destructive">{error}</p>}
            {suggestion && <p className="text-foreground">{suggestion}</p>}
          </div>
           <DialogFooter>
                <Button onClick={() => setIsOpen(false)}>Close</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
