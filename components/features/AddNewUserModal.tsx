"use client"

import { Button } from "@/components/ui/button"
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { AddNewUserForm } from '../forms/AddNewUserForm'
import { FiUserPlus } from 'react-icons/fi'
import { useState } from 'react'

export function AddNewUserModal() {
    const [open, setOpen] = useState(false)

    const handleSuccess = () => {
        // Close drawer after successful user creation
        setOpen(false)
    }

    return (<Drawer open={open} onOpenChange={setOpen} direction="right">
        <DrawerTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-xl px-6 py-3 font-medium flex items-center gap-3 group">
                <div className="p-1 rounded-lg bg-white/20 group-hover:bg-white/30 transition-colors duration-300">
                    <FiUserPlus className="h-4 w-4" />
                </div>
                <span>Add New User</span>
            </Button>
        </DrawerTrigger>
        <DrawerContent className="h-full w-[800px] max-w-[95vw] bg-gradient-to-br from-slate-50/95 to-blue-50/95 backdrop-blur-xl border-blue-200/50 rounded-l-2xl">
            <DrawerHeader className="
                    bg-gradient-to-r from-blue-600 to-purple-600 
                    text-white px-8 py-6
                    relative overflow-hidden rounded-tl-2xl
                ">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0 bg-white/10 bg-opacity-10 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:20px_20px]"></div>
                </div>

                <div className="relative flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
                        <FiUserPlus className="h-6 w-6" />
                    </div>
                    <div>
                        <DrawerTitle className="text-2xl font-bold text-white mb-2">
                            Add New User
                        </DrawerTitle>
                        <DrawerDescription className="text-blue-100 text-base">
                            Create a new user account with the information below
                        </DrawerDescription>
                    </div>
                </div>
            </DrawerHeader>

            <div className="px-8 py-6 overflow-y-auto flex-1">
                <AddNewUserForm onSuccess={handleSuccess} />
            </div>
        </DrawerContent>
    </Drawer>
    )
}
