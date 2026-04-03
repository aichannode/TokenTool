import LogoImg from "@/assets/icons/logo.png"
import { menuList } from "../global/config";
import { useMediaQuery } from "react-responsive";
import HamburgerIcon from "@/assets/icons/hamburger.svg"
import { useState } from "react";
import { Drawer, } from "@material-tailwind/react";
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
        <div className="neon-header fixed top-0 z-50 flex flex-row items-center justify-between px-[20px] md:px-[100px] w-full h-[60px] md:h-[80px] backdrop-blur-lg">
            <div className="flex gap-2 flex-row items-center hover:cursor-pointer" onClick={() => {
                handleHome()
            }}>
                <Image src={LogoImg} className="w-[30px] h-[30px]" alt="logo" />
                <p className="text-[24px] font-[700] neon-text-gradient">
                    TokenTool.io
                </p>
            </div>
            {
                !isTabletOrMobile &&
                <div className="flex flex-row items-center gap-10 ">
                    {
                        menuList.map((item: any, index: any) => {
                            return <Link key={index}
                                href={item.router}
                                className="flex flex-row items-center gap-2 text-[18px] font-[700] text-slate-500 hover:text-teal-300/95 transition-all duration-200 hover:drop-shadow-[0_0_10px_rgba(45,212,191,0.35)]">
                                {item.icon != "" && <Image src={item.icon} alt={item.name} className="w-[30px] h-[30px] rounded-full" />}
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
                    <div className="focus:cursor-pointer" onClick={openDrawer}>
                        <Image src={HamburgerIcon} className="w-[20px] h-[20px] opacity-90 invert" alt="menu" />
                    </div>
            }
            {/* <EvmWalletConnectButton /> */}

            <Drawer open={open} onClose={closeDrawer}
                className="p-4 neon-drawer-panel"
                placeholder={""}
                onPointerEnterCapture={null}
                onPointerLeaveCapture={null}>
                <div className="flex flex-col items-start gap-2 px-[20px] text-slate-400">
                    <button className="text-[18px] font-[500] mt-[60px] text-left hover:text-teal-300" onClick={() => {
                        router.push("/")
                        closeDrawer();
                    }}>
                        - Home
                    </button>
                    <button className="text-[18px] font-[500] text-left hover:text-teal-300" onClick={() => {
                        router.push("/standard-token");
                        closeDrawer();
                    }}>
                        - EVM Token Creator
                    </button>
                    <button className="text-[18px] font-[500] text-left hover:text-teal-300" onClick={() => {
                        router.push("/spl-token");
                        closeDrawer();
                    }}>
                        - Solana Token Creator
                    </button>
                    <button className="text-[18px] font-[500] text-left hover:text-teal-300" onClick={() => {
                        router.push("/liquidity-manager");
                        closeDrawer();
                    }}>
                        - Solana Liquidity Manager
                    </button>
                    <button className="text-[18px] font-[500] text-left hover:text-teal-300" onClick={() => {
                        router.push("/pricing");
                        closeDrawer();
                    }}>
                        - Pricing
                    </button>
                    <button className="text-[18px] font-[500] text-left hover:text-teal-300" onClick={() => {
                        router.push("/contact-us");
                        closeDrawer();
                    }}>
                        - Contact Us
                    </button>
                    <button className="text-[18px] font-[500] text-left hover:text-teal-300" onClick={() => {
                        router.push("/contact-us");
                        closeDrawer();
                    }} >
                        - X(Twitter)
                    </button >
                </div >
            </Drawer >
        </div >
    )
}