"use client";

import { useFormStatus } from "react-dom";

type FormSubmitButtonProps = {
  idleLabel: string;
  pendingLabel?: string;
  className?: string;
};

export function FormSubmitButton({
  idleLabel,
  pendingLabel = "Loading...",
  className
}: FormSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className={className} disabled={pending}>
      {pending ? pendingLabel : idleLabel}
    </button>
  );
}
