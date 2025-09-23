'use client';

interface SectionHeaderProps {
  title: string;
  badgeCount?: number;
  badgeText?: string;
}

export function SectionHeader({ title, badgeCount, badgeText }: SectionHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold text-gray-800">
        {title}
      </h2>
      {(badgeCount !== undefined || badgeText) && (
        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
          {badgeText || `${badgeCount} ${badgeCount === 1 ? 'item' : 'items'}`}
        </span>
      )}
    </div>
  );
}