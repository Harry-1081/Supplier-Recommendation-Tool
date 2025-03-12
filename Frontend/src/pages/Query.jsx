import React, { useState } from "react";
import Loader from "../components/Loader";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import stockPricesImage from '../assets/stock_prices.png';
import logo from '../assets/IBM_bee_icon.png'



const QueryComponent = () => {
  const [question, setQuestion] = useState("");
  const [sentiment, setSentiment] = useState("");
  const [cname, setCname] = useState("");
  const [news,setNews] = useState([])
  const [metrics,setMetrics] = useState([])
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isOpen, setIsOpen] = useState(false); 


  const sendMessage = async () => {
      if (userInput.trim() === '') return;

      const userMessage = { sender: 'user-cb', text: userInput };
      setMessages([...messages, userMessage]);
      setUserInput('');

      try {
          const response = await fetch('http://localhost:8000/ask', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ query: userInput, ticker:(metrics[0].replace(".NS","")) }),
          });

          const data = await response.json();
          const botMessage = { sender: 'bot-cb', text: data.answer };
          setMessages(prevMessages => [...prevMessages, botMessage]);
      } catch (error) {
          console.error('Error fetching bot response:', error);
      }
  };

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
      setSentiment(data.sentiment);
      setNews(data.news_titles);
      console.log(data.news_titles.answer)
      setCname(data.company_name);
      setMetrics(data.metrics);

    } catch (error) {
      console.error("Error querying server:", error);
      setSentiment("Error: Failed to query server.");
    } finally {
      setIsLoading(false);
    }

  };
  

  return (
    <>

    <Navbar/>

    <div className="w-full h-full my-[100px] mt-[60px] p-8 text-black flex flex-col justify-center items-center">
      {isLoading ? (
        <Loader />
      ) : (
        <>
            <div className="w-11/12 flex flex-col justify-center items-center gap-10">
            <div className="flex gap-10">
              <input
                className="rounded-lg outline outline-4 outline-blue-700 border-0 bg-gray-300 focus:bg-white outline-offset-3 p-3 w-[600px] transition duration-300"
                type="text"
                id="questionInput"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Enter your Query"
              />
              <button className="text-lg p-3 bg-black text-white rounded-lg font-bold transition duration-500 outline-4 outline-blue-700 hover:bg-gray-300 hover:text-black outline-offset-3" onClick={handleQuery}>
                Check Sentiment
              </button>
              </div>

              <div className="flex justify-around w-full gap-2">
                {sentiment && (
                  <div className="w-1/2 text-lg p-[20px] bg-gray-300 rounded-lg outline outline-4 outline-blue-700 max-h-[30vh] flex flex-col overflow-y-auto scrollbar-hide">
                    <p className="font-bold underline text-2xl">Stock Health</p>
                    <p className="font-bold my-2">{sentiment}</p>
                  </div>
                )}

                {metrics.length > 0 && (
                  <div className="w-1/3 text-lg p-[20px] bg-gray-300 rounded-lg outline outline-4 outline-blue-700 max-h-[30vh] flex flex-col overflow-y-scroll scrollbar-hide">
                    <p className="font-bold underline text-2xl">Requested Metrics Data</p>
                    {metrics.map((item, index) => (
                      <p key={index} className="my-2">
                        {index + 1} - {item}
                      </p>
                    ))}
                  </div>
                )}
              </div>

              {/* Stock Trend and News Section */}
              <div className="flex flex-wrap justify-around w-full gap-2">
                {news.length>0 && (
                  <div className="w-1/2 text-lg p-[20px] bg-gray-300 rounded-lg outline outline-4 outline-blue-700 max-h-[50vh] flex flex-col overflow-y-auto scrollbar-hide">
                    <p className="font-bold text-center text-2xl">Stock Trend over the past year</p>
                    <img className="w-full mt-2" src={stockPricesImage} alt="Stock Prices" />
                  </div>
                )}

                {news && news.length > 0 && (
                  <div className="w-1/3 text-lg p-[20px] bg-gray-300 rounded-lg outline outline-4 outline-blue-700 max-h-[50vh] flex flex-col overflow-y-auto scrollbar-hide">
                    <p className="font-bold underline text-2xl">News Headlines</p>
                    {news.map((item, index) => (
                      <p key={index} className="my-2">
                        {index + 1}) {item}
                      </p>
                    ))}
                  </div>
                )}

                {sentiment && news.length === 0 && (
                  <div className="w-1/3 text-lg p-4 bg-gray-300 rounded-lg outline outline-4 outline-blue-700">
                    <p className="font-bold">No News Headlines Found</p>
                  </div>
                )}
              </div>
            </div>

        </>
      )}

      <div className="fixed bottom-12 right-8 z-50">
        <button className="bg-gray-100 text-black p-2 w-14 rounded cursor-pointer mb-2" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? ' X ' : <img src={logo} className="w-9" alt="I Bee M" />}
        </button>

        {isOpen && (
          <div className="bg-white rounded-lg shadow-lg w-72 h-[400px] overflow-y-auto p-5 flex flex-col">
            <div className="flex-grow flex flex-col overflow-y-auto">
              {messages.map((msg, index) => (
                <div key={index} className={`mb-2 ${msg.sender === 'user-cb' ? 'self-end bg-teal-100' : 'self-start bg-gray-200'} p-2 rounded-lg max-w-[70%]`}>
                  {msg.text}
                </div>
              ))}
            </div>

            <div className="flex mt-3">
              <input
                type="text"
                className="flex-grow p-2 bg-gray-200 rounded-tl-lg rounded-bl-lg"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Type a message..."
              />
              <button className="p-2 bg-blue-500 text-white rounded-tr-lg rounded-br-lg" onClick={sendMessage}>Send</button>
            </div>
          </div>
        )}
      </div>
    </div>

    <Footer/>

    </>
  );
};

export default QueryComponent;
