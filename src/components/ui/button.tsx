import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
const variants = cva('button', {
  variants: { variant: { default: 'button-primary', outline: 'button-outline' } },
  defaultVariants: { variant: 'default' },
});
export function Button({
  asChild = false,
  variant,
  className,
  ...props
}: React.ComponentProps<'button'> & VariantProps<typeof variants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'button';
  return <Comp className={twMerge(clsx(variants({ variant }), className))} {...props} />;
}
