'use client';

interface UserTableLoadingProps {
    rows?: number;
}

export function UserTableLoading({ rows = 5 }: UserTableLoadingProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="h-8 w-64 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-8 w-32 bg-gray-200 animate-pulse rounded"></div>
            </div>
            <div className="space-y-3">
                {[...Array(rows)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-100 animate-pulse rounded-lg"></div>
                ))}
            </div>
        </div>
    );
}
