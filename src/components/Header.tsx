import LogoImg from "@/assets/icons/logo.png"
import { menuList } from "../global/config";
import { useMediaQuery } from "react-responsive";
import HamburgerIcon from "@/assets/icons/hamburger.svg"
import { useState } from "react";
import { Drawer } from "@material-tailwind/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from 'next/link'


export default function Header() {

    const router = useRouter();

    const handleHome = () => {
        router.push("/")
    }

    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })
    const [open, setOpen] = useState(false);
    const openDrawer = () => setOpen(true);
    const closeDrawer = () => setOpen(false);


    return (
        <div className="fixed top-0 bg-white z-50 flex flex-row items-center justify-between px-[20px] md:px-[100px] w-full h-[60px] md:h-[80px] shadow-md md:shadow-xl">
            <button className="flex gap-2 flex-row items-center" onClick={() => {
                handleHome()
            }}>
                <Image src={LogoImg} className="w-[30px] h-[30px]" alt="logo" />
                <p className="text-[24px]  text-gray-900 font-[700]">
                    TokenTool.io
                </p>
            </button>
            {
                !isTabletOrMobile &&
                <div className="flex flex-row items-center gap-10 ">
                    {
                        menuList.map((item: any, index: any) => {
                            return <Link key={index}
                                href={item.router}
                                className="flex flex-row items-center gap-2 text-[18px] font-[700] text-gray-600">
                                <Image src={item.icon} alt={item.name} className="w-[30px] h-[30px] rounded-full" />
                                {item.name}
                            </Link>
                        })
                    }
                </div>

            }
            {
                !isTabletOrMobile ?
                    <div></div>
                    :
                    <button onClick={openDrawer}>
                        <Image src={HamburgerIcon} className="w-[20px] h-[20px]" alt="menu" />
                    </button>
            }
            {/* <EvmWalletConnectButton /> */}

            <Drawer open={open} onClose={closeDrawer}
                className="p-4"
                placeholder={""}
                onPointerEnterCapture={() => { }}
                onPointerLeaveCapture={() => { }}>
                <div className="flex flex-col items-start gap-2 px-[20px]">
                    <Link className="text-[18px] font-[500] mt-[60px]" href="/">
                        - Home
                    </Link>
                    <Link className="text-[18px] font-[500]" href="/standard-token">
                        - EVM Token Creator
                    </Link>
                    <Link className="text-[18px] font-[500]" href="/spl-token">
                        - Solana Token Creator
                    </Link>
                    <Link className="text-[18px] font-[500]" href="/">
                        - Fees
                    </Link>
                    <Link className="text-[18px] font-[500]" href="/contact-us">
                        - Contact Us
                    </Link>
                    <Link className="text-[18px] font-[500]" href="" >
                        - X (Twitter)
                    </Link>
                </div>
            </Drawer>
        </div>
    )
}