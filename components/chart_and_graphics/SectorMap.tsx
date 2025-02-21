"use client";

import dynamic from 'next/dynamic';

const RegionalSectorMap = dynamic(
  () => import('./RegionalSectorMap'),
  { ssr: false }
);

type SectorMapProps = {
  regionalData: {
    [region: string]: {
      total: number;
      [key: string]: any;
    };
  };
};

export default function SectorMap({ regionalData }: SectorMapProps) {
  return (
    <div className="h-full w-full">
      <RegionalSectorMap regionalData={regionalData} />
    </div>
  );
}

