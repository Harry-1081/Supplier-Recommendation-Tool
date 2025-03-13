import React from 'react'
import  Navbar  from '../components/Navbar'
import Footer from '../components/Footer'
import { useNavigate } from 'react-router-dom';


function Home() {
    var navigate= useNavigate()
    return(
        <>
        <Navbar/>
        <div className="bg-black-50 text-white lg:justify-center">

        {/* Division 1 */}
            <div className="flex xl:justify-evenly lg:flex-col xl:h-[720px] items-center">

                <div className="lg:pl-[5%] lg:h-[450px] lg:mt-[30px]">
                    <p className="xl:text-1xl lg:text-[1.1rem] xl:pb-[10px] font-poppins">A B O U T &nbsp; U S</p>
                    <p className="xl:text-5xl lg:text-2xl pb-[15px] font-bold">Empowering Dreams<br/>One investment<br/>& one stock at a Time</p>
                    <p className="text-1xl font-inclusiveSans lg:hidden">At MarketWatch.AI, our mission is to empower investors with<br/>  
                        clarity and confidence. We are committed to building a global<br/>  
                        community that values data-driven insights and informed decision<br/>  
                        making. With every analysis, we bridge the gap between complex <br/>
                        financial data and actionable intelligence.  </p>
                    
                    <p className="xl:hidden max-w-[450px] lg:text-[0.9rem] lg:pr-[5%]">At MarketWatch.AI, our mission is to empower investors with  
                        clarity and confidence. We are committed to building a global  
                        community that values data-driven insights and informed decision  
                        making. With every analysis, we bridge the gap between complex 
                        financial data and actionable intelligence.</p>
                    <button className="bg-[#d5e1ffa9] mt-[25px] text-black font-semibold text-1xl w-[152px] h-[42px]"
                    onClick={()=>navigate("/query")}>Query Now !!</button>
                </div>

                <div className="lg:h-[310px]">
                    <img src="https://res.cloudinary.com/dnq6fx1oj/image/upload/v1695540692/main-image_cambq0.webp" alt="img1"
                    className="xl:w-[500px] xl:h-[459px] lg:w-[290px] lg:h-[266px]"></img>
                </div>
            </div>

        {/* Division 2 */}
            <div className="flex-col items-center bg-[#d5e1ffa9]">

                <div className="text-black text-center xl:pt-[80px] lg:pt-[30px] pb-[30px]">
                    <p className="xl:text-1xl xl:pb-[10px] font-poppins">N E W S</p>
                    <p className="xl:text-4xl lg:text-2xl font-inclusiveSans font-semibold">Marketwatch.ai in the news</p>
                </div>

                <div className="flex items-center xl:justify-evenly lg:flex-col lg:gap-y-[30px] xl:h-[635px] lg:h-[1260px]">

                    <div className="xl:w-[335px] xl:h-[440px] bg-[#2c2929] rounded-[15px] lg:w-[270px] lg:h-[385px]
                    transition-transform transform scale-100 hover:scale-105 ">
                        <img src="https://res.cloudinary.com/dnq6fx1oj/image/upload/v1695622425/d113d94b-671d-4a0e-a613-7224742bb3d5_w1200_r1_cxvvsy.jpg" 
                            className="rounded-t-[15px] xl:pb-[10px]" alt="newscover"></img>
                        <div className="pl-[10%] pt-[3%] w-[80%]">
                            <p className="font-inclusiveSans font-semibold">D E C &nbsp; 2 0 ,&nbsp; 2 0 2 3</p>
                            <p className="xl:text-[1.45rem] xl:mt-[10px] lg:text-2xl font-semibold">Empowering efficiency: How Marketwatch.ai is redefining stock market.</p>
                        </div>
                    </div>

                    <div className="xl:w-[335px] xl:h-[440px] bg-[#2c2929] rounded-[15px] lg:w-[270px] lg:h-[385px]
                    transition-transform transform scale-100 hover:scale-105">
                        <img src="https://res.cloudinary.com/dnq6fx1oj/image/upload/v1695622425/d113d94b-671d-4a0e-a613-7224742bb3d5_w1200_r1_cxvvsy.jpg" 
                            className="rounded-t-[15px] xl:pb-[10px] " alt="newscover"></img>
                        <div className="pl-[10%] pt-[3%] w-[80%]">
                            <p className="font-inclusiveSans font-semibold">S E P &nbsp; 0 2 ,&nbsp; 2 0 2 4</p>
                            <p className="xl:text-[1.45rem] xl:mt-[10px] lg:text-2xl font-semibold">From Passion to Purpose - The Story behind the new popular investment app - Marketwatch.ai</p>
                        </div>
                    </div>

                    <div className="xl:w-[335px] xl:h-[440px] bg-[#2c2929] rounded-[15px] lg:w-[270px] lg:h-[385px]
                    transition-transform transform scale-100 hover:scale-105">
                        <img src="https://res.cloudinary.com/dnq6fx1oj/image/upload/v1695622425/d113d94b-671d-4a0e-a613-7224742bb3d5_w1200_r1_cxvvsy.jpg" 
                            className="rounded-t-[15px] xl:pb-[10px]" alt="newscover"></img>
                        <div className="pl-[10%] pt-[3%] w-[85%]">
                            <p class    Name="font-inclusiveSans font-semibold">N O V &nbsp; 1 3 ,&nbsp; 2 0 2 4</p>
                            <p className="xl:text-[1.45rem] xl:mt-[10px] lg:text-2xl font-semibold">Don't need to go to IIM's to understand stock market ! - Says Marketwatch.ai's founder Harry.</p>
                        </div>
                    </div>

                </div>
            </div>

        {/* Division 3 */}
            <div className='flex justify-evenly items-center lg:flex-col items-cente xl:h-[600px] lg:pb-[50px]'>

                <div className=''>
                    <img src='https://res.cloudinary.com/dnq6fx1oj/image/upload/v1695566490/impact-about-vision_hkmxrk.svg'
                    className='xl:w-[422px] xl:h-[426px] lg:w-[290px] lg:h-[292px]' alt='revivew'></img>
                </div>

                <div className='xl:w-[543px] xl:h-[295px] lg:w-[290px] bg-[#e7eaf1] text-black p-[2%]'>
                    <p className='zl:text-[1.2rem] lg:text-1xl font-inclusiveSans'>MarketWatch.AI is a powerful platform for making informed investment decisions. 
                        I’ve used it for stock analysis and comparisons, and its insights are highly accurate. Features like sentiment analysis,
                         financial metrics, and market trends make investing easier. The UI could be more responsive, but it remains intuitive and 
                         effective.</p>
                    <img src='https://res.cloudinary.com/dnq6fx1oj/image/upload/v1695566377/star_fbu9ph.png'
                    className='xl:w-[85%] pt-[10px] lg:h-[60px]' alt='review'></img>
                </div>

            </div>

        </div>
        <Footer/>
        </>
    );
}
export default Home;
