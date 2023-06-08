import React, {useEffect} from 'react'
import { useNavigate, NavLink } from "react-router-dom"; 

function VendorInfo() {
    const navigate = useNavigate();
    const appType = localStorage.getItem('appType');

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

    return (
        <div>
             <div className='back_header'>
             <img src="https://img.icons8.com/material-outlined/24/000000/left.png" onClick={() => navigate('/vendor-dashboard')} />
            </div>   
            <div className="page-heading">
                <h3>Information for Transportation Providers</h3>
            </div>
            <div className="page-details">
            < >
            { appType == '1' ? 
              (
                <p className='paraxs'>Global CarTreks.com is intent on increasing the awareness of your Car and Driver Service to millions of American travelers to Europe.</p>
              ) 
              : 
              (
                <p className='paraxs'>Global CarTreks.com is intent on increasing the awareness of your Limousine Service to millions of travelers.</p>
              )
            }            
            <p className='paraxs'>On this page, we discuss how payments are made and processed through Global CarTreks.com. Please read the Terms of Use and Privacy Policy for more detail.</p>
            <p className='paraxs'><strong><u>Payments</u></strong></p> 
            <p className='paraxs'>All payments for your services booked through Global CarTreks.com by a Traveler will require payment by credit card and will go through Global CarTreks.com and is processed by Stripe,
            an internationally known payment processor.  If you would like to learn more about Stripe, go to <a href="https://stripe.com/en-in" target="_blank">www.stripe.com.</a> .
            <strong>This means you do not have to worry about taking cash or credit card payments. </strong>
             Once a Traveler has booked your service and you have provided the transportation, you only need to let us know, through your Global CarTreks.com dashboard, that your service has been completed.
            Payment to you, minus the Global CarTreks.com and Stripe fees, shown below, will be processed and deposited in the bank that you designated.</p>
            <p className='paraxs'><strong><u>Deposits</u></strong></p>
            <p className='paraxs'><strong>It is entirely your choice as to whether you request a deposit from the Traveler. </strong>If you have requested a deposit for your services, the deposit will be obtained from the Traveler and held by Stripe.  
                The stipulation for how the deposit will be applied will be in accordance with your quote, including your cancellation date that you gave to the Traveler at the time of the booking of the reservation. 
                For example, you may input a date that the deposit will be forfeited if the Traveler cancels the reservation after that date. In this instance, you would notify Global CarTreks.com and Stripe would forward the
                deposit minus the Global CarTreks.com and Stripe fees, shown below, to the bank you have designated.  If there was a cancellation prior to the specified input date, you would notify us and the deposit would be 
                refunded by Stripe to the Traveler.  If there was no cancellation, the deposit would be applied to the total amount of the fee agreed to by you and Traveler at the time the reservation was made.  Only one deposit can be requested for a trip.</p>
            <p className='paraxs'><strong><u>Credit Card Hold</u></strong></p>
            <p className='paraxs'>Twenty-four (24) hours prior to the commencing of the itinerary, a “Hold” will be placed on the Traveler’s credit card by Stripe to secure the full payment of the fee you agreed to with the Traveler at the time the reservation was made.</p>
            <p className='paraxs'><strong><u>Trips Five (5) Days or Longer</u></strong></p>
            <p className='paraxs'>For a trip five (5) days or longer, the Traveler must pay the full amount of the trip twenty-four (24) hours in advance of the beginning of the trip.</p>
            <p className='paraxs'><strong><u>Fees</u></strong></p>
            <p className='paraxs'>In order for Global CarTreks.com to, among other things, maintain and market the website, we must charge a fee based on the amount you charge the Traveler for your services as follows:</p>
                <table className="tp-table">
                <tbody>
                    <tr>
                        <th>
                        <p className='paraxs'><strong>Amount You Charge Traveler</strong></p>
                        </th>
                        <th>
                        <p className='paraxs'><strong> Our Fee</strong></p>
                        </th>
                        <th>
                            <p className='paraxs'><strong>An Example of Our Fee</strong></p>
                        </th>
                    </tr>
                    <tr className='border-bot'>
                        <td><p className='paraxs mb-small'>Up to US $500</p></td>
                        <td><p className='paraxs mb-small'>4%</p></td>
                        <td><p className='paraxs mb-small'>For US $500    = US $20</p></td>
                    </tr>
                    
                    <tr className='border-bot '>
                        <td><p className='paraxs mb-small p-10px'>US $501 – US $1,000</p></td>
                        <td><p className='paraxs mb-small p-10px'> 6%</p></td>
                        <td><p className='paraxs mb-small p-10px'>For US $750    = US $45</p></td>
                    </tr>
                    
                    <tr>
                        <td><p className='paraxs mb-small p-10px'>US $1,001 and up</p></td>
                        <td><p className='paraxs mb-small p-10px'> 8%</p></td>
                        <td><p className='paraxs mb-small p-10px'>For US $1,001 = US $80</p></td>
                    </tr>
                    </tbody>                         
                </table>
                {
                    appType == '1' ?
                    (
                        <p className='paraxs'>You will be  responsible for any taxes levied by any country or locality in which you operate as well as VAT and other fees to include, but not limited to, tolls and airport charges and the 
                Stripe (Payment Processor) fee of 2.9% of the total amount processed plus US$ 0.30 (Thirty cents).  <u> Tolls and airport charges must be included in a quote to a Traveler.</u></p>
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
                
                
    
<p className='paraxs'><strong><u>Tips</u></strong></p>
<p className='paraxs'><strong>If a Traveler gives you a tip, Global CarTreks.com will NOT apply our fee to it. You retain the full amount of any tip, minus the Stripe fee, that is provided to you.</strong></p>
<p className='paraxs'><strong><u><NavLink className='linking' to='/faq-vendor'>Frequently Asked Questions for Transportation Providers</NavLink></u></strong></p>
<p className='paraxs'>Please review this information for more understanding of how Global CarTreks.com works for you.</p>

{/* <><p className='paraxs'><strong><u>Advertising Opportunity</u></strong></p></>

<p className='paraxs'>The Directory list that is part of the website includes many of your competitors.  We offer an attractive feature, on a quarterly subscription basis,
    that allows you and your company to <strong>stand out</strong> from the other competitors.  We offer 3 Tiers described as follows:</p>
    <center><p className='paraxs'><strong><u>Tier </u></strong></p></center>
    <div className="tier-card">
        <p className='mb-0 paraxs'><strong>Platinum Tier</strong> <span></span></p>
        <p className='mb-0 paraxs'><strong>Description:</strong> <span>This would allow your name to be shown in bold print along with a photo, e.g. your cars.</span></p>
        <p className='mb-0 paraxs'><strong>Quarterly Cost:</strong> <span>US $75</span></p>
        <p className='mb-0 paraxs'><strong>Annual Cost:</strong> <span>US $270</span></p>
    </div>
    <div className="tier-card">
        <p className='mb-0 paraxs'><strong>Gold Tier</strong> <span></span></p>
        <p className='mb-0 paraxs'><strong>Description:</strong> <span>This would allow your name to be shown in bold print.</span></p>
        <p className='mb-0 paraxs'><strong>Quarterly Cost:</strong> <span>US $55</span></p>
        <p className='mb-0 paraxs'><strong>Annual Cost:</strong> <span>US $198</span></p>
    </div>
    <div className="tier-card mb">
        <p className='mb-0 paraxs'><strong>Silver Tier</strong> <span></span></p>
        <p className='mb-0 paraxs'><strong>Description:</strong> <span>This is a listing of your name.</span></p>
        <p className='mb-0 paraxs'><strong>Quarterly Cost:</strong> <span>No charge</span></p>
    </div>
<p className='paraxs'><strong>There is no charge for your company to be listed in the directory.</strong> When a potential Traveler inserts the name of your city and country in the website, the transportation providers will be presented in following manner: Platinum Tier listing would be shown first in alphabetical order;
    next would be Gold Tier listings in alphabetical order; and next would be Silver Tier listings in alphabetical order. </p>
<p className='paraxs'>The Platinum and Gold Tiers require an automated quarterly renewal.  For those who would like an annual subscription, we offer a 10% discount from the quarterly cost.  You may choose to cancel your subscription at any time but no refunds are given after a payment has been made.</p> */}
<p className='paraxs'>Note: All fees and costs are subject to change without notice.</p>
{/* <p className='paraxs'><strong><u>Complete Registration</u></strong></p>
                <div className="btn-complete-register">
        
        <input type="hidden" value="$this->uri->segment(2)" id="urlseg" />
        <p className="complete-reg-notify paraxs">Registration is not complete until you accept this information</p>
         </div>
         <p className='paraxs'>By clicking “I ACCEPT”, you acknowledge that you understand and agree to the procedures and fees stated in this “Information for Transportation Providers”.</p> */}
        </> 
            </div>           
        </div>
    )
}

export default VendorInfo