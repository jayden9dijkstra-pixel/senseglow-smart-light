interface IconProps {
  className?: string;
}

const wrap = "h-7 w-auto text-foreground/40";

const Frame = ({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <svg
    viewBox="0 0 60 32"
    role="img"
    aria-label={label}
    className={className ?? wrap}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>{label}</title>
    <rect
      x="0.6"
      y="0.6"
      width="58.8"
      height="30.8"
      rx="5"
      stroke="currentColor"
      strokeOpacity="0.35"
    />
    {children}
  </svg>
);

const label = (text: string, size = 10, y = 20) => (
  <text
    x="30"
    y={y}
    textAnchor="middle"
    fontFamily="system-ui, -apple-system, sans-serif"
    fontSize={size}
    fontWeight="600"
    letterSpacing="0.5"
    fill="currentColor"
  >
    {text}
  </text>
);

export const IdealIcon = ({ className }: IconProps) => (
  <Frame label="iDEAL" className={className}>
    {label("iDEAL", 11)}
  </Frame>
);

export const BancontactIcon = ({ className }: IconProps) => (
  <Frame label="Bancontact" className={className}>
    {label("Bancontact", 7.5, 19)}
  </Frame>
);

export const MastercardIcon = ({ className }: IconProps) => (
  <Frame label="Mastercard" className={className}>
    <circle cx="25" cy="16" r="7.5" stroke="currentColor" strokeWidth="1.4" />
    <circle cx="35" cy="16" r="7.5" stroke="currentColor" strokeWidth="1.4" />
  </Frame>
);

export const VisaIcon = ({ className }: IconProps) => (
  <Frame label="Visa" className={className}>
    {label("VISA", 12, 21)}
  </Frame>
);

export const PaypalIcon = ({ className }: IconProps) => (
  <Frame label="PayPal" className={className}>
    {label("PayPal", 10.5, 20)}
  </Frame>
);

export const KlarnaIcon = ({ className }: IconProps) => (
  <Frame label="Klarna" className={className}>
    {label("Klarna", 10.5, 20)}
  </Frame>
);

export const ApplePayIcon = ({ className }: IconProps) => (
  <Frame label="Apple Pay" className={className}>
    <path
      d="M20.6 11.6c.5-.6.8-1.4.7-2.2-.7 0-1.6.5-2.1 1.1-.5.5-.9 1.4-.7 2.2.8.05 1.6-.4 2.1-1.1Zm.7 1.3c-1.2-.07-2.2.66-2.7.66-.6 0-1.4-.62-2.3-.6-1.2.02-2.3.7-2.9 1.77-1.2 2.15-.3 5.34.9 7.09.6.86 1.3 1.82 2.2 1.79.9-.04 1.2-.58 2.3-.58s1.4.58 2.3.56c1-.02 1.6-.87 2.2-1.73.7-.99.98-1.95 1-2-.02-.02-1.9-.74-1.92-2.92-.02-1.82 1.47-2.69 1.54-2.74-.84-1.25-2.16-1.39-2.62-1.42Z"
      fill="currentColor"
    />
    <text
      x="42"
      y="21"
      textAnchor="middle"
      fontFamily="system-ui, -apple-system, sans-serif"
      fontSize="10"
      fontWeight="600"
      fill="currentColor"
    >
      Pay
    </text>
  </Frame>
);

export const GooglePayIcon = ({ className }: IconProps) => (
  <Frame label="Google Pay" className={className}>
    {label("G Pay", 10.5, 20)}
  </Frame>
);

export const paymentMethods = [
  { name: "iDEAL", Icon: IdealIcon },
  { name: "Bancontact", Icon: BancontactIcon },
  { name: "Mastercard", Icon: MastercardIcon },
  { name: "Visa", Icon: VisaIcon },
  { name: "PayPal", Icon: PaypalIcon },
  { name: "Klarna", Icon: KlarnaIcon },
  { name: "Apple Pay", Icon: ApplePayIcon },
  { name: "Google Pay", Icon: GooglePayIcon },
];
