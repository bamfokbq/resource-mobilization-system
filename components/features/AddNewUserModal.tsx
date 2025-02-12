import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { FaPlus } from 'react-icons/fa6'
import { AddNewUserForm } from '../forms/AddNewUserForm'

export function AddNewUserModal() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className='bg-navy-blue hover:bg-blue-600 cursor-pointer'>
                    <FaPlus />
                    <span>Add New User</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Fill User Information</DialogTitle>
                    <DialogDescription>
                        Please fill in the information below to create a new user.
                    </DialogDescription>
                </DialogHeader>
                <AddNewUserForm />
                {/* <DialogFooter>
                    <Button type="submit">Save changes</Button>
                </DialogFooter> */}
            </DialogContent>
        </Dialog>
    )
}
