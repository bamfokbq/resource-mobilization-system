import { Loader2, ArrowRight, UserX } from 'lucide-react';

interface RedirectLoadingScreenProps {
    type: 'login' | 'dashboard';
}

export default function RedirectLoadingScreen({ type }: RedirectLoadingScreenProps) {
    const config = {
        login: {
            icon: UserX,
            title: 'Authentication Required',
            message: 'Redirecting to login page...',
            bgColor: 'from-red-50 to-orange-100',
            iconBg: 'bg-red-100',
            iconColor: 'text-red-600',
            spinnerColor: 'text-red-600'
        },
        dashboard: {
            icon: ArrowRight,
            title: 'Access Restricted',
            message: 'Redirecting to user dashboard...',
            bgColor: 'from-amber-50 to-yellow-100',
            iconBg: 'bg-amber-100',
            iconColor: 'text-amber-600',
            spinnerColor: 'text-amber-600'
        }
    };

    const { icon: Icon, title, message, bgColor, iconBg, iconColor, spinnerColor } = config[type];

    return (
        <div className={`flex flex-col items-center justify-center min-h-screen bg-gradient-to-br ${bgColor}`}>
            <div className="flex flex-col items-center space-y-6 p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
                <div className={`flex items-center justify-center w-16 h-16 ${iconBg} rounded-full`}>
                    <Icon className={`w-8 h-8 ${iconColor}`} />
                </div>
                <div className="flex items-center space-x-3">
                    <Loader2 className={`w-6 h-6 ${spinnerColor} animate-spin`} />
                    <div className="text-center">
                        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
                        <p className="text-gray-600 mt-1">{message}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
