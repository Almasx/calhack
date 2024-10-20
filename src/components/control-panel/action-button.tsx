import { cva, type VariantProps } from "class-variance-authority";
import { ButtonHTMLAttributes } from "react";

const actionButtonVariants = cva(
  "size-11 rounded-xl flex items-center justify-center duration-150 ease-out",
  {
    variants: {
      variant: {
        default:
          "bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white",
        active: "bg-neutral-700 text-white hover:bg-neutral-600",
        danger: "bg-red-800 text-red-300 hover:bg-red-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface ActionButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof actionButtonVariants> {
  label: string;
  icon: React.ReactNode;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  label,
  icon,
  variant,
  ...props
}) => {
  return (
    <button
      aria-label={label}
      className={actionButtonVariants({ variant })}
      {...props}
    >
      {icon}
    </button>
  );
};
