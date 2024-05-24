
export default function Footer() {

    return (
        <div className=" md:py-[20px] md:border-[1px] w-full flex flexd-col  justify-center mt-[20px] md:mt-[100px]">
            <div className="flex flex-col md:flex-row w-full md:w-[800px] items-start justify-between gap-2 ">
                <p className="w-[200px] text-gray-800 text-[16px] md:text-[20px] font-[600]">
                    Privacy Policy
                </p>
                <p className="w-[200px] text-gray-800 text-[16px] md:text-[20px] font-[600]">
                    Terms & Conditions
                </p>
                <p className="w-[200px] text-gray-800 text-[16px] md:text-[20px] font-[600]">
                    Contact Us
                </p>
            </div>
        </div>
    )
}