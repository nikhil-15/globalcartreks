import React, { useState, useEffect } from "react";
import "../Common/downarrow.css";

const Downarrow = () => {
  const [isVisible, setIsVisible] = useState(true);

  const handleScroll = () => {
    let heightToHideFrom = 100;

    const winScroll =
      document.body.scrollTop || document.documentElement.scrollTop;

    if (winScroll > heightToHideFrom) {
      // console.log(window.scrollY);
      isVisible && setIsVisible(false);
    } else {
      setIsVisible(true);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    // <div className="downarrow">
    //   <div class="arrow-container animated fadeInDown">
    //     <div class="arrow-2">
    //       <i class="fa fa-angle-down"></i>
    //     </div>
    //     <div class="arrow-1 animated hinge infinite zoomIn"></div>
    //   </div>
    // </div>
    <>
      {isVisible && (
        <div className="downarrow">
          <svg class="arrows" viewBox="0 0 110 150">
            <path class="a1" d="M0 0 L30 32 L60 0"></path>
            <path class="a2" d="M0 20 L30 52 L60 20"></path>
            <path class="a3" d="M0 40 L30 72 L60 40"></path>
          </svg>
        </div>
      )}
    </>
  );
};

export default Downarrow;
