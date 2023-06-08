import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./TpTerms.css";

const TpTerms = () => {
  const navigate = useNavigate();
  const [pageHeading, setPageHeading] = useState("");
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    const countryList = async () => {
      setLoader(false);
      setPageHeading(
        "How Transportation Providers and GlobalCarTreks.com work together to bring you new business"
      );
    };
    countryList();
  }, []);

  return (
    <>
      {loader ? (
        <div id="loaderring"></div>
      ) : (
        <div>
          <div className="back_header">
            <img
              src="https://img.icons8.com/material-outlined/24/000000/left.png"
              onClick={() => navigate("/register-option")}
            />
          </div>
          <div className="page-heading">
            <h3 style={{fontSize:"19px"}}>{pageHeading}</h3>
          </div>
          <div className="page-details">
            <div class="col-md-12">
              <div class="container reg_terms sec-info-content tpTerms">
                <ul>
                  <li>
                    <p>1) Register. It’s free. No contracts required.</p>
                  </li>
                  <li>
                    <p>
                      2) Traveler wants transportation services and makes a
                      request on the site or app.
                    </p>
                  </li>
                  <li>
                    <p>
                      3) You are notified of Traveler request. You accept or
                      decline.
                    </p>
                  </li>
                  <li>
                    <p>
                      4) When you provide a quote, you specify deposit and
                      cancel date if you want.
                    </p>
                  </li>
                  <li>
                    <p>
                      5) Transport the Traveler then tell us "trip is complete".
                    </p>
                  </li>
                  <li>
                    <p>
                      6) Payment. You do not take any payment from Traveler. All
                      financial transactions are processed through Stripe, the
                      international payment processor which does billions of
                      dollars of transactions each year. When a trip is booked
                      and before the trip starts, we make sure the Traveler has
                      funds to pay for your service. When you tell us trip is
                      complete, Stripe processes payment to your bank
                      immediately.
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="page-button" style={{ textAlign: "center" }}>
            <Link to="/TPJoin" style={{ fontWeight: "700" }}>
              Click here to see all the Benefits we offer you and to register.
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default TpTerms;
