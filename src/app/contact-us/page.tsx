
'use client';
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
export default function ContactUs() {

  const [formData, setFormData] = useState({
    to: '',
    subject: 'TokenTool Support',
    text: '',
    html: '',
    robotTest: ''
  });

  const [randomNumber1, setRandomNumber1] = useState(0);
  const [randomNumber2, setRandomNumber2] = useState(0);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const emailSend = async (e: FormEvent) => {
    e.preventDefault();
    console.log(formData.robotTest, randomNumber1 + randomNumber2);
    if (parseInt(formData.robotTest) !== randomNumber1 + randomNumber2) {
      return (alert("Wrong number!"));
    }
    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await res.json();

      if (res.ok) {
        alert('Email sent successfully!');
      } else {
        alert('Failed to send email: ' + result.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while sending the email.');
    }
  }

  function getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  useEffect(() => {
    setRandomNumber1(getRandomNumber(1, 10));
    setRandomNumber2(getRandomNumber(1, 10));
  }, [])

  return (
    <form onSubmit={emailSend} className="min-h-screen w-full flex flex-col items-center pt-[60px] md:pt-[80px] px-[20px]">
      <h1 className="text-[30px] md:text-[40px] text-gray-900 font-[700]  mt-[20px]">
        Contact US
      </h1>
      <div className="w-full md:w-[800px] flex flex-col items-start mt-[40px]">
        <p>
          Email
        </p>
        <input
          type="email" name="to" placeholder="Type your email here" className="w-full border-[1px] p-[8px] outline-none mt-[8px] rounded-[6px]" value={formData.to} onChange={handleChange} required
        />
      </div>
      <div className="w-full md:w-[800px] flex flex-col items-start mt-[20px]">
        <p>
          Message
        </p>
        <textarea
          placeholder="Type your message here" name="text" className="w-full h-[150px] border-[1px] p-[8px] outline-none mt-[8px] rounded-[6px]" value={formData.text} onChange={handleChange} required
        />
      </div>
      <div className="w-full md:w-[800px] flex flex-col items-start mt-[40px]">
        <p>
          Robot Test - What is {randomNumber1}+{randomNumber2}?
        </p>
        <input
          type="text" name="robotTest" placeholder="Type your answer here" className="w-full border-[1px] p-[8px] outline-none mt-[8px] rounded-[6px]" value={formData.robotTest} onChange={handleChange} required
        />
      </div>
      <button className="bg-blue-500 w-[200px] h-[50px] rounded-lg text-white font-[700] text-[18px] mt-[20px]" type="submit">
        Send Message
      </button>
    </form>
  );
}
