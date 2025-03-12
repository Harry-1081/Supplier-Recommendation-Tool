import React from "react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
   const call = () => {
     window.location.href = "tel:9626209856";
   };
  const navigate = useNavigate();
  return (
    <>
      <footer className="bg-[#d5e1ffa9] h-full max-w-[100%] bottom-0  text-black ">
        <section className="grid xl:grid-cols-4 lg:grid-cols-2 items-center xl:gap-10 lg:gap-16  p-10  ">
          <div className="">
            <ul className="text-black flex flex-col gap-5  ">
              <li className="">
                <button className="flex items-center gap-3">
                </button>
              </li>
              <li>
                <span>
                  We appreciate your enthusiastic support for our cause, even
                  amidst unforeseen challenges.
                </span>
              </li>
              <li>
                <button className="hover:text-lightteal" onClick={call}>
                  <span>
                    <i class="fa-solid fa-phone"></i>
                  </span>
                  <span>+91 6942042069</span>
                </button>
              </li>
              <li>
                <button className="flex hover:text-lightteal lg:text-sm items-center">
                  <span>
                    <i class="fa-solid fa-envelope"></i>
                  </span>
                  <a
                    className="underline hover:text-lightteal"
                    href="mailto:marketwatch.ai@gmail.com">
                    marketwatch.ai@gmail.com
                  </a>
                </button>
              </li>
            </ul>
          </div>
          <div>
            <ul className="flex flex-col gap-5">
              <h1 className="font-bold text-2xl">Page</h1>
              <li>
                <button onClick={() => navigate("/about")}>About us</button>
              </li>
              <li>
                <button onClick={() => navigate("/contact")}>Contact us</button>
              </li>
              <li>
                <button>News and Blog</button>
              </li>
              <li>
                <button>Meet a team</button>
              </li>
            </ul>
          </div>
          <div>
            <ul className="flex flex-col gap-1.5">
              <h1 className="font-bold text-2xl ">Link</h1>
              <li>
                <button>Sign up</button>
              </li>
              <li>
                <button>Sign in</button>
              </li>
              <li>
                <button onClick={() => navigate("/privacypolicy")}>
                  Privacy Policy
                </button>
              </li>
              <li>
                <button>Terms</button>
              </li>
              <li>
                <button>Cookie</button>
              </li>
              <li>
                <button>Support</button>
              </li>
            </ul>
          </div>
          <div>
            <ul className="flex flex-col gap-3">
              <h1 className="font-bold text-2xl">Global Site</h1>
              <li>
                <button>India</button>
              </li>
              <li>
                <button>California</button>
              </li>
              <li>
                <button>Indonesia</button>
              </li>
              <li>
                <button>Canada</button>
              </li>
              <li>
                <button>Malaysia</button>
              </li>
            </ul>
          </div>
        </section>

        {/* </section> */}
        <section className="flex items-center border-t-2  border-black divide-x-10 p-8 justify-between ">
          <div className="">
            <p>Copyrights ©2025. Build by Marketwatch.ai</p>
          </div>
          <div className="flex cursor-pointer gap-3 mr-10">
            <p onClick={() => navigate("/privacypolicy")}>Privacy policy</p>
            <p onClick={() => navigate("/termsandconditions")}>
              Terms and conditions
            </p>
            <p>Refund policy</p>
          </div>
        </section>
      </footer>
    </>
  );
};

export default Footer;
