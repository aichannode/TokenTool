import Footer from "@/components/Footer";

export default function ContactUs() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center pt-[60px] md:pt-[80px] px-[20px]">
      <h1 className="text-[30px] md:text-[40px] font-[800] neon-text-gradient mt-[20px]">
        Privacy Policy
      </h1>
      <div className="w-full md:w-[800px]">
        <h2 className="w-full md:w-[800px] text-[18px] md:text-[24px] text-slate-400  text-center font-[700] mt-[10px] md:mt-[20px]">
          We do not collect any personally identifiable data, and we only use information that is available publicly on the blockchain.
        </h2>
        <div className="mt-[20px]">
          <h3 className="text-[16px] md:text-[20px] font-[700] text-center text-slate-300">
            Notice
          </h3>
          <h4 className="text-[14px] md:text-[18px] text-center text-slate-500">
            Whenever we request information that can be used to personally identify you, you will explicitly be asked to provide it and/or give us permission to use it. This information is requested by our system whenever confirmation of your permission is required to continue. We currently do not collect any such information.
          </h4>
        </div>
        <div className="mt-[20px]">
          <h3 className="text-[16px] md:text-[20px] font-[700] text-center text-slate-300">
            Consent
          </h3>
          <h4 className="text-[14px] md:text-[18px] text-center text-slate-500">
            You will always have the choice whether to give us permission to process your information or not. This extends to actions such as confirmation the transaction in your wallet.
          </h4>
        </div>
        <div className="mt-[20px]">
          <h3 className="text-[16px] md:text-[20px] font-[700] text-center text-slate-300">
            Usage
          </h3>
          <h4 className="text-[14px] md:text-[18px] text-center text-slate-500">
            We do not collect any form of personal identifiable information. We only request access to the connected wallet for the purpose of executing the transaction when requested. This information is not stored or tracked.
          </h4>
        </div>
        <div className="mt-[20px]">
          <h3 className="text-[16px] md:text-[20px] font-[700] text-center text-slate-300">
            Retention of Information
          </h3>
          <h4 className="text-[14px] md:text-[18px] text-center text-slate-500">
            We do not retain any additional information outside of what is publicly available on the blockchain. Your specific inputs are not tracked or stored.
          </h4>
        </div>
        <div className="mt-[20px]">
          <h3 className="text-[16px] md:text-[20px] font-[700] text-center text-slate-300">
            Sub-Processors
          </h3>
          <h4 className="text-[14px] md:text-[18px] text-center text-slate-500">
            We use the following sub-processors to provide our services, we explicitly request each of our sub-processors to not collect any information not necessary to the operation. However, check out their privacy policies as necessary.
          </h4>
        </div>
        <div className="mt-[20px]">
          <h3 className="text-[16px] md:text-[20px] font-[700] text-center text-slate-300">
            Changes
          </h3>
          <h4 className="text-[14px] md:text-[18px] text-center text-slate-500">
            We reserve the right to make changes to our privacy policy. When this happens, you will be notified when you next visit this website. If you do not agree with the new policy, you are free to withdraw your consent within the given time period.
          </h4>
        </div>
        <div className="mt-[20px]">
          <h3 className="text-[16px] md:text-[20px] font-[700] text-center text-slate-300">
            Contact
          </h3>
          <h4 className="text-[14px] md:text-[18px] text-center text-slate-500">
            If you have any questions about our privacy policy, have a comment about it, wish to talk about the enforcement of our policy or want to otherwise discuss our privacy policy, you may reach out to us via the contact page.
          </h4>
        </div>
      </div>
      <Footer />
    </div>
  );
}
