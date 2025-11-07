export const loadMathQuill = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if ((window as any).MathQuill) {
      resolve();
      return;
    }

    // Load jQuery first (MathQuill dependency)
    const jqueryScript = document.createElement('script');
    jqueryScript.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
    jqueryScript.async = true;
    jqueryScript.onload = () => {
      // After jQuery loads, load MathQuill
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/mathquill@0.10.1/build/mathquill.min.js';
      script.async = true;
      script.onload = () => {
        console.log('MathQuill loaded successfully');
        resolve();
      };
      script.onerror = () => reject(new Error('Failed to load MathQuill'));
      document.head.appendChild(script);
    };
    jqueryScript.onerror = () => reject(new Error('Failed to load jQuery'));
    document.head.appendChild(jqueryScript);

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/mathquill@0.10.1/build/mathquill.min.css';
    document.head.appendChild(link);
  });
};
