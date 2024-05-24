import Image from "next/image";
export default function ContactUs() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center pt-[60px] md:pt-[80px] px-[20px]">
      <h1 className="text-[30px] md:text-[40px] text-gray-900 font-[700]  mt-[20px]">
        Contact US
      </h1>
      <div className="w-full md:w-[800px] flex flex-col items-start mt-[40px]">
        <p>
          Email
        </p>
        <input
          type="text" placeholder="Type your email here" className="w-full border-[1px] p-[8px] outline-none mt-[8px] rounded-[6px]"
        />
      </div>
      <div className="w-full md:w-[800px] flex flex-col items-start mt-[20px]">
        <p>
          Message
        </p>
        <textarea
          placeholder="Type your message here" className="w-full h-[150px] border-[1px] p-[8px] outline-none mt-[8px] rounded-[6px]"
        />
      </div>
      <div className="w-full md:w-[800px] flex flex-col items-start mt-[40px]">
        <p>
          Robot Test - What is 2+2?
        </p>
        <input
          type="text" placeholder="Type your answer here" className="w-full border-[1px] p-[8px] outline-none mt-[8px] rounded-[6px]"
        />
      </div>
      <button className="bg-blue-500 w-[200px] h-[50px] rounded-lg text-white font-[700] text-[18px] mt-[20px]">
        Send Message
      </button>
    </div>
  );
}
