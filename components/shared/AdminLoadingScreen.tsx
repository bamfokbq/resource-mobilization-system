import { Loader2, Shield } from 'lucide-react';

export default function AdminLoadingScreen() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="flex flex-col items-center space-y-6 p-8 bg-white rounded-2xl shadow-lg border border-blue-100">
                <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full">
                    <Shield className="w-8 h-8 text-blue-600" />
                </div>
                <div className="flex items-center space-x-3">
                    <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                    <div className="text-center">
                        <h2 className="text-xl font-semibold text-gray-800">Verifying Access</h2>
                        <p className="text-gray-600 mt-1">Checking admin permissions...</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
