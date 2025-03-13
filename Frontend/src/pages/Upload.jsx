import { useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";

const Upload = () => {

    const[ticker,setTicker]=useState("");
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    
    const handleQuery = async () => {
        setIsLoading(true);
        try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("ticker", ticker);

        const response = await fetch("http://localhost:5100/upload", {
            method: "POST",
            body: formData, 
          });
    
          if (!response.ok) {
            throw new Error("Failed to fetch data");
          }
    
          const data = await response.json();
          console.log(data)
          
        } catch (error) {
          console.error("Error querying server:", error);
        } finally {
            await new Promise(r => setTimeout(r, 1000));
            setIsLoading(false);
            setTicker("")
        }
      };

    return(
        <>
            <Navbar/>

            {isLoading ? (
            <Loader/>
            ) : (
            <>
            <div className="w-full h-full my-[100px] mt-[60px] p-8 text-black flex flex-col justify-center items-center">
                <div className="w-[350px] flex">
                    <input 
                        type="text" 
                        placeholder="Enter Ticker Code" 
                        className="px-[10px] mx-[10px]"
                        value={ticker}
                        onChange={(e)=>setTicker(e.target.value)}
                        required
                    />
                    <input 
                        type="file"
                        onChange={(e)=>setFile(e.target.files[0])}
                        className="text-green-100"
                        required
                    />
                </div>
                <div className="mt-[20px]">
                    <button className="text-lg p-3 bg-black text-white rounded-lg font-bold transition duration-500 outline-4 outline-blue-700 hover:bg-gray-300 hover:text-black outline-offset-3"
                    onClick={handleQuery}>
                        Upload Annual Report
                    </button>
                </div>
            </div>
            </>
            )}

            <Footer/>
        </>
    );
}
export default Upload;