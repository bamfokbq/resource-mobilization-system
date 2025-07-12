'use client';

export default function SurveysTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="animate-in fade-in-0 slide-in-from-bottom-1 duration-300">
      {children}
    </div>
  );
}
