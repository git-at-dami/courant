import { UserSection } from "../sections/user-section";


interface UserViewProps {
    userId?: string;
};

export const UserView = ({ userId }: UserViewProps) => {
    return (
        <div className="flex flex-col max-w-[1300px] mx-auto pt-2.5 px-4 mb-10 gap-y-6">
            <UserSection userId={userId} />
        </div>
    )
};