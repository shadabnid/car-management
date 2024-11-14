import React from 'react'
import Sidebar from './_components/Sidebar'

const layout = ({ children }) => {
    return (
        <div className="flex gap-10 mt-[60px]">

            <div className="fixed top-[70px] left-[30px] w-[201px] h-full">
                <Sidebar />
            </div>

            <div className="ml-[250px] mt-5 w-full overflow-y-auto">
                {children}
            </div>
        </div>

    )
}

export default layout
