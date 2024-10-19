import {FaUser} from "react-icons/fa";
import React from "react";
import Link from 'next/link'

interface IProps {
    participantName: string
}

const Navigation = ({ participantName }: IProps) => (

    <nav className="bg-indigo-600 p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
            <div className="text-white text-2xl font-bold">
                <Link href="/">Quiz Platform</Link>
            </div>
            <div className="flex items-center space-x-6">
                <div className="flex items-center text-white">
                    <FaUser size={24} className="mr-2" />
                    <span className="font-medium">{participantName}</span>
                </div>
            </div>
        </div>
    </nav>
);

export default Navigation;