"use client"
import React, { useState } from 'react'
import { AdminSidebarMenu } from '@/utils/config'
import { usePathname } from 'next/navigation';
import { useRouter } from "next/navigation";
import Link from 'next/link'
import withAuth from '@/app/(product)/_components/WithAuth';


const Sidebar = () => {
    const [role, setRole] = useState('superadmin');
    const pathname = usePathname();
    const pathSegments = pathname.split('/').filter(Boolean);
    const basePath = `/${pathSegments.slice(0, 2).join('/')}`

    const router = useRouter(); 

    const handleLogout = async () => {
        try {
         
          const response = await fetch("/api/logout", {
            method: "GET",
          });
    
          const data = await response.json();
          if (data.status === 200) {
            
            router.push("/");
          } else {
            alert(data.message);
          }
        } catch (error) {
          console.error("Error during logout:", error);
          alert("An error occurred while logging out.");
        }
      };

    return (
        <div className='w-[201px] h-[510px] bg-sidebarBg rounded-[10px] relative'>
            <ul>
                {
                    AdminSidebarMenu.filter(menuItem => menuItem.roles.includes(role)).map((menuItem, index) => (
                        <li
                            key={index}
                            className={`text-white font-roboto font-[400px] text-[16px] leading-[18.39px] border-b-[1px] border-[#2E2E2E] px-[10px] py-[10px] `}
                        >
                            <Link href={menuItem.href}>
                                <div className='group'>


                                    <div className={`flex gap-2 group-hover:bg-white transition-all duration-300 ease-in-out pl-[15px] py-[8px] rounded-[30px] ${basePath === menuItem.href ? 'bg-white text-black' : ''}`}>


                                        <span className='cursor-pointer group-hover:text-black'>{menuItem.name}</span>
                                    </div>
                                </div>
                            </Link>


                        </li>
                    ))
                }
            </ul>
            <button
                onClick={handleLogout}
                className="text-white absolute bottom-[30px] hover:bg-white hover:text-black py-[8px] rounded-[30px] w-full"
            >
                Log out
            </button>
        </div>
    )
}

export default withAuth(Sidebar);
