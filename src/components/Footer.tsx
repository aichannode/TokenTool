"use client";
import { useRouter } from "next/navigation"

export default function Footer() {

    const router = useRouter();

    const handlePrivacyPolicy = () => {
        router.push("/privacy-policy")
    }

    const handleTermsAndConditions = () => {
        router.push("/terms-conditions")
    }

    const handleContactUs = () => {
        router.push("/contact-us")
    }


    return (
        <div className=" md:py-[20px] md:border-[1px] w-full flex flexd-col  justify-center mt-[20px] md:mt-[100px]">
            <div className="flex flex-col  md:flex-row w-full md:w-[800px] items-start justify-between gap-2 ">
                <button className="w-[200px] text-start text-gray-800 text-[16px] md:text-[20px] font-[600]" onClick={handlePrivacyPolicy} >
                    Privacy Policy
                </button>
                <button className="w-[200px] text-start text-gray-800 text-[16px] md:text-[20px] font-[600]" onClick={handleTermsAndConditions} >
                    Terms & Conditions
                </button>
                <button className="w-[200px] text-start text-gray-800 text-[16px] md:text-[20px] font-[600]" onClick={handleContactUs} >
                    Contact Us
                </button>
            </div>
        </div>
    )
}