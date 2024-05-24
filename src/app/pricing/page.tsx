"use client";
import { TABLE_HEAD, TABLE_ROWS } from "@/global/config";
import { Card, Typography } from "@material-tailwind/react";
import Image from "next/image";


export default function Pricing() {
    return (
        <div className="min-h-screen flex flex-col items-center pt-[60px] md:pt-[80px] px-[20px]">
            <h1 className="text-[30px] md:text-[40px] text-gray-900 font-[700]  mt-[20px]">
                Pricing
            </h1>
            <h2 className="w-full md:w-[800px] text-[18px] md:text-[24px] text-gray-900  text-center font-[700] mt-[10px] md:mt-[20px]">
                TokenTool.io is by far the most affordable token creator tool out there. We charge to keep our lights (and servers) on.
            </h2>
            <Card className=" w-full md:w-[800px]  mt-[20px]" placeholder={""}
                onPointerEnterCapture={() => { }}
                onPointerLeaveCapture={() => { }}>
                <table className="w-full min-w-max table-auto text-left rounded-2xl">
                    <thead >
                        <tr>
                            {TABLE_HEAD.map((head) => (
                                <th
                                    key={head}
                                    className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                                >
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="font-normal leading-none opacity-70"
                                        placeholder={""}
                                        onPointerEnterCapture={() => { }}
                                        onPointerLeaveCapture={() => { }}
                                    >
                                        {head}
                                    </Typography>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {TABLE_ROWS.map(({ icon, title, price }, index) => {
                            const isLast = index === TABLE_ROWS.length - 1;
                            const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

                            return (
                                <tr key={title}>
                                    <td className="flex flex-row items-center gap-2 p-4 border-b border-blue-gray-50">
                                        <Image src={icon} alt={title} className="w-[30px] h-[30px] rounded-full" />
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-normal"
                                            placeholder={""}
                                            onPointerEnterCapture={() => { }}
                                            onPointerLeaveCapture={() => { }}
                                        >
                                            {title}
                                        </Typography>
                                    </td>
                                    <td className={classes}>
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-normal"
                                            placeholder={""}
                                            onPointerEnterCapture={() => { }}
                                            onPointerLeaveCapture={() => { }}
                                        >
                                            {price}
                                        </Typography>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </Card>
        </div>)
}