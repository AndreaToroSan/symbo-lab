export const loadMathQuill = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if ((window as any).MathQuill) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/mathquill@0.10.1/build/mathquill.min.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load MathQuill'));
    document.head.appendChild(script);

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/mathquill@0.10.1/build/mathquill.min.css';
    document.head.appendChild(link);
  });
};
