import Link from 'next/link';
import Image from 'next/image';

/**
 * (auth) layout — minimal shell, brand-forward.
 * Two-column on desktop: form on left, brand statement on right.
 * Single column on mobile.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-neutral-50 grid grid-cols-1 lg:grid-cols-2">
      {/* Form column */}
      <div className="flex flex-col">
        <div className="px-6 py-6 md:px-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 group"
            aria-label="ContractorSelect.me home"
          >
            <Image
              src="/logo-monogram.svg"
              alt=""
              width={36}
              height={36}
              className="h-9 w-9"
              priority
            />
            <span className="text-h4 font-display font-semibold text-neutral-900 group-hover:text-primary-900 transition-colors">
              ContractorSelect<span className="text-success-700">.me</span>
            </span>
          </Link>
        </div>
        <div className="flex-1 flex items-center justify-center px-6 pb-12">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>

      {/* Brand column — desktop only */}
      <aside className="hidden lg:flex bg-primary-900 relative overflow-hidden">
        {/* Subtle pattern accent */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
          aria-hidden
        />
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div className="max-w-md">
            {/* Brand monogram (white variant) — visual anchor */}
            <Image
              src="/logo-monogram-white.svg"
              alt=""
              width={56}
              height={56}
              className="h-14 w-14 mb-8"
            />
            <h2 className="text-display-lg font-display font-semibold leading-tight">
              Building trust.
              <br />
              Delivering quality.
            </h2>
            <p className="mt-6 text-body-lg font-sans text-primary-100">
              The high-trust marketplace for verified contractors. Connect, compare,
              choose with confidence.
            </p>
          </div>

          <div className="space-y-4 max-w-md">
            <BrandPillar
              title="Verified contractors"
              description="Every contractor is KYC-verified, insured, and license-checked before joining."
            />
            <BrandPillar
              title="Identity protected"
              description="Your details stay private until you award and pay. Server-enforced, not optional."
            />
            <BrandPillar
              title="Transparent pricing"
              description="Bids show line items, VAT, and platform fees clearly. No surprises at checkout."
            />
          </div>
        </div>
      </aside>
    </div>
  );
}

function BrandPillar({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="border-l-2 border-success-700 pl-4">
      <p className="text-body font-sans font-semibold text-white">{title}</p>
      <p className="text-body-sm font-sans text-primary-100 mt-1">{description}</p>
    </div>
  );
}
