import React, { useEffect, useState } from "react";
import Axios from "axios";
import { API_BASE_URL } from "../../../Config/Config";
import { BASE_URL } from "../../../Config/BaseUrl";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import useValidator from "../../Sites/Register/TPRegisterFormValidator";
import { getLocalStorageAuth } from "../../../Auth/Auth.service";
import { ToastContainer, toast } from "react-toastify";
import BottomNavbar from "../../../Components/Common/BottomNavbar";
import TopNavWhite from "../../../Components/Common/TopNavWhite";
import UserHeader from "../Header/UserHeader";
import Modal from "react-bootstrap/Modal";
import ModalHeader from "react-bootstrap/esm/ModalHeader";
import "./tabs.css";
import moment from "moment";
import "moment-timezone";
import $ from "jquery";
import { Alert } from "bootstrap";
import ReactTooltip from "react-tooltip";
import Loader from "../../../Components/Common/Loader";

function ManageQuotation() {
  const navigate = useNavigate();
  const API_BASE_URL = BASE_URL()
  const param = useParams();
  const auth = getLocalStorageAuth();
  console.log(auth.id);
  const [requestCount, setRequestCount] = useState([]);
  const [submittedQuote, setSubmittedQuote] = useState([]);
  const [receivedQuote, setReceivedQuote] = useState([]);
  const [compareQuote, setCompareQuote] = useState([]);
  const [compareDetails, setCompareDetails] = useState([]);
  const [transportProviders, setTransportProviders] = useState([]);
  const [expiredQuotations, setExpiredQuotations] = useState([]);
  const [rejectedQuotations, setRejectedQuotations] = useState([]);
  const [rejectQuoteModal, setRejectQuoteModal] = useState(false);
  const [validator, showValidationMessage] = useValidator();
  const [qid, setQId] = useState("");
  const [qsid, setQsId] = useState("");
  const [vid, setVId] = useState("");
  const [rid, setRId] = useState("");
  const [vendorList, setVendorList] = useState("");
  const [tpQId, setTpQId] = useState("");
  const [tpQsId, setTpQsId] = useState("");
  const [tpVId, setTpVId] = useState("");
  const [tpRId, setTpRId] = useState("");
  const [index, setIndex] = useState("");
  const [selectTP, setSelectTP] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isClicked2, setIsClicked2] = useState(false);
  const [isClicked3, setIsClicked3] = useState(false);
  const [isPayment, setIsPayment] = useState(false);
  const [isTransportation, setIsTransportation] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [clearificationBtn, setClearificationBtn] = useState(false);
  const [clearQId, setClearQId] = useState("");
  const [clearQsId, setClearQsId] = useState("");
  const [clearVId, setClearVId] = useState("");
  const [clearUId, setClearUId] = useState("");
  const [msgText, setMsgText] = useState([]);
  const [quoteIndex, setQuoteIndex] = useState("");
  const [compareIndex, setCompareIndex] = useState("");
  const [tpDetailsIndex, setTpDetailsIndex] = useState("");
  const [paymentIndex, setPaymentIndex] = useState("");
  const [loader, setLoader] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // const [receiveChkSts, setReceiveChkSts] = useState();
  // const [receiveActiveSts, setReceiveActiveSts] = useState( );
  const [inputValues, setInputValues] = useState({
    clari_txt: "",
  });

  const showModal = () => {
    setIsOpen(true);
  };

  const showRejectModal = (q_id, qs_id, v_id, r_id) => {
    setDisabled(true);
    var countCheckbox = $("input[name='tpQuotes[]']:checked").length;

    if (countCheckbox > 1) {
      toast.error("Select one chekbox at a time");
      setTimeout(() => {
        setDisabled(false);
      }, 4000);
    } else if (countCheckbox < 1) {
      toast.error("Select a checkbox");
      setTimeout(() => {
        setDisabled(false);
      }, 4000);
    } else {
      setQId(q_id);
      setQsId(qs_id);
      setVId(v_id);
      setRId(r_id);
      setRejectQuoteModal(true);
      setTimeout(() => {
        setDisabled(false);
      }, 4000);
    }
  };

  const showRejectModal1 = (q_id, qs_id, v_id, r_id) => {
    setDisabled(true);
    setQId(q_id);
    setQsId(qs_id);
    setVId(v_id);
    setRId(r_id);
    setRejectQuoteModal(true);
    setTimeout(() => {
      setDisabled(false);
    }, 4000);
  };

  var vIDs = [];
  const compareNow = (e) => {
    e.preventDefault();
    setDisabled(true);

    var countCheckbox = $("input[name='tpQuotes[]']:checked").length;

    if (countCheckbox < 2) {
      toast.error("Select atleast two Transportation Providers");
      setTimeout(() => {
        setDisabled(false);
      }, 4000);
    } else {
      $("input:checkbox[name='tpQuotes[]']:checked").each(function () {
        vIDs.push($(this).val());
      });
      var new_string = vIDs.join(",");

      let formData = new FormData();
      formData.append("comparecheck", new_string);
      formData.append("quot_id", tpQId);
      formData.append("user_id", tpRId);

      Axios.post(API_BASE_URL + "api/insert_compare", formData).then((res) => {
        if (res.data.status == true) {
          navigate("/manage-Quotation/3");
          window.location.reload();
        } else {
          toast.error("Something went wrong");
          setTimeout(() => {
            setDisabled(false);
          }, 4000);
        }
      });
    }
  };

  const handleRemoveRequest = (q_id, i) => {
    $("#removeReq" + i).prop("disabled", true);
    Axios.post(API_BASE_URL + "api/cancel_req_by_user/" + q_id).then((res) => {
      if (res.data.status == true) {
        toast.success(res.data.data);
        setTimeout(() => {
          $("#removeReq" + q_id).prop("disabled", false);
          window.location.reload();
        }, 3000);
      } else {
        toast.error(res.data.data);
        setTimeout(() => {
          $("#removeReq" + q_id).prop("disabled", false);
        }, 3000);
      }
    });
  };

  const hideRejectModal = () => {
    setRejectQuoteModal(false);
  };

  const hideModal = () => {
    setIsOpen(false);
  };

  const hideClearification = () => {
    setClearificationBtn(false);
    showValidationMessage(false);
  };

  const handlePaymentClick = (i) => {
    setIsClicked3(!isClicked3);
    setIsPayment(!isPayment);
    setIsClicked2(false);
    setIsTransportation(false);
    setPaymentIndex(i);
  };

  const handleCompareQuotes = (id, qId, i) => {
    setIsClicked(!isClicked);
    setCompareIndex(qId);

    setIsLoading(true);

    const compareDetails = async () => {
      const response = await Axios(
        API_BASE_URL + "api/get_compare_details/" + id + "/" + qId
      );
      if (response.data.status === true) {
        console.log('compare_details', response);
        setCompareDetails(response.data.data);
        setIsLoading(false);
      }
    };

    compareDetails();
  };

  const handleReviewQuotes = (r_id, q_id, i) => {
    setIsClicked(!isClicked);
    setIsPayment(!isPayment);
    setIsClicked2(false);
    setIsTransportation(false);
    setQuoteIndex(q_id);

    setIsLoading(true);

    const vendorList = async () => {
      const response = await Axios(
        API_BASE_URL + "api/get_vendor_quotations/" + r_id + "/" + q_id
      );
      if (response.data.status === true) {
        // console.log('vendor list', response);

        setVendorList(response.data.data);
        setIsLoading(false);
      }
    };

    vendorList();
  };

  useEffect(() => { }, []);

  const getTpValues = (qId, qsId, vId, rId, i) => {
    if ($("#selectTp" + i).is(":checked")) {
      setTpQId(qId);
      setTpQsId(qsId);
      setTpVId(vId);
      setTpRId(rId);
    }
  };

  const handleTPClick = (i) => {
    setIsClicked(false);
    setIsPayment(false);
    setIsClicked2(!isClicked2);
    setIsTransportation(!isTransportation);
    setTpDetailsIndex(i);
  };

  const openPaymentPage = (qId, qsId) => {
    setDisabled(true);
    var countCheckbox = $("input[name='tpQuotes[]']:checked").length;

    if (countCheckbox > 1) {
      toast.error("Select one chekbox at a time");
      setTimeout(() => {
        setDisabled(false);
      }, 4000);
    } else if (countCheckbox < 1) {
      toast.error("Select a checkbox");
      setTimeout(() => {
        setDisabled(false);
      }, 4000);
    } else {
      sessionStorage.setItem("qId", qId);
      sessionStorage.setItem("qsId", qsId);
      navigate("/payment-screen");
    }
  };

  const openPaymentPage1 = (qId, qsId) => {
    setDisabled(true);
    sessionStorage.setItem("qId", qId);
    sessionStorage.setItem("qsId", qsId);
    navigate("/payment-screen");
    setTimeout(() => {
      setDisabled(false);
    }, 4000);
  };

  const openComparePaymentPage = (qId, qsId) => {
    sessionStorage.setItem("qId", qId);
    sessionStorage.setItem("qsId", qsId);
    navigate("/payment-screen");
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputValues({ ...inputValues, [name]: value });
  };

  const reset = () => {
    $("#chat-text").html("");
  };

  const showClearification = (qId, qsId, vId, uId) => {
    setDisabled(true);
    var countCheckbox = $("input[name='tpQuotes[]']:checked").length;

    if (countCheckbox > 1) {
      toast.error("Select one chekbox at a time");
      setTimeout(() => {
        setDisabled(false);
      }, 4000);
    } else if (countCheckbox < 1) {
      toast.error("Select a checkbox");
      setTimeout(() => {
        setDisabled(false);
      }, 4000);
    } else {
      setClearQId(qId);
      setClearQsId(qsId);
      setClearVId(vId);
      setClearUId(uId);

      const clarificationMsg = async () => {
        const response = await Axios(
          API_BASE_URL +
          "api/get_clarification_msg/" +
          qsId +
          "/" +
          qId +
          "/" +
          vId +
          "/" +
          uId
        );
        // console.log(response.data.output)
        if (response.data.status === true) {
          // console.log(response);
          setMsgText(response.data.output);
        } else {
          setMsgText([]);
        }
      };

      clarificationMsg();
      setClearificationBtn(true);
      setTimeout(() => {
        setDisabled(false);
      }, 4000);
    }
  };

  const showClearification1 = (qId, qsId, vId, uId) => {
    setClearQId(qId);
    setClearQsId(qsId);
    setClearVId(vId);
    setClearUId(uId);

    const clarificationMsg = async () => {
      const response = await Axios(
        API_BASE_URL +
        "api/get_clarification_msg/" +
        qsId +
        "/" +
        qId +
        "/" +
        vId +
        "/" +
        uId
      );
      // console.log(response.data.output)
      if (response.data.status === true) {
        // console.log(response);
        setMsgText(response.data.output);
      }
    };

    clarificationMsg();
    setClearificationBtn(true);
  };

  const handleClearification = (e) => {
    e.preventDefault();
    $("#sendClarification").prop("disabled", true);

    const formData = new FormData(e.target);
    if (validator.allValid()) {
      Axios.post(API_BASE_URL + "api/clarification_msg", formData).then(
        (res) => {
          // console.log("Status: ", res);
          if (res.data.status == true) {
            setInputValues({
              clari_txt: "",
            });
            hideClearification();
            $("#sendClarification").prop("disabled", false);
            toast.success(res.data.data);
          } else {
            $("#sendClarification").prop("disabled", false);
            toast.error(res.data.data);
          }
        }
      );
    } else {
      $("#sendClarification").prop("disabled", false);
      showValidationMessage(true);
    }
  };

  const handleSubmitQuoteCheck = (i, qId, status) => {
    $("#u_check" + i).attr("disabled", true);
    Axios.post(
      API_BASE_URL +
      "api/active_deactive_submit_quote" +
      "/" +
      qId +
      "/" +
      status
    ).then((res) => {
      if (res.data.status == true) {
        if (res.data.active_status == 1) {
          setTimeout(() => {
            $("#u_check" + i).attr("disabled", false);
          }, 5000);
          document.getElementById("u_check" + i).checked = false;
          document.getElementById("active_status" + i).innerHTML = "Inactive";
          document.getElementById("removeReq" + i).disabled = true;
          document.getElementById("quoteRec" + i).disabled = true;
          document.getElementById("removeReq" + i).style.opacity = "0.7";
          document.getElementById("quoteRec" + i).style.opacity = "0.7";
          toast.success("Quote deactivated successfully");
        } else {
          setTimeout(() => {
            $("#u_check" + i).attr("disabled", false);
          }, 5000);
          document.getElementById("u_check" + i).checked = true;
          document.getElementById("active_status" + i).innerHTML = "Active";
          document.getElementById("removeReq" + i).disabled = false;
          document.getElementById("quoteRec" + i).disabled = false;
          document.getElementById("removeReq" + i).style.opacity = "";
          document.getElementById("quoteRec" + i).style.opacity = "";
          toast.success("Quote activated successfully");
        }
      } else {
        setTimeout(() => {
          $("#u_check" + i).attr("disabled", false);
        }, 5000);
        toast.error("Something went wrong");
      }
    });
  };

  const handleReceiveQuoteCheck = (i, qId, status) => {
    $("#u_check1" + i).attr("disabled", true);
    Axios.post(
      API_BASE_URL +
      "api/active_deactive_recive_quot" +
      "/" +
      qId +
      "/" +
      status
    ).then((res) => {
      if (res.data.status == true) {
        if (res.data.active_status == 1) {
          setTimeout(() => {
            $("#u_check1" + i).attr("disabled", false);
          }, 5000);
          document.getElementById("u_check1" + i).checked = false;
          document.getElementById("active_status1" + i).innerHTML = "Inactive";
          document.getElementById("reviewQuotes" + i).style.pointerEvents =
            "none";
          document.getElementById("reviewQuotes" + i).style.opacity = "0.7";
          toast.success("Quote deactivated successfully");
        } else {
          setTimeout(() => {
            $("#u_check1" + i).attr("disabled", false);
          }, 5000);
          document.getElementById("u_check1" + i).checked = true;
          document.getElementById("active_status1" + i).innerHTML = "Active";
          document.getElementById("reviewQuotes" + i).style.pointerEvents = "";
          document.getElementById("reviewQuotes" + i).style.opacity = "";
          toast.success("Quote activated successfully");
        }
      } else {
        setTimeout(() => {
          $("#u_check1" + i).attr("disabled", false);
        }, 5000);
        toast.error("Something went wrong");
      }
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    const submittedQuote = async () => {
      const response = await Axios(
        API_BASE_URL + "api/submit_request/" + auth.id
      );
      console.log("submit_req", response);
      setSubmittedQuote(response.data.data);
      setRequestCount(response.data.request_count);
      setLoader(false);
    };

    const receivedQuote = async () => {
      const response = await Axios(
        API_BASE_URL + "api/recived_quotations/" + auth.id
      );
      console.log("rec_quote", response);
      setReceivedQuote(response.data.data);
    };

    const compareQuote = async () => {
      const response = await Axios(
        API_BASE_URL + "api/compare_project/" + auth.id
      );
      console.log('compare_quote', response);
      setCompareQuote(response.data.data);
    };

    const transportProviders = async () => {
      const response = await Axios(
        API_BASE_URL + "api/selected_vendor_user/" + auth.id
      );
      // console.log(response.data.data);
      setTransportProviders(response.data.data);
    };

    const expiredQuotations = async () => {
      const response = await Axios(
        API_BASE_URL + "api/expired_quotations/" + auth.id
      );
      // console.log('expired', response.data.data);
      setExpiredQuotations(response.data.data);
    };

    const rejectedQuotations = async () => {
      const response = await Axios(
        API_BASE_URL + "api/get_vendor_rejected_quotations/" + auth.id
      );
      console.log("rejected", response.data.data);
      setRejectedQuotations(response.data.data);
    };

    submittedQuote();
    receivedQuote();
    compareQuote();
    transportProviders();
    expiredQuotations();
    rejectedQuotations();
  }, []);

  //   if (param.tab_id == 2) {
  //     var position = $(".tabs li").position();
  //     var corresponding = "contentTwo";
  //     // eslint-disable-next-line no-restricted-globals
  //     scroll = $(".tabs").scrollLeft();
  //     $(".tabs").animate(
  //       {
  //         // eslint-disable-next-line no-restricted-globals
  //         scrollLeft: scroll + 180 - 90,
  //       },
  //       200
  //     );
  //     $(".tabContent .tabsdiv").hide();

  //     $(".tabsdiv.contentTwo").toggle();
  //   } else if (param.tab_id == 3) {
  //     var position = $(".tabs li").position();
  //     // console.log(position);
  //     var corresponding = $(".tabs li").data("id");
  //     // eslint-disable-next-line no-restricted-globals
  //     scroll = $(".tabs").scrollLeft();
  //     $(".tabs").animate(
  //       {
  //         // eslint-disable-next-line no-restricted-globals
  //         scrollLeft: scroll + 350 - 90,
  //       },
  //       200
  //     );
  //     $(".tabContent .tabsdiv").hide();
  //     $(".tabsdiv.contentThree").toggle();
  //   } else if (param.tab_id == 4) {
  //     var position = $(".tabs li").position();
  //     // console.log(position);
  //     var corresponding = $(".tabs li").data("id");
  //     // eslint-disable-next-line no-restricted-globals
  //     scroll = $(".tabs").scrollLeft();
  //     $(".tabs").animate(
  //       {
  //         // eslint-disable-next-line no-restricted-globals
  //         scrollLeft: scroll + 530 - 90,
  //       },
  //       200
  //     );
  //     $(".tabContent .tabsdiv").hide();
  //     $(".tabsdiv.contentFour").toggle();
  //   } else if (param.tab_id == 5) {
  //     var position = $(".tabs li").position();
  //     // console.log(position);
  //     var corresponding = $(".tabs li").data("id");
  //     // eslint-disable-next-line no-restricted-globals
  //     scroll = $(".tabs").scrollLeft();
  //     $(".tabs").animate(
  //       {
  //         // eslint-disable-next-line no-restricted-globals
  //         scrollLeft: scroll + 680 - 90,
  //       },
  //       200
  //     );
  //     $(".tabContent .tabsdiv").hide();
  //     $(".tabsdiv.contentFive").toggle();
  //   } else if (param.tab_id == 6) {
  //     var position = $(".tabs li").position();
  //     // console.log(position);
  //     var corresponding = $(".tabs li").data("id");
  //     // eslint-disable-next-line no-restricted-globals
  //     scroll = $(".tabs").scrollLeft();
  //     $(".tabs").animate(
  //       {
  //         // eslint-disable-next-line no-restricted-globals
  //         scrollLeft: scroll + 680 - 90,
  //       },
  //       200
  //     );
  //     $(".tabContent .tabsdiv").hide();
  //     $(".tabsdiv.contentSix").toggle();
  //   } else {
  //     //Scrollable Tabs
  //     $(".tabContent .tabsdiv:not(:first)").toggle();

  //     // hide the previous button
  //     $(".previous").hide();

  //     $(".tabs li").on("click", function () {
  //       // if ($(this).is(':last-child')) {
  //       //     $('.next').hide();
  //       // } else {
  //       //     $('.next').show();
  //       // }

  //       // if ($(this).is(':first-child')) {
  //       //     $('.previous').hide();
  //       // } else {
  //       //     $('.previous').show();
  //       // }

  //       var position = $(this).position();
  //       var corresponding = $(this).data("id");
  //       // console.log(corresponding);
  //       // scroll to clicked tab with a little gap left to show previous tabs
  //       // eslint-disable-next-line no-restricted-globals
  //       scroll = $(".tabs").scrollLeft();
  //       // console.log(scroll)
  //       $(".tabs").animate(
  //         {
  //           // eslint-disable-next-line no-restricted-globals
  //           scrollLeft: scroll + position.left - 90,
  //         },
  //         200
  //       );

  //       // hide all content divs
  //       $(".tabContent .tabsdiv").hide();

  //       // show content of corresponding tab
  //       $(".tabsdiv." + corresponding).toggle();

  //       // remove active class from currently not active tabs
  //       $(".tabs li").removeClass("active");

  //       // add active class to clicked tab
  //       $(this).addClass("active");
  //     });
  //   }

  //     //Scrollable Tabs
  //     // $('.tabContent .tabsdiv:not(:first)').toggle();

  // hide the previous button
  //   $(".previous").hide();

  //   $(".tabs li").on("click", function () {
  //     console.log("clicked");
  //     // if ($(this).is(':last-child')) {
  //     //     $('.next').hide();
  //     // } else {
  //     //     $('.next').show();
  //     // }

  //     // if ($(this).is(':first-child')) {
  //     //     $('.previous').hide();
  //     // } else {
  //     //     $('.previous').show();
  //     // }

  //     var position = $(this).position();
  //     var corresponding = $(this).data("id");
  //     // console.log(corresponding);

  //     // scroll to clicked tab with a little gap left to show previous tabs
  //     // eslint-disable-next-line no-restricted-globals
  //     scroll = $(".tabs").scrollLeft();
  //     // console.log(scroll)
  //     $(".tabs").animate(
  //       {
  //         // eslint-disable-next-line no-restricted-globals
  //         left: "-=50px",
  //       },
  //       "slow"
  //     );

  //     // hide all content divs
  //     $(".tabContent .tabsdiv").hide();

  //     // show content of corresponding tab
  //     $(".tabsdiv." + corresponding).toggle();

  //     // remove active class from currently not active tabs
  //     $(".tabs li").removeClass("active");

  //     // add active class to clicked tab
  //     $(this).addClass("active");

  //     // if(corresponding == 'contentOne'){
  //     //     navigate('/manage-Quotation/1');
  //     // } else if(corresponding == 'contentTwo'){
  //     //     navigate('/manage-Quotation/2');
  //     // } else if(corresponding == 'contentThree'){
  //     //     navigate('/manage-Quotation/3');
  //     // } else if(corresponding == 'contentFour'){
  //     //     navigate('/manage-Quotation/4');
  //     // } else if(corresponding == 'contentFive'){
  //     //     navigate('/manage-Quotation/5');
  //     // } else if(corresponding == 'contentSix'){
  //     //     navigate('/manage-Quotation/6');
  //     // }
  //   });

  // $('div a').on('click',function(e){
  //     e.preventDefault();
  //     // $('li.active').next('li').trigger('click');
  // });
  // $('.next').on('click',function(e){
  //     e.preventDefault();
  //     $('li.active').next('li').trigger('click');
  // });
  // $('.previous').on('click',function(e){
  //     e.preventDefault();
  //     $('li.active').prev('li').trigger('click');
  // });

  // const viewCompQuotes = () => {

  //     const compareQuote = async () => {
  //         const response = await Axios({ API_BASE_URL } + 'api/compare_project/' + auth.id);
  //         // console.log('compare_quote', response.data.data);
  //         setCompareQuote(response.data.data);
  //     };

  //     const vendorName = async () => {
  //         const response = await Axios({ API_BASE_URL } + 'api/getQuoteSubmittedVendorNames/' + auth.id);
  //         // console.log('vendor_name', response);
  //         // setCompareQuote(response.data.data);
  //     };

  //     compareQuote();
  //     vendorName();
  // }

  const handleRejectQuoteSubmit = (e) => {
    e.preventDefault();
    $("#rejectQuote").prop("disabled", true);

    const formData = new FormData(e.target);
    Axios.post(API_BASE_URL + "api/userrejectquote", formData).then((res) => {
      if (res.data.status == true) {
        hideRejectModal();
        toast.success(res.data.message);
        setTimeout(() => {
          $("#rejectQuote").prop("disabled", false);
          navigate("/manage-Quotation/2");
          window.location.reload();
        }, 3000);
      } else {
        $("#rejectQuote").prop("disabled", false);
        toast.error(res.data.message);
      }
    });
  };

  const navigateToRecQuote = (count) => {
    if (count > 0) {
      navigate("/manage-Quotation/2");
      window.location.reload();
    }
  };

  const errorMsg = {
    color: "red",
  };

  // Close tool tip

  function toolTipClose(event) {
    // Get a reference to the tooltip
    var tooltip = document.getElementById('foo-foo56');

    // Check if the click target is not the tooltip and not its trigger
    if (
      tooltip &&
      tooltip.classList.contains('show')
    ) {
      // Remove the "show" class from the tooltip
      tooltip.classList.remove('show');
    }
  }

  useEffect(() => {
    document.addEventListener('click', toolTipClose);

    return () => {
      document.removeEventListener('click', toolTipClose);
    };
  }, []);

  return (
    <>
      {loader ? (
        <div id="loaderring"></div>
      ) : (
        <div>
          <ToastContainer />
          <div className="display-none">
            <UserHeader />
          </div>
          <div className="tabs_area">
            <TopNavWhite title={"Manage Quotations"} user={1} />
            <div className="tabsWrppers">
              <div className="upper_tabs">
                <ul className="nav nav-tabs tabs" id="myTab" role="tablist">
                  <li
                    data-id="contentOne"
                    className="nav-item"
                    role="presentation"
                  >
                    {/* <NavLink className="inner_tab" to="/manage-Quotation/1"> */}
                    <button
                      className={`nav-link ${param.tab_id == 1 ? "active" : ""
                        }`}
                      id="home-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#Submited"
                      type="button"
                      role="tab"
                      aria-controls="home"
                      aria-selected="true"
                    >
                      Submitted Requests
                    </button>
                    {/* </NavLink> */}
                  </li>
                  <li
                    data-id="contentTwo"
                    className="nav-item"
                    role="presentation"
                  >
                    {/* <NavLink className="inner_tab" to="/manage-Quotation/2"> */}
                    <button
                      className={`nav-link ${param.tab_id == 2 ? "active" : ""
                        }`}
                      id="profile-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#Received"
                      type="button"
                      role="tab"
                      aria-controls="Received"
                      aria-selected="false"
                    >
                      Received Quotations
                    </button>
                    {/* </NavLink> */}
                  </li>
                  <li
                    data-id="contentThree"
                    className="nav-item"
                    role="presentation"
                  >
                    {/* <NavLink className="inner_tab" to="/manage-Quotation/3"> */}
                    <button
                      className={`nav-link ${param.tab_id == 3 ? "active" : ""
                        }`}
                      id="contact-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#Compare"
                      type="button"
                      role="tab"
                      aria-controls="Compare"
                      aria-selected="false"
                    >
                      Compare Quotations
                    </button>
                    {/* </NavLink> */}
                  </li>
                  <li
                    data-id="contentFour"
                    className="nav-item"
                    role="presentation"
                  >
                    {/* <NavLink className="inner_tab" to="/manage-Quotation/4"> */}
                    <button
                      className={`nav-link ${param.tab_id == 4 ? "active" : ""
                        }`}
                      id="tp-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#TpProvider"
                      type="button"
                      role="tab"
                      aria-controls="TpProvider"
                      aria-selected="false"
                    >
                      Accepted Quotes
                    </button>
                    {/* </NavLink> */}
                  </li>
                  <li
                    data-id="contentFive"
                    className="nav-item"
                    role="presentation"
                  >
                    {/* <NavLink className="inner_tab" to="/manage-Quotation/5"> */}
                    <button
                      className={`nav-link ${param.tab_id == 5 ? "active" : ""
                        }`}
                      id="expired-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#expired"
                      type="button"
                      role="tab"
                      aria-controls="expired"
                      aria-selected="false"
                    >
                      Expired Quotations
                    </button>
                    {/* </NavLink> */}
                  </li>
                  <li
                    data-id="contentSix"
                    className="nav-item"
                    role="presentation"
                  >
                    {/* <NavLink className="inner_tab" to="/manage-Quotation/6"> */}
                    <button
                      className={`nav-link ${param.tab_id == 6 ? "active" : ""
                        }`}
                      id="rejected-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#rejected"
                      type="button"
                      role="tab"
                      aria-controls="rejected"
                      aria-selected="false"
                    >
                      Rejected Quotations
                    </button>
                    {/* </NavLink> */}
                  </li>
                </ul>
              </div>
              <div className="tab-content" id="myTabContent">
                <div
                  className={`tab-pane fade ${param.tab_id == 1 ? "show active" : ""
                    }`}
                  id="Submited"
                  role="tabpanel"
                  aria-labelledby="home-tab"
                >
                  <div
                    className="accordion accordion-flush"
                    id="accordionFlushExample"
                  >
                    {Array.isArray(submittedQuote) && submittedQuote.length ? (
                      submittedQuote.map((item, i) => {
                        const submitChkSts = item.is_active == 1 ? true : false;
                        const submitActiveSts =
                          item.is_active == 1 ? "Active" : "Inactive";

                        return (
                          <div className="accordion-item">
                            <h2
                              className="accordion-header"
                              id="flush-headingOne"
                            >
                              <button
                                className="accordion-button collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target={`#flush-collapseOne${i}`}
                                aria-expanded="false"
                                aria-controls="flush-collapseOne"
                              >
                                <div className="title_data">
                                  <p>Trip Title</p>
                                  <span>{item.q_title}</span>
                                  <div className="title_footer">
                                    <div className="date_area">
                                      <img src="https://img.icons8.com/material-outlined/24/000000/planner.png" />
                                      <p>
                                        {moment(item.q_start_date).format(
                                          "MMM D"
                                        )}{" "}
                                        -{" "}
                                        {moment(item.q_end_date).format(
                                          "MMM D, YYYY"
                                        )}
                                      </p>
                                    </div>
                                    <div className="date_area">
                                      <img src="https://img.icons8.com/material-rounded/24/000000/marker.png" />
                                      <p>{item.cname}</p>
                                    </div>
                                  </div>
                                </div>
                              </button>
                            </h2>
                            <div
                              id={`flush-collapseOne${i}`}
                              className="accordion-collapse collapse"
                              aria-labelledby="flush-headingOne"
                              data-bs-parent="#accordionFlushExample"
                            >
                              <div className="accordion-body">
                                <div className="card_body">
                                  <div className="label_group">
                                    <p>Trip Title</p>
                                    <span>{item.q_title}</span>
                                  </div>
                                  <div className="label_group">
                                    <p>Additional Details/Questions</p>
                                    <span>{item.q_desc}</span>
                                  </div>
                                  <div className="label_group">
                                    <p>No. of People </p>
                                    <span>{item.q_people}</span>
                                  </div>
                                  <div className="label_group">
                                    <p>No. of Luggage</p>
                                    <span>{item.q_luggage}</span>
                                  </div>
                                  <div className="label_group">
                                    <p>Start Date</p>
                                    <span>
                                      {moment(item.q_start_date).format(
                                        "MMM D, YYYY"
                                      )}
                                    </span>
                                  </div>
                                  <div className="label_group">
                                    <p>End Date</p>
                                    <span>
                                      {moment(item.q_end_date).format(
                                        "MMM D, YYYY"
                                      )}
                                    </span>
                                  </div>
                                  <div className="label_group">
                                    <p>Selected Transportation Provider</p>
                                    <span>{item.v_name}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {item.is_delete == 1 ? (
                              <div className="title_bottom">
                                <p className="small-p closed-trip">
                                  Trip closed{" "}
                                </p>
                              </div>
                            ) : (
                              <div className="title_bottom">
                                <div className="checked">
                                  <input
                                    className="input-field"
                                    type="checkbox"
                                    name="u_check"
                                    id={`u_check${i}`}
                                    checked={submitChkSts}
                                    onChange={() =>
                                      handleSubmitQuoteCheck(
                                        i,
                                        item.q_id,
                                        item.is_active
                                      )
                                    }
                                  />
                                  <label
                                    className="paraxs"
                                    for={`u_check${i}`}
                                    id={`active_status${i}`}
                                  >
                                    {submitActiveSts}
                                  </label>
                                </div>
                                <button
                                  className="outline"
                                  id={`removeReq${i}`}
                                  disabled={item.is_active == 0 ? true : false}
                                  style={
                                    item.is_active == 0
                                      ? { opacity: "0.7" }
                                      : {}
                                  }
                                  onClick={() =>
                                    handleRemoveRequest(item.q_id, i)
                                  }
                                >
                                  Remove
                                </button>
                                <button
                                  className="filled"
                                  id={`quoteRec${i}`}
                                  disabled={item.is_active == 0 ? true : false}
                                  style={
                                    item.is_active == 0
                                      ? { opacity: "0.7" }
                                      : {}
                                  }
                                  onClick={() =>
                                    navigateToRecQuote(item.counter_recived)
                                  }
                                >
                                  {item.counter_recived > 0
                                    ? item.counter_recived
                                    : 0}{" "}
                                  Quotes Received
                                </button>
                                {/* || requestCount == 0  */}
                              </div>
                            )}
                            {/* </div> */}
                          </div>
                        );
                      })
                    ) : (
                      <div className="no-data-container">
                        <div className="no-data">
                          <h3 className="heading4">No Data Found</h3>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div
                  className={`tab-pane fade ${param.tab_id == 2 ? "show active" : ""
                    }`}
                  id="Received"
                  role="tabpanel"
                  aria-labelledby="profile-tab"
                >
                  {Array.isArray(receivedQuote) && receivedQuote.length ? (
                    receivedQuote.map((item, i) => {
                      const receiveChkSts =
                        item.request_is_active == 1 ? true : false;
                      const receiveActiveSts =
                        item.request_is_active == 1 ? "Active" : "Inactive";

                      return (
                        <div className="accordion-item">
                          <h2
                            className="accordion-header"
                            id="flush-headingOne"
                          >
                            <button
                              className="accordion-button collapsed"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target={`#flush-collapseTwo${i}`}
                              aria-expanded="false"
                              aria-controls="flush-collapseOne"
                            >
                              <div className="title_data">
                                <p>Trip Title</p>
                                <span>{item.q_title}</span>
                                <div className="title_footer">
                                  <div className="date_area">
                                    <img src="https://img.icons8.com/material-outlined/24/000000/planner.png" />
                                    <p>
                                      {moment(item.q_start_date).format(
                                        "MMM D"
                                      )}{" "}
                                      -{" "}
                                      {moment(item.q_end_date).format(
                                        "MMM D, YYYY"
                                      )}
                                    </p>
                                  </div>
                                  <div className="date_area">
                                    <img src="https://img.icons8.com/material-rounded/24/000000/marker.png" />
                                    <p>{item.country_name}</p>
                                  </div>
                                </div>
                              </div>
                            </button>
                          </h2>
                          <div
                            id={`flush-collapseTwo${i}`}
                            className="accordion-collapse collapse"
                            aria-labelledby="flush-headingOne"
                            data-bs-parent="#accordionFlushExample"
                          >
                            <div className="accordion-body">
                              <div className="card_body">
                                <div className="label_group">
                                  <p>Trip Title</p>
                                  <span>{item.q_title}</span>
                                </div>
                                <div className="label_group">
                                  <p>Additional Details/Questions</p>
                                  <span>{item.q_desc}</span>
                                </div>
                                <div className="label_group">
                                  <p>No. of People </p>
                                  <span>{item.q_people}</span>
                                </div>
                                <div className="label_group">
                                  <p>No. of Luggage</p>
                                  <span>{item.q_luggage}</span>
                                </div>
                                <div className="label_group">
                                  <p>Start Date</p>
                                  <span>
                                    {moment(item.q_start_date).format(
                                      "MMM D, YYYY"
                                    )}
                                  </span>
                                </div>
                                <div className="label_group">
                                  <p>End Date</p>
                                  <span>
                                    {moment(item.q_end_date).format(
                                      "MMM D, YYYY"
                                    )}
                                  </span>
                                </div>
                                {/* <div className="label_group">
                                  <p>Selected Transportation Provider</p>
                                  <span>{item.v_name}</span>
                                </div> */}
                              </div>
                            </div>
                          </div>
                          {item.request_is_delete == 1 ? (
                            <div className="title_bottom">
                              <p className="small-p closed-trip">Trip closed</p>
                            </div>
                          ) : item.active_by_admin == 0 ? (
                            <div className="title_bottom">
                              <p className="small-p closed-trip">
                                DeActive by Admin
                              </p>
                            </div>
                          ) : // item.status == 1 ?
                            //     <div className="title_bottom">
                            //         <p className='small-p closed-trip'>Trip Cancelled</p>
                            //     </div> :
                            item.counter_recived > 0 ? (
                              <div className="title_bottom">
                                <div className="title_bottom_left">
                                  <div className="checked">
                                    <input
                                      className="input-field"
                                      type="checkbox"
                                      name="u_check"
                                      checked={receiveChkSts}
                                      id={`u_check1${i}`}
                                      onChange={() =>
                                        handleReceiveQuoteCheck(
                                          i,
                                          item.q_id,
                                          item.request_is_active
                                        )
                                      }
                                    />
                                    <label
                                      className="paraxs"
                                      for={`u_check1${i}`}
                                      id={`active_status1${i}`}
                                    >
                                      {receiveActiveSts}
                                    </label>
                                    {/* {/ <span className='paraxs'>Active</span> /} */}
                                  </div>
                                </div>
                                <div className="title_bottom_right">
                                  <a
                                    className="link-text mb-0"
                                    style={
                                      item.request_is_active == 0
                                        ? {
                                          pointerEvents: "none",
                                          opacity: "0.7",
                                        }
                                        : {}
                                    }
                                    id={`reviewQuotes${i}`}
                                    onClick={() =>
                                      handleReviewQuotes(item.r_id, item.q_id, i)
                                    }
                                  >
                                    Review Quotes
                                  </a>
                                </div>
                              </div>
                            ) : (
                              <div className="title_bottom">
                                <p className="small-p closed-trip">
                                  Trip Rejected
                                </p>
                              </div>
                            )}

                          <div
                            className={`link_modal ${isClicked && quoteIndex == item.q_id
                              ? "open"
                              : "close"
                              }`}
                          >
                            {isLoading ? (
                              <div className="loader_div">
                                <Loader />
                              </div>
                            ) : (
                              <div className="card_body p-0">
                                <ReactTooltip
                                  className="line-height-foo"
                                  id={`foo-foo${item.q_id}`}
                                  event="click"
                                  multiline={true}
                                />
                                <div class="arrow-1"></div>
                                <div className="custom-table">
                                  <table>
                                    <thead>
                                      <tr>
                                        {vendorList.length > 1 ? <th></th> : ""}
                                        <th scope="col">Sr. No.</th>
                                        <th scope="col">Name</th>
                                        <th scope="col">Location</th>
                                        <th scope="col">Trip Quotation</th>
                                        <th scope="col">Deposit</th>
                                        <th scope="col">
                                          Cancellation Date{" "}
                                          <i
                                            className=" fa-solid fa-circle-info"
                                            data-for={`foo-foo${item.q_id}`}
                                            data-tip="If a cancellation occurs on or before this date, Traveler will not be subject to any penalty and if a deposit was provided, it will be returned. If a deposit is given and cancellation occurs after this date, it will be forfeited."
                                          ></i>
                                        </th>
                                        <th scope="col">Notes</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {Array.isArray(vendorList) &&
                                        vendorList.length
                                        ? vendorList.map((item, i) => {
                                          return (
                                            <tr>
                                              {vendorList.length > 1 ? (
                                                <td>
                                                  <input
                                                    className="input-field table-checkbox"
                                                    name="tpQuotes[]"
                                                    type="checkbox"
                                                    value={item.v_id}
                                                    id={`selectTp${i}`}
                                                    onClick={(e) => {
                                                      getTpValues(
                                                        item.q_id,
                                                        item.qs_id,
                                                        item.v_id,
                                                        item.r_id,
                                                        i
                                                      );
                                                    }}
                                                  />
                                                </td>
                                              ) : (
                                                ""
                                              )}
                                              <td data-label="Sr.No.">
                                                {i + 1}
                                              </td>
                                              <td data-label="Name">
                                                {item.vname}
                                              </td>
                                              <td data-label="Location">
                                                {item.ciname}
                                              </td>
                                              <td data-label="Trip Quotation">
                                                ${item.qs_price}
                                              </td>
                                              <td data-label="Deposit">
                                                ${item.qs_deposit}
                                              </td>
                                              <td data-label="Cancellation-Date">
                                                {item.qs_cancellation_days ===
                                                  "0000-00-00"
                                                  ? "--"
                                                  : moment(
                                                    item.qs_cancellation_days
                                                  ).format(
                                                    "ddd MMM D, YYYY"
                                                  )}
                                              </td>
                                              <td
                                                data-label="Note"
                                                className="brk-txt"
                                              >
                                                {item.qs_notes}
                                              </td>
                                            </tr>
                                          );
                                        })
                                        : ""}
                                    </tbody>
                                  </table>
                                </div>
                                <div className="review-action">
                                  {vendorList.length > 1 ? (
                                    <>
                                      <button
                                        onClick={() =>
                                          openPaymentPage(tpQId, tpQsId)
                                        }
                                        disabled={disabled}
                                        className="card-btn-pop-outline pxs mx-s mw-none"
                                      >
                                        Accept
                                      </button>
                                      <button
                                        className="card-btn-pop-outline pxs mx-s mw-none"
                                        disabled={disabled}
                                        onClick={() =>
                                          showRejectModal(
                                            tpQId,
                                            tpQsId,
                                            tpVId,
                                            tpRId
                                          )
                                        }
                                      >
                                        Reject
                                      </button>
                                      {vendorList.length > 1 ? (
                                        <form onSubmit={compareNow}>
                                          {/* <input type='hidden' name="user_id" value={tpRId} />
                                                                                    <input type='hidden' name="quot_id" value={tpQId} /> */}
                                          <button
                                            type="submit"
                                            disabled={disabled}
                                            className="card-btn-pop-outline pxs mx-s mw-none"
                                          >
                                            Compare Now
                                          </button>
                                        </form>
                                      ) : (
                                        ""
                                      )}
                                      <button
                                        className="card-btn-pop pxs mx-s mw-none"
                                        disabled={disabled}
                                        onClick={() =>
                                          showClearification(
                                            tpQId,
                                            tpQsId,
                                            tpVId,
                                            tpRId
                                          )
                                        }
                                        href=""
                                      >
                                        Respond to Question/Ask for
                                        Clarification
                                      </button>
                                    </>
                                  ) : Array.isArray(vendorList) &&
                                    vendorList.length ? (
                                    vendorList.map((item, i) => {
                                      return (
                                        <>
                                          <button
                                            onClick={() =>
                                              openPaymentPage1(
                                                item.q_id,
                                                item.qs_id
                                              )
                                            }
                                            disabled={disabled}
                                            className="card-btn-pop-outline pxs mx-s mw-none"
                                          >
                                            Accept
                                          </button>
                                          <button
                                            className="card-btn-pop-outline pxs mx-s mw-none"
                                            disabled={disabled}
                                            onClick={() =>
                                              showRejectModal1(
                                                item.q_id,
                                                item.qs_id,
                                                item.v_id,
                                                item.r_id
                                              )
                                            }
                                          >
                                            Reject
                                          </button>
                                          <button
                                            className="card-btn-pop pxs mx-s mw-none"
                                            disabled={disabled}
                                            onClick={() =>
                                              showClearification1(
                                                item.q_id,
                                                item.qs_id,
                                                item.v_id,
                                                item.r_id
                                              )
                                            }
                                            href=""
                                          >
                                            Respond to Question/Ask for
                                            Clarification
                                          </button>
                                        </>
                                      );
                                    })
                                  ) : (
                                    ""
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="no-data-container">
                      <div className="no-data">
                        <h3 className="heading4">No Data Found</h3>
                      </div>
                    </div>
                  )}
                </div>

                <div
                  className={`tab-pane fade ${param.tab_id == 3 ? "show active" : ""
                    }`}
                  id="Compare"
                  role="tabpanel"
                  aria-labelledby="contact-tab"
                >
                  {Array.isArray(compareQuote) && compareQuote.length ? (
                    compareQuote.map((item, i) => {
                      return (
                        <div className="accordion-item">
                          <h2
                            className="accordion-header"
                            id="flush-headingThree"
                          >
                            <button
                              className="accordion-button collapsed"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target={`#flush-collapseThree${i}`}
                              aria-expanded="false"
                              aria-controls="flush-collapseThree"
                            >
                              <div className="title_data">
                                <p>Trip Title</p>
                                <span>{item.q_title}</span>
                                <div className="title_footer">
                                  <div className="date_area">
                                    <img src="https://img.icons8.com/material-outlined/24/000000/planner.png" />
                                    <p>
                                      {moment(item.q_start_date).format(
                                        "MMM D"
                                      )}{" "}
                                      -{" "}
                                      {moment(item.q_end_date).format(
                                        "MMM D, YYYY"
                                      )}
                                    </p>
                                  </div>
                                  <div className="date_area">
                                    <img src="https://img.icons8.com/material-rounded/24/000000/marker.png" />
                                    <p>{item.country_name}</p>
                                  </div>
                                </div>
                              </div>
                            </button>
                          </h2>
                          <div
                            id={`flush-collapseThree${i}`}
                            className="accordion-collapse collapse"
                            aria-labelledby="flush-headingThree"
                            data-bs-parent="#accordionFlushExample"
                          >
                            <div className="accordion-body">
                              <div className="card_body">
                                <div className="label_group">
                                  <p>Trip Title</p>
                                  <span>{item.q_title}</span>
                                </div>
                                <div className="label_group">
                                  <p>Additional Details/Questions</p>
                                  <span>{item.q_desc}</span>
                                </div>
                                <div className="label_group">
                                  <p>No. of People </p>
                                  <span>{item.q_people}</span>
                                </div>
                                <div className="label_group">
                                  <p>No. of Luggage</p>
                                  <span>{item.q_luggage}</span>
                                </div>
                                <div className="label_group">
                                  <p>Start Date</p>
                                  <span>
                                    {moment(item.q_start_date).format(
                                      "ddd MMM D, YYYY"
                                    )}
                                  </span>
                                </div>
                                <div className="label_group">
                                  <p>End Date</p>
                                  <span>
                                    {moment(item.q_end_date).format(
                                      "ddd MMM D, YYYY"
                                    )}
                                  </span>
                                </div>
                                {/* <div className='label_group'>
                                                                <p>Selected Transportation Provider</p>
                                                                <span>Darshan Travels</span>
                                                            </div> */}
                              </div>
                            </div>
                          </div>
                          <div className="title_bottom">
                            {/* <div className="title_bottom_left">
                                        <p className='link-text' onClick={handleTPClick} href="">View Transportation Provider Details</p>
                                    </div> */}
                            <div className="title_bottom_left"></div>
                            <div className="title_bottom_right">
                              <p
                                className="link-text"
                                onClick={() =>
                                  handleCompareQuotes(item.r_id, item.q_id)
                                }
                                href=""
                              >
                                View Compare Quotes
                              </p>
                            </div>
                          </div>
                          <div
                            className={`link_modal ${isClicked && compareIndex == item.q_id
                              ? "open"
                              : "close"
                              }`}
                          >
                            {/* <div className='card_body'>
                                        <div className="label-heading">
                                            <h5 className='heading6-blue pb'>Payment Details</h5>
                                        </div>
                                        <div className='label_group'>
                                            <p>Trip Quotation</p>
                                            <span>${item.qs_price}</span>
                                        </div>
                                        <div className='label_group'>
                                            <p>Deposit</p>
                                            <span>${item.qs_deposit}</span>
                                        </div>
                                        <div className='label_group'>
                                            <p>Total Paid</p>
                                            <span>${totalPaid}</span>
                                        </div>
                                        <div className='label_group'>
                                            <p>End Date</p>
                                            <span>{moment(item.q_end_date).format('ddd MMM D, YYYY')}</span>
                                        </div>
                                    </div> */}
                            <div className="compare-relative">
                              <div className="blue-line"></div>

                              {isLoading ? (
                                <div className="loader_div2">
                                  <Loader />
                                </div>
                              ) : (
                                <div className="compare-card">
                                  <div className="tp-profile">
                                    {
                                      item.user_data.map((user, i) => {
                                        return (
                                          <div className="tp-profile-block">
                                            <div className="tp-profile-img">
                                              {user.v_prorfile_pic === null ||
                                                user.v_prorfile_pic === "" ? (
                                                <img src="../assets/img/profile.png"></img>
                                              ) : (
                                                <img
                                                  src={` ${API_BASE_URL}assets/images/user/${user.v_prorfile_pic}`}
                                                  id="imgPreview"
                                                ></img>
                                              )}
                                            </div>
                                            <div className="tp-profile-name">
                                              <p className="small-p mt-s">
                                                {user.vname}
                                              </p>
                                            </div>
                                          </div>
                                        );
                                      })
                                    }
                                  </div>
                                  <div className="compare-subtitle">
                                    <p className="paraxs tl-c blue-text mb-0">
                                      Trip Quotation
                                    </p>
                                  </div>
                                  <div className="tp-profile mt">
                                    {
                                      item.user_data.map((user, i) => {
                                        return (
                                          <div className="tp-profile-block">
                                            <div className="tp-profile-p">
                                              <h6 className="small-heading mb">
                                                ${user.qs_price}
                                              </h6>
                                            </div>
                                            <div className="tp-profile-name">
                                              <button
                                                className="card-btn-pop-outline pxs mx-s mw-none"
                                                onClick={() =>
                                                  openComparePaymentPage(
                                                    user.q_id,
                                                    user.qs_id
                                                  )
                                                }
                                              >
                                                Accept
                                              </button>
                                            </div>
                                          </div>
                                        );
                                      })
                                    }
                                  </div>
                                  <div className="compare-subtitle">
                                    <p className="paraxs tl-c blue-text mb-0">
                                      Cancellation Date
                                    </p>
                                  </div>
                                  <div className="tp-profile mt">
                                    {item.user_data.map((user, i) => {
                                      return (
                                        <div className="tp-profile-block">
                                          <h6 className="small-heading tl-c">
                                            {user.qs_cancellation_days ===
                                              "0000-00-00"
                                              ? "-"
                                              : moment(
                                                user.qs_cancellation_days
                                              ).format("ddd MMM D, YYYY")}
                                          </h6>
                                        </div>
                                      );
                                    })
                                    }
                                  </div>
                                  <div className="compare-subtitle">
                                    <p className="paraxs tl-c blue-text mb-0">
                                      Notes
                                    </p>
                                  </div>
                                  <div className="tp-profile mt">
                                    {item.user_data.map((user, i) => {
                                      return (
                                        <div className="tp-profile-block">
                                          <h6 className="small-heading tl-c">
                                            {user.qs_notes}
                                          </h6>
                                        </div>
                                      );
                                    })
                                    }
                                  </div>
                                </div>
                              )}

                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="no-data-container">
                      <div className="no-data">
                        <h3 className="heading4">No Data Found</h3>
                      </div>
                    </div>
                  )}
                </div>

                <div
                  className={`tab-pane fade ${param.tab_id == 4 ? "show active" : ""
                    }`}
                  id="TpProvider"
                  role="tabpanel"
                  aria-labelledby="tp-tab"
                >
                  {Array.isArray(transportProviders) &&
                    transportProviders.length ? (
                    transportProviders.map((item, i) => {
                      // if (item.charge_id !== '' && item.charge_id_main_amt !== '') {
                      //     var totalPaid = item.qs_deposit + item.qs_price;
                      // } else if (item.charge_id !== '' && item.charge_id_main_amt === '') {
                      //     var totalPaid = item.qs_deposit;
                      // } else if (item.charge_id === '' && item.charge_id_main_amt !== '') {
                      //     var totalPaid = item.qs_price;
                      // } else {
                      //     var totalPaid = 0;
                      // }
                      return (
                        <div className="accordion-item">
                          <h2
                            className="accordion-header"
                            id="flush-headingOne"
                          >
                            <button
                              className="accordion-button collapsed"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target={`#flush-collapseFour${i}`}
                              aria-expanded="false"
                              aria-controls="flush-collapseOne"
                            >
                              <div className="title_data">
                                <p>Trip Title</p>
                                <span>{item.q_title}</span>
                                <div className="title_footer">
                                  <div className="date_area">
                                    <img src="https://img.icons8.com/material-outlined/24/000000/planner.png" />
                                    <p>
                                      {moment(item.q_start_date).format(
                                        "MMM D"
                                      )}{" "}
                                      -{" "}
                                      {moment(item.q_end_date).format(
                                        "MMM D, YYYY"
                                      )}
                                    </p>
                                  </div>
                                  <div className="date_area">
                                    <img src="https://img.icons8.com/material-rounded/24/000000/marker.png" />
                                    <p>{item.cname}</p>
                                  </div>
                                </div>
                              </div>
                            </button>
                          </h2>
                          <div
                            id={`flush-collapseFour${i}`}
                            className="accordion-collapse collapse"
                            aria-labelledby="flush-headingOne"
                            data-bs-parent="#accordionFlushExample"
                          >
                            <div className="accordion-body">
                              <div className="card_body">
                                <div className="label_group">
                                  <p>Trip Title</p>
                                  <span>{item.q_title}</span>
                                </div>
                                <div className="label_group">
                                  <p>Additional Details/Questions</p>
                                  <span>{item.q_desc}</span>
                                </div>
                                <div className="label_group">
                                  <p>No. of People </p>
                                  <span>{item.q_people}</span>
                                </div>
                                <div className="label_group">
                                  <p>No. of Luggage</p>
                                  <span>{item.q_luggage}</span>
                                </div>
                                <div className="label_group">
                                  <p>Start Date</p>
                                  <span>
                                    {moment(item.q_start_date).format(
                                      "ddd MMM D, YYYY"
                                    )}
                                  </span>
                                </div>
                                <div className="label_group">
                                  <p>End Date</p>
                                  <span>
                                    {moment(item.q_end_date).format(
                                      "ddd MMM D, YYYY"
                                    )}
                                  </span>
                                </div>
                                <div className="label_group">
                                  <p>Selected Transportation Provider</p>
                                  <span>{item.name}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div>
                            <div
                              class="accordion"
                              id={`accordionExample${item.q_id}`}
                            >
                              <div className="title_bottom">
                                <div class="title_bottom_left">
                                  <h2 class="accordion-header" id="headingOne">
                                    <p
                                      className="link-text"
                                      data-bs-toggle="collapse"
                                      data-bs-target={`#collapseOne${item.q_id}`}
                                      aria-expanded="false"
                                      aria-controls="collapseOne"
                                      href=""
                                    >
                                      View Transportation Provider Details
                                    </p>
                                  </h2>
                                </div>
                                <div class="title_bottom_right">
                                  <h2 class="accordion-header" id="headingTwo">
                                    <p
                                      className="link-text"
                                      data-bs-toggle="collapse"
                                      data-bs-target={`#collapseTwo${item.q_id}`}
                                      aria-expanded="false"
                                      aria-controls="collapseTwo"
                                      href=""
                                    >
                                      View Payment Details
                                    </p>
                                  </h2>
                                </div>
                              </div>

                              <div
                                id={`collapseOne${item.q_id}`}
                                class="accordion-collapse collapse"
                                aria-labelledby="headingOne"
                                data-bs-parent={`#accordionExample${item.q_id}`}
                              >
                                <div className="card_body">
                                  <div className="label-heading">
                                    <h5 className="heading6-blue pb">
                                      Transportation Provider Details
                                    </h5>
                                  </div>
                                  <div className="label_group">
                                    <p>Name</p>
                                    <span>{item.name}</span>
                                  </div>
                                  <div className="label_group">
                                    <p>Location</p>
                                    <span>{`${item.cname}, ${item.sname}, ${item.ciname}`}</span>
                                  </div>
                                  <div className="label_group">
                                    <p>Cancellation Date</p>
                                    <span>
                                      {item.qs_cancellation_days ===
                                        "0000-00-00"
                                        ? "-"
                                        : moment(
                                          item.qs_cancellation_days
                                        ).format("ddd MMM D, YYYY")}
                                    </span>
                                  </div>
                                  <div className="label_group">
                                    <p>Trip Quotation</p>
                                    <span>${item.qs_price}</span>
                                  </div>
                                  <div className="label_group">
                                    <p>Deposit</p>
                                    <span>${item.qs_deposit}</span>
                                  </div>
                                  <div className="label_group">
                                    <p>Notes</p>
                                    <span>{item.qs_notes}</span>
                                  </div>
                                </div>
                              </div>
                              <div
                                id={`collapseTwo${item.q_id}`}
                                class="accordion-collapse collapse"
                                aria-labelledby="headingTwo"
                                data-bs-parent={`#accordionExample${item.q_id}`}
                              >
                                <div className="card_body">
                                  <div className="label-heading">
                                    <h5 className="heading6-blue pb">
                                      Payment Details
                                    </h5>
                                  </div>
                                  <div className="label_group">
                                    <p>Trip Quotation</p>
                                    <span>${item.qs_price}</span>
                                  </div>
                                  <div className="label_group">
                                    <p>Deposit</p>
                                    <span>${item.qs_deposit}</span>
                                  </div>
                                  <div className="label_group">
                                    <p>Total Paid</p>
                                    <span>
                                      $
                                      {item.charge_id !== "" &&
                                        item.charge_id_main_amt !== ""
                                        ? item.qs_price
                                        : item.charge_id !== "" &&
                                          item.charge_id_main_amt === ""
                                          ? item.qs_deposit
                                          : item.charge_id === "" &&
                                            item.charge_id_main_amt !== ""
                                            ? item.qs_price
                                            : 0}
                                    </span>
                                  </div>
                                  <div className="label_group">
                                    <p>End Date</p>
                                    <span>
                                      {moment(item.q_end_date).format(
                                        "ddd MMM D, YYYY"
                                      )}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="no-data-container">
                      <div className="no-data">
                        <h3 className="heading4">No Data Found</h3>
                      </div>
                    </div>
                  )}
                </div>
                <div
                  className={`tab-pane fade ${param.tab_id == 5 ? "show active" : ""
                    }`}
                  id="expired"
                  role="tabpanel"
                  aria-labelledby="expired-tab"
                >
                  {Array.isArray(expiredQuotations) &&
                    expiredQuotations.length ? (
                    expiredQuotations.map((item, i) => {
                      return (
                        <div className="accordion-item">
                          <h2
                            className="accordion-header"
                            id="flush-headingOne"
                          >
                            <button
                              className="accordion-button collapsed"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target={`#flush-collapseFive${i}`}
                              aria-expanded="false"
                              aria-controls="flush-collapseOne"
                            >
                              <div className="title_data">
                                <p>Trip Title</p>
                                <span>{item.q_title}</span>
                                <div className="title_footer">
                                  <div className="date_area">
                                    <img src="https://img.icons8.com/material-outlined/24/000000/planner.png" />
                                    <p>
                                      {moment(item.q_start_date).format(
                                        "MMM D"
                                      )}{" "}
                                      -{" "}
                                      {moment(item.q_end_date).format(
                                        "MMM D, YYYY"
                                      )}
                                    </p>
                                  </div>
                                  {/* <div className='date_area'>
                                                                                <img src="https://img.icons8.com/material-rounded/24/000000/marker.png" />
                                                                                <p>{item.cname}</p>
                                                                            </div> */}
                                </div>
                              </div>
                            </button>
                          </h2>
                          <div
                            id={`flush-collapseFive${i}`}
                            className="accordion-collapse collapse"
                            aria-labelledby="flush-headingOne"
                            data-bs-parent="#accordionFlushExample"
                          >
                            <div className="accordion-body">
                              <div className="card_body">
                                <div className="label_group">
                                  <p>Trip Title</p>
                                  <span>{item.q_title}</span>
                                </div>
                                <div className="label_group">
                                  <p>Additional Details/Questions</p>
                                  <span>{item.q_desc}</span>
                                </div>
                                <div className="label_group">
                                  <p>No. of People </p>
                                  <span>{item.q_people}</span>
                                </div>
                                <div className="label_group">
                                  <p>No. of Luggage</p>
                                  <span>{item.q_luggage}</span>
                                </div>
                                <div className="label_group">
                                  <p>Start Date</p>
                                  <span>
                                    {moment(item.q_start_date).format(
                                      "ddd MMM D, YYYY"
                                    )}
                                  </span>
                                </div>
                                <div className="label_group">
                                  <p>End Date</p>
                                  <span>
                                    {moment(item.q_end_date).format(
                                      "ddd MMM D, YYYY"
                                    )}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="no-data-container">
                      <div className="no-data">
                        <h3 className="heading4">No Data Found</h3>
                      </div>
                    </div>
                  )}
                </div>

                <div
                  className={`tab-pane fade ${param.tab_id == 6 ? "show active" : ""
                    }`}
                  id="rejected"
                  role="tabpanel"
                  aria-labelledby="rejected-tab"
                >
                  {Array.isArray(rejectedQuotations) &&
                    rejectedQuotations.length ? (
                    rejectedQuotations.map((item, i) => {
                      return (
                        <div className="accordion-item">
                          <h2
                            className="accordion-header"
                            id="flush-headingOne"
                          >
                            <button
                              className="accordion-button collapsed"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target={`#flush-collapseSix${i}`}
                              aria-expanded="false"
                              aria-controls="flush-collapseOne"
                            >
                              <div className="title_data">
                                <p>Trip Title</p>
                                <span>{item.q_title}</span>
                                <div className="title_footer">
                                  <div className="date_area">
                                    <img src="https://img.icons8.com/material-outlined/24/000000/planner.png" />
                                    <p>
                                      {moment(item.q_start_date).format(
                                        "MMM D"
                                      )}{" "}
                                      -{" "}
                                      {moment(item.q_end_date).format(
                                        "MMM D, YYYY"
                                      )}
                                    </p>
                                  </div>
                                  {/* <div className='date_area'>
                                                                                <img src="https://img.icons8.com/material-rounded/24/000000/marker.png" />
                                                                                <p>{item.cname}</p>
                                                                            </div> */}
                                </div>
                              </div>
                            </button>
                          </h2>
                          <div
                            id={`flush-collapseSix${i}`}
                            className="accordion-collapse collapse"
                            aria-labelledby="flush-headingOne"
                            data-bs-parent="#accordionFlushExample"
                          >
                            <div className="accordion-body">
                              <div className="card_body">
                                <div className="label_group">
                                  <p>Trip Title</p>
                                  <span>{item.q_title}</span>
                                </div>
                                <div className="label_group">
                                  <p>Additional Details/Questions</p>
                                  <span>{item.q_desc}</span>
                                </div>
                                <div className="label_group">
                                  <p>No. of People </p>
                                  <span>{item.q_people}</span>
                                </div>
                                <div className="label_group">
                                  <p>No. of Luggage</p>
                                  <span>{item.q_luggage}</span>
                                </div>
                                <div className="label_group">
                                  <p>Start Date</p>
                                  <span>
                                    {moment(item.q_start_date).format(
                                      "ddd MMM D, YYYY"
                                    )}
                                  </span>
                                </div>
                                <div className="label_group">
                                  <p>End Date</p>
                                  <span>
                                    {moment(item.q_end_date).format(
                                      "ddd MMM D, YYYY"
                                    )}
                                  </span>
                                </div>
                                <div className='label_group'>
                                  <p>Rejected By</p>
                                  <span>{item.not_interested_vendors}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="no-data-container">
                      <div className="no-data">
                        <h3 className="heading4">No Data Found</h3>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <BottomNavbar user={true} />
          <Modal show={rejectQuoteModal} className="flex-center-card">
            <Modal.Body>
              <ModalHeader>
                <div className="modal-heading">
                  <h6 className="small-heading blue-text tl-c">Reject Quote</h6>
                </div>
              </ModalHeader>

              <div className="modal-container">
                <div className="modal-box">
                  <div className="block-content my">
                    <form className="my-4" onSubmit={handleRejectQuoteSubmit}>
                      <input type="hidden" name="q_id" id="q_id" value={qid} />
                      <input
                        type="hidden"
                        name="qs_id"
                        id="qs_id"
                        value={qsid}
                      />
                      <input type="hidden" name="v_id" id="v_id" value={vid} />
                      <input type="hidden" name="r_id" id="r_id" value={rid} />
                      <h6 className="small-heading mb-xl">
                        Are you sure you want to cancel this quote?
                      </h6>
                      <div className="buttonblock">
                        <button
                          type="submit"
                          className=" mx-3 card-btn-pop"
                          id="rejectQuote"
                        >
                          Yes
                        </button>
                        <div className="space"></div>
                      </div>
                    </form>
                    <button
                      class="card-btn-pop-outline ABS-btn mx-3"
                      onClick={hideRejectModal}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </Modal.Body>
          </Modal>
          <Modal
            show={clearificationBtn}
            className="flex-center-card"
            onHide={reset}
          >
            <Modal.Body>
              <ModalHeader className="p-0">
                <div className="modal-heading">
                  <h6 className="small-heading blue-text tl-c pr-20">
                    Ask for Clarification/Respond to Question
                  </h6>
                  <div className="cross" onClick={hideClearification}>
                    <img src="../assets/img/cancel_black.svg" alt="" />
                  </div>
                </div>
              </ModalHeader>
              <div className="modal-container">
                <div className="modal-box">
                  <div className="block-content my">
                    <div className="chat-text" id="chat-text">
                      {msgText.map((item) => {
                        return (
                          <div
                            className={`${item.message_direction === "right"
                              ? "chat-text-sender"
                              : "chat-text-receiver"
                              }`}
                          >
                            <p
                              className={`${item.message_direction === "right"
                                ? "send-text"
                                : "receive-text"
                                }`}
                            >
                              {item.data}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                    <form className="my-4" onSubmit={handleClearification}>
                      <input
                        type="hidden"
                        id="clari_qs_id"
                        name="clari_qs_id"
                        value={clearQsId}
                      />
                      <input
                        type="hidden"
                        id="clari_q_id"
                        name="clari_q_id"
                        value={clearQId}
                      />
                      <input
                        type="hidden"
                        id="clari_v_id"
                        name="clari_v_id"
                        value={clearVId}
                      />
                      <input
                        type="hidden"
                        id="clari_s_id"
                        name="clari_s_id"
                        value={clearUId}
                      />
                      <input
                        type="hidden"
                        id="clari_r_id"
                        name="clari_r_id"
                        value={clearUId}
                      />
                      <input
                        type="hidden"
                        id="identity"
                        name="identity"
                        value="1"
                      />
                      <textarea
                        className="textarea-input bradius-m"
                        rows="5"
                        cols="30"
                        type="text"
                        name="clari_txt"
                        id="clari_txt"
                        value={inputValues.clari_txt}
                        onChange={handleChange}
                      ></textarea>
                      <div style={errorMsg}>
                        {validator.message(
                          "clari_txt",
                          inputValues.clari_txt,
                          "required",
                          {
                            messages: {
                              required: "Please enter some text",
                            },
                          }
                        )}
                      </div>
                      <div className="space"></div>
                      <div className="buttonblock">
                        <div className="space"></div>
                        <button
                          type="submit"
                          className=" card-btn-pop"
                          id="sendClarification"
                        >
                          Send
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </Modal.Body>
          </Modal>
        </div>
      )}
    </>
  );
}

export default ManageQuotation;
