"use client";
import { ContextStates } from "@/components/utils/context/Index";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import ServerError from "../utils/ErrorPages/ServerError";
import ServerReset from "../utils/ErrorPages/ServerReset";
import { messageCustom } from '@/components/utils/message/message';
import { axiosConfig } from '@/components/utils/axios';

const OTP_LENGTH = 6;
const RESEND_TIME = 120;

export default function OTPCodeInput({ phoneNumber, setcurentPage, sendUser }) {
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [ErrorServer, setErrorServer] = useState();
  const [activeIndex, setActiveIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(RESEND_TIME);
  const { curentPath, setcurentUser, setaccessToken } = ContextStates()
  const router = useRouter()
  const inputsRef = useRef([]);
  const sendCodeOTP = async (Codeotp) => {
    try {
      const sendData = await axiosConfig('/user/vrifyotp', {
        method: "POST",
        headers: { "Content-type": "application/json" },
        data: { codeOTP: Codeotp, phoneNumber },
      })
      if (sendData.status === 200) {
        setaccessToken(sendData.data.accessToken)
        setcurentUser(sendData.data.user)
        if (curentPath) {
          router.replace(curentPath)
        } else {
          router.replace('/')
        }
      }
    } catch (error) {
      if (error.status === 403) {
        messageCustom(error.data.message, 'error', 6000);
      } else if (error.status === 400) {
        messageCustom(error.data.message, 'error', 6000);
      } else if (error.status === 429) {
        messageCustom(error.data.message, 'error', 6000);
        setcurentPage('phone')
      } else if (error.status === 500) {
        setErrorServer('SERVER_ERROR')
      } else if (error.status === 503) {
        messageCustom('error code 503', 'error', 6000);
      } else {
        setErrorServer('SERVER_RESET')
      }
    }
  }
  useEffect(() => {
    inputsRef.current[activeIndex]?.focus();
  }, [activeIndex]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const t = setInterval(() => setTimeLeft((p) => p - 1), 1000);
    return () => clearInterval(t);
  }, [timeLeft]);

  const formatTime = () => {
    const m = Math.floor(timeLeft / 60);
    const s = timeLeft % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };
  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^\d?$/.test(value)) return;
    const nextOtp = [...otp];
    nextOtp[index] = value;
    setOtp(nextOtp);
    if (value && index < OTP_LENGTH - 1) {
      setActiveIndex(index + 1);
    }
    if (nextOtp.join("").length === 6) {
      sendCodeOTP(nextOtp.join(""))
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      setActiveIndex(index - 1);
    }
  };
  const handlePaste = (e) => {
    const data = e.clipboardData.getData("text").slice(0, OTP_LENGTH);
    if (!/^\d+$/.test(data)) return;

    const newOtp = data.split("");
    setOtp(newOtp);
    setActiveIndex(OTP_LENGTH - 1);
    if (newOtp.join("").length === 6) {
      sendCodeOTP(newOtp.join(""))
    }
  };
  const resend = () => {
    if (timeLeft > 0) return;
    setOtp(Array(OTP_LENGTH).fill(""));
    setActiveIndex(0);
    setTimeLeft(RESEND_TIME);
    sendUser()
  };

  if (ErrorServer === 'SERVER_ERROR') {
    return (
      <ServerError />
    )
  } else if (ErrorServer === 'SERVER_RESET') {
    return (
      <ServerReset />
    )
  }
  return (
    <div>
      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-2" dir="ltr" onPaste={handlePaste}>
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => (inputsRef.current[i] = el)}
              value={digit}
              type="text"
              inputMode="numeric"
              maxLength={1}
              className="w-12 h-12 text-center text-xl border rounded"
              onChange={(e) => handleChange(e, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
            />
          ))}
        </div>
        <button
          onClick={resend}
          disabled={timeLeft > 0}
          className={timeLeft ? "text-gray-400" : "text-blue-600"}
        >
          {timeLeft > 0 ? `ارسال مجدد تا ${formatTime()}` : "ارسال مجدد کد"
          }
        </button>
      </div>
    </div >
  );
}
