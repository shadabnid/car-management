import Image from 'next/image';
import React from 'react';


const Navbar = () => {

    return (
        <>

            <div className='fixed top-0 left-0 w-full flex justify-between items-center py-4 px-8  z-20  bg-[#FAFAFA]'>
                <span className='text-[24px] font-[400] font-libre leading-[29.76px] text-[#2C0F0F]'>
                   
                    Car Management
                </span>
                
            </div>
        </>
    );
};

export default Navbar;

