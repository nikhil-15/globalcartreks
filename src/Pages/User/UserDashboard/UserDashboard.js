import React, { useEffect, useRef, useState } from 'react';
import Axios from 'axios';
import { API_BASE_URL } from '../../../Config/Config';
import { BASE_URL } from '../../../Config/BaseUrl';
import { useNavigate, Link, NavLink } from 'react-router-dom';
import UserHeader from '../Header/UserHeader';
import { getLocalStorageAuth } from '../../../Auth/Auth.service';
import "./userDashboard.css"
import BottomNavbar from '../../../Components/Common/BottomNavbar';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import UserNotification from "./UserNotification";
import Downarrow from "../../../Components/Common/Downarrow"
import '../../../Components/Common/downarrow.css'
// import Swiper from 'swiper/react'

function UserDashboard() {

    const navigate = useNavigate();
    const API_BASE_URL = BASE_URL()
    const appType = localStorage.getItem('appType');
    console.log(appType);
    console.log(API_BASE_URL);
    const auth = getLocalStorageAuth();
    const [loader, setLoader] = useState(false);
    const [count, setCount] = useState('');
    const [isReadMore, setIsReadMore] = useState({
        first: false,
        second: false,
        third: false,
        fourth: false,
        fifth: false,
        sixth: false,
        seventh: false,
        eighth: false,
        ninth: false,
        tenth: false,
        eleventh: false,
        twelveth: false,
        thirteenth: false,
        fourteenth: false,
    });

    // useEffect(() => {
    // window.scrollTo(0, 0);


    // }, [auth,navigate])

    useEffect(() => {
        setLoader(true);
        setTimeout(() => {
            setLoader(false);
        }, 1500)

        window.scrollTo(0, 0);
        if (auth == null || auth == "") {
            navigate("/");
        }

        const profilePercent = async () => {
            const response = await Axios(API_BASE_URL + 'api/user_profile_percent/' + auth.id);
            if (response.data.data == '100') {
                navigate('/user-dashboard');
            } else {
                if (appType == '1') {
                    navigate('/complete-user-profile');
                } else {
                    navigate('/complete-user-profile-us');
                }
            }
        };

        const notificationCount = async () => {
            const response = await Axios(API_BASE_URL + 'api/get_notification_count/' + auth.id);
            setCount(response.data.data);
        };

        profilePercent();
        notificationCount();
    }, [])

    const handleClick = () => {
        if (appType == '1') {
            navigate("/edit-user-profile");
        } else {
            navigate('/edit-user-profile-us');
        }

    };

    const settings = {

        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        // speed: 2000,
        autoplaySpeed: 3000,
    };
    const [slick, setSlick] = useState(null);

    const handleNext = () => {
        slick.slickNext();
    }
    const handlePrev = () => {
        slick.slickPrev();
    }
    return (
        <>
            {loader ?
                (
                    <div id="loaderring"></div>
                ) :
                (
                    <div>

                        <div className="user-fixed">
                            <UserHeader />
                            <div className="profile-cover">
                                <UserNotification />
                            </div>
                            {/* <div className="profile-cover"></div> */}

                            {/* ------------- user-Profile-pic -------------------- */}

                            {/* {
                (auth.profile_pic != '') ?
                <img src={`${{ API_BASE_URL }}assets/images/user/${auth.profile_pic}`} style={{width:'150px',borderRadius:'50%'}}></img>:
                <img src='./assets/img/profile.png' style={{width:'150px',borderRadius:'50%'}}></img>
                } */}

                            <div className="userinfo-container">
                                <div className="userinfo-card" style={{ width: 'fit-content' }}>
                                    <h5>{auth.name}</h5>
                                    <p>{auth.email}</p>
                                    <div className="edit-icon">
                                        <i className="fa fa-edit" aria-hidden="true" onClick={handleClick}></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="profile-container">
                            <div className="profile-box">
                                <NavLink to="/new-booking">
                                    <div className="nav-card-links">
                                        <div className="nav-img">
                                            <img src="./assets/img/Group-2450-2.svg" alt="" />
                                        </div>
                                        <div className="nav-title">
                                            <h6>Make New <br />Trip Request</h6>
                                        </div>
                                    </div>
                                </NavLink>
                                <NavLink to="/manage-Quotation/1">
                                    <div className="nav-card-links primary">
                                        <div className="nav-img">
                                            <img src="./assets/img/manage_quotation.svg" alt="" />
                                        </div>
                                        <div className="nav-title">
                                            <h6>Manage <br />Quotations</h6>
                                        </div>
                                    </div>
                                </NavLink>
                                <NavLink to="/manage-Payments/1">
                                    <div className="nav-card-links secondary">
                                        <div className="nav-img">
                                            <img src="./assets/img/manage_payment.svg" alt="" />
                                        </div>
                                        <div className="nav-title">
                                            <h6>Manage <br />Payments</h6>
                                        </div>
                                    </div>
                                </NavLink>
                                <NavLink to="/Trip-status/1">
                                    <div className="nav-card-links tertiary">
                                        <div className="nav-img">
                                            <img src="./assets/img/date_range_black_24dp.svg" alt="" />
                                        </div>
                                        <div className="nav-title">
                                            <h6>Trip <br />Status</h6>
                                        </div>
                                    </div>
                                </NavLink>

                            </div>
                        </div>
                        <Downarrow />
                        <div className="profile-contain mt-xl">
                            <div className="profile-header profile-container">
                                <h3 className='heading5'>Inspirational Destinations</h3>
                            </div>
                            {
                                appType == 1 ?
                                    (
                                        <div style={{ position: 'relative' }}>
                                            <button className='slick-caret arrow-left' onClick={handlePrev}><i class="fa-solid fa-caret-left"></i></button>
                                            <button className='slick-caret arrow-right' onClick={handleNext}><i class="fa-solid fa-caret-right"></i></button>
                                            <Slider {...settings}
                                                ref={(slick) => setSlick(slick)}
                                            >
                                                <div className="dest-container mt">
                                                    <div className="dest-image">
                                                        <div className="linear-overlay"></div>
                                                        <img src="./assets/img/bellagio.png" alt="" />
                                                        <div className="dest-title">
                                                            <p className='white-text large-p mb-0'>Bellagio</p>
                                                            <p className='white-text mb-0 paraxs'><i class="fas fa-map-marker-alt"></i>Italy</p>
                                                        </div>
                                                    </div>
                                                    <div className="dest-details">
                                                        <div className="text-overflow-container">
                                                            <p className={`paraxs mb-0 ${isReadMore.first ? '' : 'text-overflow'}`}>Called the "prettiest town in Europe" and the "Pearl of Lake Como", Bellagio sits on a peninsula jutting out into Lake Como. Bellagio boasts beautiful vistas, elegant buildings, cobbled streets and lovely shops, accommodations and restaurants. A car and driver from Milan can transport you to this magical town and provide service to other stunning destinations on Lake Como.</p>
                                                        </div>
                                                        <p onClick={() => setIsReadMore({ ...isReadMore, first: !isReadMore.first })} className='link-text read_text'>{isReadMore.first ? 'Read Less' : 'Read More'}</p>
                                                    </div>
                                                </div>

                                                <div className="dest-container mt">
                                                    <div className="dest-image">
                                                        <div className="linear-overlay"></div>
                                                        <img src="./assets/img/rothenburg.png" alt="" />
                                                        <div className="dest-title">
                                                            <p className='white-text large-p mb-0'>Rothenburg on the Tauber</p>
                                                            <p className='white-text mb-0 paraxs'><i class="fas fa-map-marker-alt"></i>Germany</p>
                                                        </div>
                                                    </div>
                                                    <div className="dest-details">
                                                        <div className="text-overflow-container">
                                                            <p className={`paraxs mb-0 ${isReadMore.second ? '' : 'text-overflow'}`}>With thousands of years of history, this Bavarian town showcases a well-preserved medieval old town and is Germany's best preserved walled town. It is a sought after destination from travelers the world over because of its history, quaint and colorful streets and interesting shopping. Travel writer Rick Steves calls it "a Fairy Tale Dream Town". A car and driver from Frankfurt can provide service to this lovely town and the surrounding scenic countryside.</p>
                                                        </div>
                                                        <p onClick={() => setIsReadMore({ ...isReadMore, second: !isReadMore.second })} className='link-text'>{isReadMore.second ? 'Read Less' : 'Read More'}</p>
                                                    </div>
                                                </div>

                                                <div className="dest-container mt mb-xl">
                                                    <div className="dest-image">
                                                        <div className="linear-overlay"></div>
                                                        <img src="./assets/img/toledo.png" alt="" />
                                                        <div className="dest-title">
                                                            <p className='white-text large-p mb-0'>Toledo</p>
                                                            <p className='white-text mb-0 paraxs'><i class="fas fa-map-marker-alt"></i>Spain</p>
                                                        </div>
                                                    </div>
                                                    <div className="dest-details">
                                                        <div className="text-overflow-container">
                                                            <p className={`paraxs mb-0 ${isReadMore.third ? '' : 'text-overflow'}`}>An ancient city with a history of three cultures-Arab, Christian and Jewish.  Home to El Greco and named a World Heritage site in 1986. Toledo's ancient Cathedral is one of the greatest Gothic structures in Europe. A visit will afford you the opportunity to watch artisans fashion Damascene jewelry and display swords made of legendary Toledo steel. For a more modern activity, Toledo boasts Europe's longest zip line. An excursion from Madrid with a car and driver service is available and you can extend your days with your car and driver to visit cities like Granada,   Valencia and Seville in comfort and style.</p>
                                                        </div>
                                                        <p onClick={() => setIsReadMore({ ...isReadMore, third: !isReadMore.third })} className='link-text'>{isReadMore.third ? 'Read Less' : 'Read More'}</p>
                                                    </div>
                                                </div>

                                                <div className="dest-container mt mb-xl">
                                                    <div className="dest-image">
                                                        <div className="linear-overlay"></div>
                                                        <img src="./assets/img/monaco.jpg" alt="" />
                                                        <div className="dest-title">
                                                            <p className='white-text large-p mb-0'>Monaco City</p>
                                                            <p className='white-text mb-0 paraxs'><i class="fas fa-map-marker-alt"></i>Monaco</p>
                                                        </div>
                                                    </div>
                                                    <div className="dest-details">
                                                        <div className="text-overflow-container">
                                                            <p className={`paraxs mb-0 ${isReadMore.fourth ? '' : 'text-overflow'}`}>Known as the "Billionaire's Playground" and famed for its wealth and glamour, this tiny city state on the French Cote D” Azur, overlooks the Mediterranean Sea.  A visit to Monaco might include a visit to the
                                                                famous Place du Casino, the Oceanographic Museum and a trip to The Rock, an ancient medieval town
                                                                to see the Prince's Place and St. Nicholas Cathedral along with stunning views.  A car and driver service
                                                                can provide service from the airport in Nice to your accommodation, chauffer you around the city at
                                                                night, provide interesting day trips to the medieval and quaint hillside village of Eze for spectacular
                                                                views and impressive architecture as well as a visit to the village of Grasse, considered the world's
                                                                capital of perfume with a stop and tour of the Fragonard Perfume Factory and store.</p>
                                                        </div>
                                                        <p onClick={() => setIsReadMore({ ...isReadMore, fourth: !isReadMore.fourth })} className='link-text'>{isReadMore.fourth ? 'Read Less' : 'Read More'}</p>
                                                    </div>
                                                </div>

                                                <div className="dest-container mt mb-xl">
                                                    <div className="dest-image">
                                                        <div className="linear-overlay"></div>
                                                        <img src="./assets/img/porto.jpg" alt="" />
                                                        <div className="dest-title">
                                                            <p className='white-text large-p mb-0'>Porto</p>
                                                            <p className='white-text mb-0 paraxs'><i class="fas fa-map-marker-alt"></i>Portugal</p>
                                                        </div>
                                                    </div>
                                                    <div className="dest-details">
                                                        <div className="text-overflow-container">
                                                            <p className={`paraxs mb-0 ${isReadMore.fifth ? '' : 'text-overflow'}`}>The second largest city in Portugal is located on the northwest coast.  This World Heritage Site is a wonderful place to visit.  World famous for its production of port wines, this riverside city boasts a
                                                                medieval district with narrow cobbled streets, interesting Beaux Arts architecture and Baroque
                                                                churches.  It is the jumping off place to visit the Douro River Valley and its Port lodges. A car and driver
                                                                service from Lisbon or Porto can take you to vineyards, quaint villages, and great riverside restaurants.
                                                                With narrow and winding roads hugging vineyards and the river's edge, a local driver can assure you of a
                                                                memorable, comfortable, and scenic trip to this beautiful region.</p>
                                                        </div>
                                                        <p onClick={() => setIsReadMore({ ...isReadMore, fifth: !isReadMore.fifth })} className='link-text'>{isReadMore.fifth ? 'Read Less' : 'Read More'}</p>
                                                    </div>
                                                </div>

                                                <div className="dest-container mt mb-xl">
                                                    <div className="dest-image">
                                                        <div className="linear-overlay"></div>
                                                        <img src="./assets/img/cotswold.jpg" alt="" />
                                                        <div className="dest-title">
                                                            <p className='white-text large-p mb-0'>Cotswold</p>
                                                            <p className='white-text mb-0 paraxs'><i class="fas fa-map-marker-alt"></i>United Kingdom</p>
                                                        </div>
                                                    </div>
                                                    <div className="dest-details">
                                                        <div className="text-overflow-container">
                                                            <p className={`paraxs mb-0 ${isReadMore.sixth ? '' : 'text-overflow'}`}>While London has many charms, take a break and leave the city behind for a ride in the
                                                                quintessentially bucolic English countryside with a car and driver service.
                                                                The Cotswold's are known for some of the most picturesque villages, long on charm and built of Cotswold honey-colored stone. It offers visitors a
                                                                chance to stroll ancient streets, dine in quaint restaurants and visit locally owned shops.  It is also the
                                                                gateway to Bath, Stonehenge and Oxford on an extended car and driver service option.  Set your own
                                                                itinerary and take in the sights at your leisure.</p>
                                                        </div>
                                                        <p onClick={() => setIsReadMore({ ...isReadMore, sixth: !isReadMore.sixth })} className='link-text'>{isReadMore.sixth ? 'Read Less' : 'Read More'}</p>
                                                    </div>
                                                </div>

                                                <div className="dest-container mt mb-xl">
                                                    <div className="dest-image">
                                                        <div className="linear-overlay"></div>
                                                        <img src="./assets/img/bern.jpg" alt="" />
                                                        <div className="dest-title">
                                                            <p className='white-text large-p mb-0'>Bern</p>
                                                            <p className='white-text mb-0 paraxs'><i class="fas fa-map-marker-alt"></i>Switzerland</p>
                                                        </div>
                                                    </div>
                                                    <div className="dest-details">
                                                        <div className="text-overflow-container">
                                                            <p className={`paraxs mb-0 ${isReadMore.seventh ? '' : 'text-overflow'}`}>The capital city of Switzerland, known as the city of fountains, is famous for its quaint Old Town, the
                                                                Rose Garden, the 13th Century Clock Tower and Albert Einstein's home.  A car and driver service can
                                                                take you on a cheese and chocolate journey traveling to the medieval city of Gruyeres for a cheese tour
                                                                and then continuing to the town of Broc for Maison Cialler's Swiss chocolate factory tour.</p>
                                                        </div>
                                                        <p onClick={() => setIsReadMore({ ...isReadMore, seventh: !isReadMore.seventh })} className='link-text'>{isReadMore.seventh ? 'Read Less' : 'Read More'}</p>
                                                    </div>
                                                </div>

                                                <div className="dest-container mt mb-xl">
                                                    <div className="dest-image">
                                                        <div className="linear-overlay"></div>
                                                        <img src="./assets/img/stockholm.jpg" alt="" />
                                                        <div className="dest-title">
                                                            <p className='white-text large-p mb-0'>Stockholm</p>
                                                            <p className='white-text mb-0 paraxs'><i class="fas fa-map-marker-alt"></i>Sweden</p>
                                                        </div>
                                                    </div>
                                                    <div className="dest-details">
                                                        <div className="text-overflow-container">
                                                            <p className={`paraxs mb-0 ${isReadMore.eighth ? '' : 'text-overflow'}`}>Known as the “friendliest city”, this capital city is built on an archipelago of 14 small islands which is why
                                                                it is sometimes called the “Venice of the North”.  Stockholm boasts a medieval old town, ancient
                                                                churches, grand palaces while still combining contemporary buildings and touches.  A car and driver
                                                                service can take you to the city of Uppsala and Gamla Uppsala, 40 miles north of Stockholm.  This
                                                                famous university town dating from 1477, one of the oldest in Europe, is also an historic site where
                                                                Viking's ceremonies were held. The sacred grove of the Vikings is here along with the local cathedral
                                                                that dates from the 13	th  century.  The famous Gamla University Museum contains exhibits and
                                                                archaeological finds from the Viking burial mounds that dominated the local area.</p>
                                                        </div>
                                                        <p onClick={() => setIsReadMore({ ...isReadMore, eighth: !isReadMore.eighth })} className='link-text'>{isReadMore.eighth ? 'Read Less' : 'Read More'}</p>
                                                    </div>
                                                </div>

                                                <div className="dest-container mt mb-xl">
                                                    <div className="dest-image">
                                                        <div className="linear-overlay"></div>
                                                        <img src="./assets/img/oslo.jpg" alt="" />
                                                        <div className="dest-title">
                                                            <p className='white-text large-p mb-0'>Oslo</p>
                                                            <p className='white-text mb-0 paraxs'><i class="fas fa-map-marker-alt"></i>Norway</p>
                                                        </div>
                                                    </div>
                                                    <div className="dest-details">
                                                        <div className="text-overflow-container">
                                                            <p className={`paraxs mb-0 ${isReadMore.ninth ? '' : 'text-overflow'}`}>Sitting on the Oslo fjord, Oslo is Norway's capital and center of Nordic design, world famous cuisine and
                                                                a cutting-edge art scene.  The Vigeland's Park and the Folkamuseum are also must visit sites.  A car and
                                                                driver service can pick you up at the airport and take you to your accommodation or provide a trip to
                                                                Drebak to experience a typical southern town complete with winding streets, beachside restaurants and
                                                                a visit to the Drebak Aquarium.  Afterwards, a stop at Jegstad Gard Farm, a traditional Norwegian dairy
                                                                farm complete with animals, horse carriage rides, a nature trail for walks, a farm museum and Viking
                                                                burial mounds.</p>
                                                        </div>
                                                        <p onClick={() => setIsReadMore({ ...isReadMore, ninth: !isReadMore.ninth })} className='link-text'>{isReadMore.ninth ? 'Read Less' : 'Read More'}</p>
                                                    </div>
                                                </div>

                                                <div className="dest-container mt mb-xl">
                                                    <div className="dest-image">
                                                        <div className="linear-overlay"></div>
                                                        <img src="./assets/img/amsterdam.jpg" alt="" />
                                                        <div className="dest-title">
                                                            <p className='white-text large-p mb-0'>Amsterdam</p>
                                                            <p className='white-text mb-0 paraxs'><i class="fas fa-map-marker-alt"></i>The Netherlands</p>
                                                        </div>
                                                    </div>
                                                    <div className="dest-details">
                                                        <div className="text-overflow-container">
                                                            <p className={`paraxs mb-0 ${isReadMore.tenth ? '' : 'text-overflow'}`}>The Netherlands brings to mind tulips, canals and windmills.  Amsterdam, the capital, is home to the
                                                                Rijksmuseum, Van Gogh Museum and the house of Anne Frank.  While Amsterdam boasts of great sites
                                                                including a tour of the Heineken factory, a car and driver service can take you into the picturesque
                                                                Dutch countryside including Zaane Schans to visit a working windmill, to Volendam on the Markermeer
                                                                Lake, known for its fishing harbor, colorful houses and the Gouda cheese museum.</p>
                                                        </div>
                                                        <p onClick={() => setIsReadMore({ ...isReadMore, tenth: !isReadMore.tenth })} className='link-text'>{isReadMore.tenth ? 'Read Less' : 'Read More'}</p>
                                                    </div>
                                                </div>

                                                <div className="dest-container mt mb-xl">
                                                    <div className="dest-image">
                                                        <div className="linear-overlay"></div>
                                                        <img src="./assets/img/cliffs.jpg" alt="" />
                                                        <div className="dest-title">
                                                            <p className='white-text large-p mb-0'>Cliffs Of Mohr</p>
                                                            <p className='white-text mb-0 paraxs'><i class="fas fa-map-marker-alt"></i>Ireland</p>
                                                        </div>
                                                    </div>
                                                    <div className="dest-details">
                                                        <div className="text-overflow-container">
                                                            <p className={`paraxs mb-0 ${isReadMore.eleventh ? '' : 'text-overflow'}`}>Called the "Wild Atlantic Way", Western Ireland includes the stunningly beautiful Cliffs of Mohr. This
                                                                region is famous for its small towns, natural beauty and stunning coastline. This part of Ireland is vey
                                                                scenic, from Connemara to the Burren to the Dingle Peninsula.  Charming towns, green rolling hills,
                                                                friendly people and forty shades of green.  A car and driver can greatly enhance your visit by picking you
                                                                up at the airport and personally act as your tour guide as you glide through the splendid countryside
                                                                without worry for narrow lanes and errant sheep while stopping at your leisure for out of the way
                                                                restaurants and sites.</p>
                                                        </div>
                                                        <p onClick={() => setIsReadMore({ ...isReadMore, eleventh: !isReadMore.eleventh })} className='link-text'>{isReadMore.eleventh ? 'Read Less' : 'Read More'}</p>
                                                    </div>
                                                </div>

                                                <div className="dest-container mt mb-xl">
                                                    <div className="dest-image">
                                                        <div className="linear-overlay"></div>
                                                        <img src="./assets/img/copenhagen.jpg" alt="" />
                                                        <div className="dest-title">
                                                            <p className='white-text large-p mb-0'>Copenhagen</p>
                                                            <p className='white-text mb-0 paraxs'><i class="fas fa-map-marker-alt"></i>Denmark</p>
                                                        </div>
                                                    </div>
                                                    <div className="dest-details">
                                                        <div className="text-overflow-container">
                                                            <p className={`paraxs mb-0 ${isReadMore.twelveth ? '' : 'text-overflow'}`}>There are endless sights to see in the charming city of Copenhagen-- enjoy Danish design and visit
                                                                picturesque Nyhavn with its colorful houses, beautiful boats and many restaurants and bars.  When
                                                                you've experienced the city, let a car and driver service take you to Roskilde where you can find the
                                                                famous Viking Ship Museum, other museums and palaces plus view some beautiful Danish countryside
                                                                along the way.</p>
                                                        </div>
                                                        <p onClick={() => setIsReadMore({ ...isReadMore, twelveth: !isReadMore.twelveth })} className='link-text'>{isReadMore.twelveth ? 'Read Less' : 'Read More'}</p>
                                                    </div>
                                                </div>

                                                <div className="dest-container mt mb-xl">
                                                    <div className="dest-image">
                                                        <div className="linear-overlay"></div>
                                                        <img src="./assets/img/bruges.jpg" alt="" />
                                                        <div className="dest-title">
                                                            <p className='white-text large-p mb-0'>Bruges</p>
                                                            <p className='white-text mb-0 paraxs'><i class="fas fa-map-marker-alt"></i>Belgium</p>
                                                        </div>
                                                    </div>
                                                    <div className="dest-details">
                                                        <div className="text-overflow-container">
                                                            <p className={`paraxs mb-0 ${isReadMore.thirteenth ? '' : 'text-overflow'}`}>Bruges is the perfect city for romantic walks, medieval architecture, canals with swans and photogenic
                                                                market squares.  It also offers tasty mussels, Belgian fries, a diversity of great Belgian beers plus
                                                                delicious local chocolate.  Bruges is also known for making the most luxurious lace in the world.  A car
                                                                and driver service can take you from the Brussels airport directly to Bruges or sightseeing in the
                                                                beautiful countryside that boasts over 50 castles.</p>
                                                        </div>
                                                        <p onClick={() => setIsReadMore({ ...isReadMore, thirteenth: !isReadMore.thirteenth })} className='link-text'>{isReadMore.thirteenth ? 'Read Less' : 'Read More'}</p>
                                                    </div>
                                                </div>

                                                <div className="dest-container mt mb-xl">
                                                    <div className="dest-image">
                                                        <div className="linear-overlay"></div>
                                                        <img src="./assets/img/hallstat.jpg" alt="" />
                                                        <div className="dest-title">
                                                            <p className='white-text large-p mb-0'>Hallstatt</p>
                                                            <p className='white-text mb-0 paraxs'><i class="fas fa-map-marker-alt"></i>Austria</p>
                                                        </div>
                                                    </div>
                                                    <div className="dest-details">
                                                        <div className="text-overflow-container">
                                                            <p className={`paraxs mb-0 ${isReadMore.fourteenth ? '' : 'text-overflow'}`}>After a visit to Salzburg, a car and diver service can take you in comfort and convenience through the
                                                                scenic Austrian countryside filled with serene villages, mountain views and pristine lakes to the village of
                                                                Hallstatt. Its name means "place of salt" and its salt mines date back 7,000 years in this Celtic area of
                                                                Austria.  On a visit, take a train ride into the heart of the world’s oldest salt mine and enjoy its lake side
                                                                restaurants.  Take the funicular to the top of the Salzburg Mountain for spectacular views and
                                                                experience the famous Skywalk which extends over a sheer drop with the town below. </p>
                                                        </div>
                                                        <p onClick={() => setIsReadMore({ ...isReadMore, fourteenth: !isReadMore.fourteenth })} className='link-text'>{isReadMore.fourteenth ? 'Read Less' : 'Read More'}</p>
                                                    </div>
                                                </div>

                                            </Slider>
                                        </div>
                                    )
                                    :
                                    (
                                        <div style={{ position: 'relative' }}>
                                            <button className='slick-caret arrow-left' onClick={handlePrev}><i class="fa-solid fa-caret-left"></i></button>
                                            <button className='slick-caret arrow-right' onClick={handleNext}><i class="fa-solid fa-caret-right"></i></button>
                                            <Slider {...settings}
                                                ref={(slick) => setSlick(slick)}
                                            >
                                                <div className="dest-container mt">
                                                    <div className="dest-image">
                                                        <div className="linear-overlay"></div>
                                                        <img src="./assets/img/iStock-176404846.jpg" alt="" />
                                                        <div className="dest-title">
                                                            <p className='white-text large-p mb-0'>Weddings</p>
                                                            {/* <p className='white-text mb-0 paraxs'><i class="fas fa-map-marker-alt"></i>Italy</p> */}
                                                        </div>
                                                    </div>
                                                    <div className="dest-details">
                                                        <div className="text-overflow-container">
                                                            <p className={`paraxs mb-0 ${isReadMore.first ? '' : 'text-overflow'}`}>Enhance your wedding with the perfect chauffeur driven limo service.  Imagine arriving in style. Memories made all the more magical with a limo service.  Booking through GlobalCarTreks.com will enable you to select and receive quotes from various companies so you can compare prices and select the limo that best meets your needs.  The elegance of your special day will be enhanced by this service for the bridal party and guests.</p>
                                                        </div>
                                                        <p onClick={() => setIsReadMore({ ...isReadMore, first: !isReadMore.first })} className='link-text read_text'>{isReadMore.first ? 'Read Less' : 'Read More'}</p>
                                                    </div>
                                                </div>

                                                <div className="dest-container mt">
                                                    <div className="dest-image">
                                                        <div className="linear-overlay"></div>
                                                        <img src="./assets/img/iStock-1165712069.jpg" alt="" />
                                                        <div className="dest-title">
                                                            <p className='white-text large-p mb-0'>Businessperson</p>
                                                            {/* <p className='white-text mb-0 paraxs'><i class="fas fa-map-marker-alt"></i>Germany</p> */}
                                                        </div>
                                                    </div>
                                                    <div className="dest-details">
                                                        <div className="text-overflow-container">
                                                            <p className={`paraxs mb-0 ${isReadMore.second ? '' : 'text-overflow'}`}>Take the worry and stress out of your next business trip by booking a limo service through GlobalCarTreks.com. is Door to door service, no searching at the airport for a parking space and no parking fees; Once you arrive, a scheduled limo is waiting to pick you up and take you to your hotel or meeting place without wasting further time in a taxi queue. Your limo can also be scheduled for a night out on the town avoiding the hassle of finding your location in unfamiliar neighborhoods and traffic.</p>
                                                        </div>
                                                        <p onClick={() => setIsReadMore({ ...isReadMore, second: !isReadMore.second })} className='link-text'>{isReadMore.second ? 'Read Less' : 'Read More'}</p>
                                                    </div>
                                                </div>

                                                <div className="dest-container mt mb-xl">
                                                    <div className="dest-image">
                                                        <div className="linear-overlay"></div>
                                                        <img src="./assets/img/iStock-532171563.jpg" alt="" />
                                                        <div className="dest-title">
                                                            <p className='white-text large-p mb-0'>Celebrations and Parties</p>
                                                            {/* <p className='white-text mb-0 paraxs'><i class="fas fa-map-marker-alt"></i>Spain</p> */}
                                                        </div>
                                                    </div>
                                                    <div className="dest-details">
                                                        <div className="text-overflow-container">
                                                            <p className={`paraxs mb-0 ${isReadMore.third ? '' : 'text-overflow'}`}>Whatever the occasion, from concerts/events to special birthdays/anniversaries or Proms and Bachelor and Bachelorette parties, a limo service booked through GlobalCarTreks.com will totally enhance your overall experience.  Relax in style and enjoy your time as someone else does the driving.  No worries about drinking and driving. This luxury vehicle enhances any occasions, making it a standout event.</p>
                                                        </div>
                                                        <p onClick={() => setIsReadMore({ ...isReadMore, third: !isReadMore.third })} className='link-text'>{isReadMore.third ? 'Read Less' : 'Read More'}</p>
                                                    </div>
                                                </div>

                                                <div className="dest-container mt mb-xl">
                                                    <div className="dest-image">
                                                        <div className="linear-overlay"></div>
                                                        <img src="./assets/img/iStock-0519806395.png" alt="" />
                                                        <div className="dest-title">
                                                            <p className='white-text large-p mb-0'>Sightseeing</p>
                                                            {/* <p className='white-text mb-0 paraxs'><i class="fas fa-map-marker-alt"></i>Monaco</p> */}
                                                        </div>
                                                    </div>
                                                    <div className="dest-details">
                                                        <div className="text-overflow-container">
                                                            <p className={`paraxs mb-0 ${isReadMore.fourth ? '' : 'text-overflow'}`}>There is no better way to see the sights than with your own limo service booked through GlobalCarTreks.com. Dropped off right at the door for your convenience regardless of the location.   No parking to worry about, no parking meters, and no waiting.  Perfect for groups who want to enjoy an outing together.  Make it a pleasant and exceptional experience.</p>
                                                        </div>
                                                        <p onClick={() => setIsReadMore({ ...isReadMore, fourth: !isReadMore.fourth })} className='link-text'>{isReadMore.fourth ? 'Read Less' : 'Read More'}</p>
                                                    </div>
                                                </div>

                                            </Slider>
                                        </div>
                                    )
                            }


                        </div>

                        <div className="bottomnav-space"></div>
                        <BottomNavbar user='1' />
                        {/* </div> */}
                    </div>
                )
            }
        </>
    )
}

export default UserDashboard