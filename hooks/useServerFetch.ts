import { useState, useEffect, useTransition, useRef } from "react";

type Fetcher<TResult> = () => Promise<TResult>;

export function useServerFetch<TResult>(
  fetcher: Fetcher<TResult>,
  onFinished: ((result: TResult) => void) | null = null
) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<TResult | null>(null);
  const [finished, setFinished] = useState(false);
  const resolver = useRef<((value: TResult) => void) | null>(null);

  const resetState = () => {
    setResult(null);
    setFinished(false);
  };

  useEffect(() => {
    if (finished) {
      if (onFinished) {
        onFinished(result!);
      }
      resolver.current?.(result!);
      resetState(); // Reset the state after the fetch operation finishes
    }
  }, [finished, onFinished, result]);

  const fetchData = async () => {
    startTransition(async () => {
      const data = await fetcher();
      setResult(data);
      setFinished(true);
    });

    return new Promise<TResult>((resolve, reject) => {
      resolver.current = resolve;
    });
  };

  return [fetchData, isPending, result] as const;
}
