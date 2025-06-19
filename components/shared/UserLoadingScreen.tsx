import { Loader2, User } from 'lucide-react';

export default function UserLoadingScreen() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
            <div className="flex flex-col items-center space-y-6 p-8 bg-white rounded-2xl shadow-lg border border-green-100">
                <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
                    <User className="w-8 h-8 text-green-600" />
                </div>
                <div className="flex items-center space-x-3">
                    <Loader2 className="w-6 h-6 text-green-600 animate-spin" />
                    <div className="text-center">
                        <h2 className="text-xl font-semibold text-gray-800">Verifying Access</h2>
                        <p className="text-gray-600 mt-1">Checking user permissions...</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
