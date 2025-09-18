'use client';

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { type DialogState } from './types';

interface ResetPasswordDialogProps {
    dialog: DialogState;
    onClose: () => void;
    onConfirm: () => void;
    isLoading: boolean;
}

export function ResetPasswordDialog({ 
    dialog, 
    onClose, 
    onConfirm, 
    isLoading 
}: ResetPasswordDialogProps) {
    return (
        <Dialog open={dialog.open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Reset Password</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to reset the password for <strong>{dialog.user?.name}</strong>?
                        <br />
                        <span className="text-sm text-muted-foreground mt-2 block">
                            The password will be reset to the default: <code className="bg-gray-100 px-1 rounded">rms@2025</code>
                        </span>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="bg-orange-600 hover:bg-orange-700"
                    >
                        {isLoading ? "Resetting..." : "Reset Password"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

interface ToggleStatusDialogProps {
    dialog: DialogState;
    onClose: () => void;
    onConfirm: () => void;
    isLoading: boolean;
}

export function ToggleStatusDialog({ 
    dialog, 
    onClose, 
    onConfirm, 
    isLoading 
}: ToggleStatusDialogProps) {
    const isActive = dialog.user?.isActive;
    
    return (
        <Dialog open={dialog.open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {isActive ? 'Deactivate' : 'Activate'} User
                    </DialogTitle>
                    <DialogDescription>
                        Are you sure you want to {isActive ? 'deactivate' : 'activate'} <strong>{dialog.user?.name}</strong>?
                        <br />
                        <span className="text-sm text-muted-foreground mt-2 block">
                            {isActive
                                ? 'This will prevent the user from logging in.'
                                : 'This will allow the user to log in again.'
                            }
                        </span>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={onConfirm}
                        disabled={isLoading}
                        variant={isActive ? "destructive" : "default"}
                    >
                        {isLoading
                            ? (isActive ? "Deactivating..." : "Activating...")
                            : (isActive ? "Deactivate" : "Activate")
                        }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
