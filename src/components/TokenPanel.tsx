"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";



export default function TokenPanel(props: any) {
    const { title, info, icon, router } = props;
    const navigate = useRouter();


    const handleToken = () => {
        navigate.push(router)
    }

    return (
        <div className="w-full md:w-[800px] flex flex-col items-start p-[20px] border-[1px] rounded-xl cursor-pointer mt-[20px] bg-white focus:cursor-pointer" onClick={handleToken}>
            <p className="w-full text-[20px] md:text-[24px] font-[700] text-center">
                {title}
            </p>
            <div className="flex flex-col items-center w-full">
                <div className="flex flex-wrap w-full  justify-center items-center gap-2 mt-[20px]">
                    {
                        icon.map((item: any, index: number) => {
                            return (
                                <Image src={item} key={index} alt={item} className="w-[30px] h-[30px] md:w-[40px] md:h-[40px] rounded-full" />
                            )
                        })
                    }
                </div>
            </div>
            <p className="text-[14px] md:text-[18px] font-[500] text-gray-500 text-start mt-[20px]">
                {info}
            </p>

            {/* <div className="flex flex-wrap items-center gap-2 mt-[20px]">
                {
                    utils.map((item: any, index: any) => {
                        return <div key={index} className="border-[1px] rounded-full border-blue-600 text-blue-600 p-[2px_6px] text-[12px]  md:p-[4px_10px] ">
                            {item}
                        </div>
                    })
                }
            </div> */}
        </div>
    )
}