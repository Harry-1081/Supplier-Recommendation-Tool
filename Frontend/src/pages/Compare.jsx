import React, { useState,useEffect } from 'react';
import Papa from 'papaparse'
import Swal from 'sweetalert2';
import Loader from "../components/Loader";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import rankData from '../assets/ranking.csv'

const Compare = () => {

    const[data,setData]=useState([])
    const [question, setQuestion] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    var retry=0;
    var isError = false;

    const handleQuery = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:5100/get_stock_info", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: question }), 
        });
  
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
  
        const data = await response.json();
        console.log(data)
        isError = false;
        
      } catch (error) {
        retry++
        if(retry<5)
          handleQuery()
        console.error("Error querying server:", error);
        isError = true;
      } finally {
        if(isError && retry>5)
          setIsLoading(false);
        if(!isError)
          setIsLoading(false);
      }
  
    };
    
    useEffect(() => {
      const fetchParseData = async () => {
        Papa.parse(rankData, {
          download: true,
          delimiter: ",",
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            const filteredData = result.data.filter(row => 
              row["PE Score"] !== undefined && row["PE Score"] !== ''
            );
            setData(filteredData);
            console.log(filteredData);
          }
        });
      };
  
      fetchParseData();
    }, []);
    
    const handleExplanation = (exp1, exp2, exp3, exp4, exp5, exp6) => {
        const explanationText = `
          1. ${exp1 || 'N/A'}
    
          2. ${exp2 || 'N/A'}
    
          3. ${exp3 || 'N/A'}
    
          4. ${exp4 || 'N/A'}
    
          5. ${exp5 || 'N/A'}
    
          6. ${exp6 || 'N/A'}
        `;
      
        Swal.fire({
          title: 'Explanation',
          text: explanationText.trim(),
          icon: 'info',
          confirmButtonText: 'OK',
          width: '600px',
          padding: '20px',
          html: explanationText.replace(/\n/g, '<br/>') 
        });
      };
    
    return (
        <>
        
        <Navbar/>
        {isLoading ? (
        <Loader />
        ) : (
          <>
        <div className="flex justify-center my-[100px] mt-[93px] gap-10">
              <input
                className="rounded-lg outline outline-4 outline-blue-700 border-0 bg-gray-300 focus:bg-white outline-offset-3 p-3 w-[600px] transition duration-300"
                type="text"
                id="questionInput"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Enter your Query"
              />
              <button className="text-lg p-3 bg-black text-white rounded-lg font-bold transition duration-500 outline-4 outline-blue-700 hover:bg-gray-300 hover:text-black outline-offset-3"
              onClick={handleQuery}>
                Compare Stocks
              </button>
        </div>

        <div className='w-screen flex pb-[70px] justify-center'>

        <div className="my-8 w-4/5">

         <table className="w-full border border-gray-600 rounded-lg shadow-lg">

            <thead className="bg-gray-200">
              <tr>
                <th rowSpan="2" className="px-[20px] py-[15px] border border-gray-500 text-center">Ticker Code</th>
                <th colSpan="5" className="px-[20px] py-[15px] border border-gray-500 text-center">Quantitative Scores</th>
                <th colSpan="3" className="px-[20px] py-[15px] border border-gray-500 text-center">Qualitative Scores</th>
                <th rowSpan="2" className="px-[20px] py-[15px] border border-gray-500 text-center">Overall Score</th>
                <th rowSpan="2" className="px-[20px] py-[15px] border border-gray-500"></th>
              </tr>
              <tr>
                <th className="px-[20px] py-[15px] border border-gray-500 text-center">PE Ratio</th>
                <th className="px-[20px] py-[15px] border border-gray-500 text-center">Industry PE</th>
                <th className="px-[20px] py-[15px] border border-gray-500 text-center">ROE</th>
                <th className="px-[20px] py-[15px] border border-gray-500 text-center">PAT</th>
                <th className="px-[20px] py-[15px] border border-gray-500 text-center">Revenue</th>
                <th className="px-[20px] py-[15px] border border-gray-500 text-center">News Sentiment</th>
                <th className="px-[20px] py-[15px] border border-gray-500 text-center">MD&A Section</th>
                <th className="px-[20px] py-[15px] border border-gray-500 text-center">Business Strategy</th>
              </tr>
            </thead>

            <tbody>
              {data.slice(0).map((row, rowIndex) => (
                <tr key={rowIndex} className={`bg-white ${rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                  <td className="px-[20px] py-[15px] border border-gray-500">{row['Ticker']}</td>
                  <td className="px-[20px] py-[15px] border border-gray-500 text-center">{row['PE Score']}</td>
                  <td className="px-[20px] py-[15px] border border-gray-500 text-center">{row['Industry PE Score']}</td>
                  <td className="px-[20px] py-[15px] border border-gray-500 text-center">{row['ROE Score']}</td>
                  <td className="px-[20px] py-[15px] border border-gray-500 text-center">{row['PAT Score']}</td>
                  <td className="px-[20px] py-[15px] border border-gray-500 text-center">{row['Revenue Score']}</td>
                  <td className="px-[20px] py-[15px] border border-gray-500 text-center">{row['News Sentiment Score']}</td>
                  <td className="px-[20px] py-[15px] border border-gray-500 text-center">{row['MD & A Score']}</td>
                  <td className="px-[20px] py-[15px] border border-gray-500 text-center">{parseFloat(row['Strategic score'])>5 ? 5:row['Strategic score']}</td>
                  <td className="px-[20px] py-[15px] border border-gray-500 text-center">
                    {parseFloat(row['PE Score'] || 0) + 
                    parseFloat(row['Industry PE Score'] || 0) + 
                    parseFloat(row['ROE Score'] || 0) + 
                    parseFloat(row['PAT Score'] || 0) + 
                    parseFloat(row['Revenue Score'] || 0) + 
                    parseFloat(row['News Sentiment Score'] || 0) + 
                    parseFloat(row['MD & A Score'] || 0) + 
                    (parseFloat(row['Strategic score'] || 0)>5 ? 5:parseFloat(row['Strategic score'] || 0))}
                  </td>
                  <td className="p-3 border border-gray-300">
                    <button
                      className="text-sm bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded focus:outline-none focus:ring focus:ring-blue-300"
                      onClick={() => handleExplanation(row['Exp1'], row['Exp2'], row['Exp3'], row['Exp4'], row['Exp5'], row['Exp6'])}
                    >
                      View Explanation
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
          </>
        )}

        <Footer/>
        </>
    );
}
export default Compare;
