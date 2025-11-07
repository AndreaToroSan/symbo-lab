-- Create table for saved functions
CREATE TABLE public.saved_functions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  function_text TEXT NOT NULL,
  module TEXT NOT NULL CHECK (module IN ('3d-visualization', 'derivatives', 'optimization', 'integrals', 'domain-limits')),
  parameters JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.saved_functions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own saved functions"
  ON public.saved_functions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved functions"
  ON public.saved_functions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own saved functions"
  ON public.saved_functions
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved functions"
  ON public.saved_functions
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_saved_functions_updated_at
  BEFORE UPDATE ON public.saved_functions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();