"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Tree, santaIcon, santaLogo } from "@/assets";
import CSVReader from "react-csv-reader";
import { csvGenerator, listGenerate, getError } from "@/utils/Utils";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  IEmployees,
  IPrevEmployee,
  IRefs,
  ISuffledEmployee,
} from "@/utils/Types";

export default function Home() {
  const newFileRef = useRef<HTMLInputElement>(null);
  const oldFileRef = useRef<HTMLInputElement>(null);
  const [isFileGenerated, SetIsFileGenerated] = useState<boolean>(false);
  const [isGenerating, SetIsGenerating] = useState<boolean>(false);
  const [prevEmployee, setPrevEmployee] = useState<IPrevEmployee[]>([]);
  const [employeeList, setEmployeeList] = useState<IEmployees[]>([]);
  const [suffledList, setSuffledList] = useState<ISuffledEmployee[]>([]);
  const [error, setError] = useState<string>("");

  const refs: IRefs = {
    newFile: newFileRef,
    oldFile: oldFileRef,
  };
  const onUploadHandler = (
    e: React.MouseEvent<HTMLButtonElement>,
    type: string
  ) => {
    refs[type].current?.click();
  };
  const fileChangeHandler =
    (setState: React.Dispatch<any>) => (data: any, fileInfo: any) => {
      setState(data);
      setError("");
    };

  const generateFile = () => {
    const isError = getError(prevEmployee, employeeList);

    if (isError) {
      // setError(isError.msg)
      toast.error(isError.msg, { theme: "colored" });
      return;
    }
    SetIsGenerating(true);
    // Child Mapping

    const data = listGenerate(employeeList, prevEmployee);
    setSuffledList(data);
    SetIsFileGenerated(true);
    SetIsGenerating((prev) => !prev);
  };

  const downloadCSV = () => {
    const csvData = csvGenerator(suffledList, employeeList);
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    var link = document.createElement("a");
    if (link.download !== undefined) {
      var url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "secret-santa-list.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return toast.success("Downlaoded Successfully!");
    }
    return toast.error("Something Went Wrong!", { theme: "colored" });
  };
  useEffect(() => {}, [prevEmployee]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-12 bg-white">
      {/* Header */}
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <header className="fixed z-[50] top-0 left-0 w-full bg-white	 px-5 py-2 flex justify-between items-center">
        {/* <Image src={Tree} alt='tree-logo' className='h-28 w-28' /> */}
        <Image src={santaLogo} alt="tree-logo" className="w-32" />
        <div>
          <button className="font-bold w-auto text-black mr-3 p-5">
            Sign In
          </button>
          <button className="px-5 h-14 bg-green-500 cursor-pointer rounded-[8px] font-bold text-white hover:bg-green-700 active:bg-green-500">
            Sign Up
          </button>
        </div>
      </header>

      <div className="flex flex-1 w-full select-none flex-col md:flex-row flex-col-reverse mt-5">
        <div className="w-full md:w-1/2 flex flex-col justify-center items-start">
          <h2 className="text-6xl md:text-7xl text-black ">
            Greetings Santa is coming, Dear Friends
          </h2>
          <p className=" text-lg text-black max-w-md mt-6">
            Find the perfect holiday gift for everyone on your list this year,
            no matter what’s your budget.
          </p>
          <div className=" flex justify-between mt-8 flex-wrap">
            <div className=" flex flex-col gap-4">
              <div className="flex items-center">
                <div className="bg-green-500 w-8 h-8 rounded-full mr-2  flex justify-center items-center">
                  <p className="text-white font-bold ml-1">1.</p>
                </div>
                <button
                  className="px-5 h-14 bg-green-500 cursor-pointer rounded-[8px] font-bold text-white hover:bg-green-700 active:bg-green-500"
                  onClick={(e) => onUploadHandler(e, "newFile")}
                >
                  Upload Employee List
                </button>
              </div>
              <div className="flex items-center">
                <div className="bg-green-500 w-8 h-8 rounded-full mr-2 flex justify-center items-center">
                  <p className="text-white font-bold ml-1">2.</p>
                </div>
                <button
                  className="px-5 h-14 bg-green-500 cursor-pointer rounded-[8px] font-bold text-white hover:bg-green-700 active:bg-green-500"
                  onClick={(e) => onUploadHandler(e, "oldFile")}
                >
                  Upload Previous Year List
                </button>
              </div>
              <div className="flex items-center">
                <div className="bg-green-500 w-8 h-8 rounded-full mr-2  flex justify-center items-center">
                  <p className="text-white font-bold ml-1">3.</p>
                </div>
                {isGenerating ? (
                  <Loader />
                ) : (
                  <button
                    className={`px-5 h-14 min-w-[160px] bg-green-500 cursor-pointer rounded-[8px] font-bold text-white hover:bg-green-700 active:bg-green-500 ${
                      error && "bg-red-500 pointer-events-none"
                    }`}
                    onClick={generateFile}
                  >
                    Generate File
                  </button>
                )}
              </div>
              <div className="flex items-center">
                <div className="bg-green-500 w-8 h-8 rounded-full mr-2  flex justify-center items-center">
                  <p className="text-white font-bold ml-1">4.</p>
                </div>
                <button
                  className={`px-5 h-14 bg-gray-500 pointer-events-none rounded-[8px] font-bold text-white hover:bg-gray-700 active:bg-gray-600 ${
                    isFileGenerated &&
                    "bg-green-500 active:bg-green-500 hover:bg-green-700 cursor-pointer pointer-events-auto"
                  } `}
                  onClick={downloadCSV}
                >
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* santa image */}
        <div className="w-full md:w-1/2 flex justify-center items-center">
          <Image
            src={santaIcon}
            alt="santa"
            className="w-[270px] md:w-[574px] relative z-[2]"
          />
        </div>
      </div>

      {/* Hidden File readers */}
      <CSVReader
        ref={newFileRef}
        onFileLoaded={(data, fileinfo) =>
          fileChangeHandler(setEmployeeList)(data, fileinfo)
        }
        inputStyle={{ display: "none" }}
        parserOptions={{ header: true, skipEmptyLines: true }}
      />
      <CSVReader
        ref={oldFileRef}
        onFileLoaded={(data, fileinfo) =>
          fileChangeHandler(setPrevEmployee)(data, fileinfo)
        }
        inputStyle={{ display: "none" }}
        parserOptions={{ header: true, skipEmptyLines: true }}
      />
    </main>
  );
}

// Loader component
export const Loader = () => {
  return (
    <div role="status" className="h-14">
      <svg
        aria-hidden="true"
        className="inline w-12 h-12 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-green-500"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
      {/* <span className="sr-only">Loading...</span> */}
    </div>
  );
};
