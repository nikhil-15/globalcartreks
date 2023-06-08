import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useNavigate, NavLink } from "react-router-dom";
import { API_BASE_URL } from "../../../Config/Config";
import { BASE_URL } from "../../../Config/BaseUrl";
import Modal from "react-bootstrap/Modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../Components/Common/downarrow.css";

function TpProviderInfo() {
  const [upArrow, setUparrow] = useState(false);
  const API_BASE_URL = BASE_URL()
  const appType = localStorage.getItem('appType');

  const handleScroll = (e) => {
    const offsetHeight = document.documentElement.offsetHeight;
    const innerHeight = window.innerHeight;
    const scrollTop = document.documentElement.scrollTop;

    if (offsetHeight - (innerHeight + scrollTop) <= 10) {
      setUparrow(true);
    } else if (window.scrollY === 0) {
      setUparrow(false);
    }
  };

  const navigate = useNavigate();
  let msg = localStorage.getItem("msg");

  useEffect(() => {
    window.scrollTo(0, 0);
    if (msg) {
      toast.warning(msg);
    }

    window.addEventListener("scroll", handleScroll);
  }, [msg]);

  const updateFlag = () => {
    const id = JSON.parse(localStorage.getItem("vId"));
    Axios.post(API_BASE_URL + "api/vendor_agree/" + btoa(id))
      .then(({ data }) => {
        if (data.status === "success") {
          localStorage.removeItem("vId");
          localStorage.removeItem("msg");
          // localStorage.setItem("vDetails", JSON.stringify(data.data));
          // navigate("/select-subscription")
          navigate("/login");
        } else {
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <ToastContainer />
      <div className="back_header"></div>
      <div className="page-heading">
        <h3>Information for Transportation Providers</h3>
      </div>
      <div className="page-details">
        <>
          <div className="downwardarrow">
            <i
              className={
                upArrow
                  ? "fa fa-long-arrow-down upwardarrow"
                  : "fa fa-long-arrow-down"
              }
              style={{ fontSize: "35px", color: "blue" }}
            ></i>
          </div>
          {
            appType == '1' ? 
            (
              <p>
                Global CarTreks.com is intent on increasing the awareness of your
                Car and Driver Service to millions of American travelers to Europe.
              </p>
            ) : 
            (
              <p>
                Global CarTreks.com is intent on increasing the awareness of your Limousine Service to millions of travelers.
              </p>
            )
          }
          
          <p>
            On this page, we discuss how payments are made and processed through
            Global CarTreks.com. Please read the Terms of Use and Privacy Policy
            for more detail.
          </p>
          <p>
            <strong>
              <u>Payments</u>
            </strong>
          </p>
          <p>
            All payments for your services booked through Global CarTreks.com by
            a Traveler will require payment by credit card and will go through
            Global CarTreks.com and is processed by Stripe, an internationally
            known payment processor. If you would like to learn more about
            Stripe, go to{" "}
            <a href="https://stripe.com/en-in" target="_blank">
              www.stripe.com.
            </a>{" "}
            .
            <b>
              This means you do not have to worry about taking cash or credit
              card payments
            </b>
            . Once a Traveler has booked your service and you have provided the
            transportation, you only need to let us know, through your Global
            CarTreks.com dashboard, that your service has been completed.
            Payment to you, minus the Global CarTreks.com and Stripe fees, shown
            below, will be processed and deposited in the bank that you
            designated.
          </p>
          <p>
            <strong>
              <u>Deposits</u>
            </strong>
          </p>
          <p>
            <b>
              It is entirely your choice as to whether you request a deposit
              from the Traveler
            </b>
            . If you have requested a deposit for your services, the deposit
            will be obtained from the Traveler and held by Stripe. The
            stipulation for how the deposit will be applied will be in
            accordance with your quote, including your cancellation date that
            you gave to the Traveler at the time of the booking of the
            reservation. For example, you may input a date that the deposit will
            be forfeited if the Traveler cancels the reservation after that
            date. In this instance, you would notify Global CarTreks.com and
            Stripe would forward the deposit minus the Global CarTreks.com and
            Stripe fees, shown below, to the bank you have designated. If there
            was a cancellation prior to the specified input date, you would
            notify us and the deposit would be refunded by Stripe to the
            Traveler. If there was no cancellation, the deposit would be applied
            to the total amount of the fee agreed to by you and Traveler at the
            time the reservation was made. Only one deposit can be requested for
            a trip.
          </p>
          <p>
            <strong>
              <u>Credit Card Hold</u>
            </strong>
          </p>
          <p>
            Twenty-four (24) hours prior to the commencing of the itinerary, a
            “Hold” will be placed on the Traveler’s credit card by Stripe to
            secure the full payment of the fee you agreed to with the Traveler
            at the time the reservation was made.
          </p>
          <p>
            <strong>
              <u>Trips Five (5) Days or Longer</u>
            </strong>
          </p>
          <p>
            For a trip five (5) days or longer, the Traveler must pay the full
            amount of the trip twenty-four (24) hours in advance of the
            beginning of the trip.
          </p>
          <p>
            <strong>
              <u>Fees</u>
            </strong>
          </p>
          <p>
            In order for Global CarTreks.com to, among other things, maintain
            and market the website, we must charge a fee based on the amount you
            charge the Traveler for your services as follows:
          </p>
          <table className="tp-table">
            <tbody>
              <tr>
                <th>
                  <p>
                    <strong>
                      <u>Amount You Charge Traveler </u>
                    </strong>
                  </p>
                </th>
                <th>
                  <p>
                    <strong>
                      <u> Our Fee</u>
                    </strong>
                  </p>
                </th>
                <th>
                  <p>
                    <strong>
                      <u>An Example of Our Fee</u>
                    </strong>
                  </p>
                </th>
              </tr>
              <tr>
                <td>Up to US $500</td>
                <td>4%</td>
                <td>For US $500 = US $20</td>
              </tr>

              <tr>
                <td>US $501 – US $1,000</td>
                <td>6%</td>
                <td>For US $750 = US $45</td>
              </tr>

              <tr>
                <td>US $1,001 and up</td>
                <td>8%</td>
                <td>For US $1,001 = US $80</td>
              </tr>
            </tbody>
          </table>
          {
            appType == '1' ?
            (
                <p>
                  You will be responsible for any taxes levied by any country or
                  locality in which you operate as well as VAT and other fees to
                  include, but not limited to, tolls and airport charges and the
                  Stripe (Payment Processor) fee of 2.9% of the total amount processed
                  plus US$ 0.30 (Thirty cents).{" "}
                  <u>
                    {" "}
                    Tolls and airport charges must be included in a quote to a
                    Traveler.
                  </u>
                </p>
            )
            :
            (
                <p>
                  You will be responsible for any taxes levied by any state or locality
                  in which you operate as well as other fees to include, but not limited to, 
                  tolls and airport charges and the Stripe (Payment Processor) fee of 2.9% of the total amount 
                  processed plus US$ 0.30 (Thirty cents).{" "}
                  <u>
                    {" "}
                    Tolls and airport charges must be included in a quote to a
                    Traveler.
                  </u>
                </p>
            )
          }


          <p>
            <strong>
              <u>Tips</u>
            </strong>
          </p>
          <p>
            <strong>
              If a Traveler gives you a tip, Global CarTreks.com will NOT apply
              our fee to it. You retain the full amount of any tip, minus the
              Stripe fee, that is provided to you.
            </strong>
          </p>
          <p>
            <strong>
              <u>
                <NavLink className="linking" to="/faq-vendor">
                  Frequently Asked Questions for Transportation Providers
                </NavLink>
              </u>
            </strong>
          </p>
          <p>
            Please review this information for more understanding of how Global
            CarTreks.com works for you.
          </p>

          {/* <><p><strong><u>Advertising Opportunity</u></strong></p></>

<p>The Directory list that is part of the website includes many of your competitors.  We offer an attractive feature, on a quarterly subscription basis,
    that allows you and your company to stand out from the other competitors.  We offer 3 Tiers described as follows:</p>
    <center><p><strong><u>Tier </u></strong></p></center>
    <div className="tier-card">
        <p className='mb-0'><strong>Platinum Tier:</strong> <span></span></p>
        <p className='mb-0'><strong>Description:</strong> <span>This would allow your name to be shown in bold print along with a photo, e.g. your cars.</span></p>
        <p className='mb-0'><strong>Quarterly Cost:</strong> <span>US $75</span></p>
        <p className='mb-0'><strong>Annual Cost:</strong> <span>US $270</span></p>
    </div>
    <div className="tier-card">
        <p className='mb-0'><strong>Gold Tier:</strong> <span></span></p>
        <p className='mb-0'><strong>Description:</strong> <span>This would allow your name to be shown in bold print.</span></p>
        <p className='mb-0'><strong>Quarterly Cost:</strong> <span>US $55</span></p>
        <p className='mb-0'><strong>Annual Cost:</strong> <span>US $198</span></p>
    </div>
    <div className="tier-card mb">
        <p className='mb-0'><strong>Silver Tier:</strong> <span></span></p>
        <p className='mb-0'><strong>Description:</strong> <span>This is a listing of your name.</span></p>
        <p className='mb-0'><strong>Quarterly Cost:</strong> <span>No charge</span></p>
    </div>
<p><strong>There is no charge for your company to be listed in the directory.</strong> When a potential Traveler inserts the name of your city and country in the website, the transportation providers will be presented in following manner: Platinum Tier listing would be shown first in alphabetical order;
    next would be Gold Tier listings in alphabetical order; and next would be Silver Tier listings in alphabetical order. </p>
<p>The Platinum and Gold Tiers require an automated quarterly renewal.  For those who would like an annual subscription, we offer a 10% discount from the quarterly cost.  You may choose to cancel your subscription at any time but no refunds are given after a payment has been made.</p> */}
          <p>Note: All fees and costs are subject to change without notice.</p>
          <p>
            <strong>
              <u>Complete Registration</u>
            </strong>
          </p>
          <div className="btn-complete-register">
            <input type="hidden" value="$this->uri->segment(2)" id="urlseg" />
            <p className="complete-reg-notify">
              Registration is not complete until (1) you accept this information
              and (2) you receive an email indicating "Approved"
            </p>
          </div>
          <p>
            By clicking “I ACCEPT”, you acknowledge that you understand and
            agree to the procedures and fees stated in this “Information for
            Transportation Providers”.
          </p>
        </>
      </div>

      <div className="page-button">
        <form id="myForm" className="tp-accrpt-form">
          <button
            className="submit_btn"
            type="button"
            id="agreebtn"
            onClick={updateFlag}
          >
            I Accept
          </button>
        </form>
      </div>
    </div>
  );
}

export default TpProviderInfo;
