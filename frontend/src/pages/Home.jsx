import '../css/home.css'
import {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import ListingCard from '../components/ListingCard'

const Home = () => {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation]);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const response = await fetch('/api/listing/get?offers=true&limit=4')
        const data = await response.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    }
    fetchOfferListings();
    
    const fetchRentListings = async () => {
      try {
        const response = await fetch('/api/listing/get?type=rent&limit=4')
        const data = await response.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    }
    
    const fetchSaleListings = async () => {
      try {
        const response = await fetch('/api/listing/get?type=sale&limit=4')
        const data = await response.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    }
  }, []);

  return (
    <>
    <div className='homeContainer'>
      {/* Top */}
      <div className='top'>
        <h2 style={{boxShadow:'2px 1px 5px 1px rgb(186, 177, 177)'}}>
          <span>Welcome to <span>EstateEase</span></span> - Your Ultimate Real Estate Marketplace, where we connect buyers, sellers, and renters with a seamless, efficient, and enjoyable experience, transforming the way you navigate the world of real estate.
        </h2>
        <p style={{boxShadow:'2px 1px 5px 1px rgb(186, 177, 177)'}}>
          EstateEase is proud to be based in the vibrant city of Colombo, Sri Lanka, a hub of cultural and economic activity. Our deep-rooted presence in this bustling market has given us unparalleled insights and expertise in the local real estate landscape. With over 50 years of legacy in estate marketing and selling, we bring a wealth of experience and a proven track record of success to our platform.
        </p>
      </div>
      <Link className='filterPage' to={"/search"}>Get Started Now...</Link>
      {/* Middle */}
      <div className='offerSlider'>
        <Swiper navigation>
          {offerListings.length > 0 && offerListings.map((listing) => (
            listing.imageUrls && listing.imageUrls.map((url) => (
              <SwiperSlide className='offerSlide' key={url}>
                <div
                  className='swiper-slide'
                  style={{
                    position: 'relative',
                    backgroundImage: `url(${url})`,
                    height: '450px',
                    width: '100%',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <p className='overlay-text'>
                    Experience unparalleled luxury in this stunning 5-bedroom, 3-bathroom home. Featuring exquisite design, spacious living areas, and top-tier amenities, this residence offers elegance and comfort. Nestled in a prestigious neighborhood, it's the perfect retreat for those seeking refined living. Discover your dream home today!
                  </p>
                </div>
              </SwiperSlide>
            ))
          ))}
        </Swiper>
        <div className="recentOffers">
         <h3 style={{fontWeight:'500',background:' linear-gradient(90deg, rgba(29,28,28,1) 0%, rgba(79,78,78,1) 37%, rgba(255,255,255,1) 100%)',paddingLeft:'10px',height:'35px',display:"flex",alignItems:"center",color:"white"}} >Recent Offers</h3>
         <Link className='Link' to={'/search?offers=true'}>
         <p style={{color:'rgb(51, 51, 51)',padding:'20px'}}>Show more offers</p>
          </Link>
         <div className="recentOffersWrapper">
         {
          offerListings.map((Listing)=>{
            return <ListingCard Listing={Listing} key={Listing._id}/>
          }
          )
         }
         </div>
   
        </div>
        <div className="recentOffers">
         <h3 style={{fontWeight:'500',background:' linear-gradient(90deg, rgba(29,28,28,1) 0%, rgba(79,78,78,1) 37%, rgba(255,255,255,1) 100%)',paddingLeft:'10px',height:'35px',display:"flex",alignItems:"center",color:"white"}}>For Sale</h3>
         <Link className='Link' to={'/search?type=sale'}>
         <p style={{color:'rgb(51, 51, 51)',padding:'20px'}}>Show more houses for sale</p>
          </Link>
         <div className="recentOffersWrapper">
         {
          saleListings.map((Listing)=>{
            return <ListingCard Listing={Listing} key={Listing._id}/>
          }
          )
         }
         </div>
   
        </div>
        <div className="recentOffers">
         <h3 style={{fontWeight:'500',background:' linear-gradient(90deg, rgba(29,28,28,1) 0%, rgba(79,78,78,1) 37%, rgba(255,255,255,1) 100%)',paddingLeft:'10px',height:'35px',display:"flex",alignItems:"center",color:"white"}} >For Rent</h3>
         <Link className='Link' to={'/search?type=rent'}>
         <p style={{color:'rgb(51, 51, 51)',padding:'20px'}}>Show more houses for rent</p>
          </Link>
         <div className="recentOffersWrapper">
         {
          rentListings.map((Listing)=>{
            return <ListingCard Listing={Listing} key={Listing._id}/>
          }
          )
         }
         </div>
   
        </div>
       
         
      </div>
     

    </div>
     {/* Bottom */}
     <div className='contactSection'>
     <div className="contactLeft">
      <p>Contact</p>
      <ul>
        <li>Telephone : +94 11 2345678 / +94 11 23345678</li>
        <li>Address (head-office) : No. 15, Temple Road Nugegoda 10250 Sri Lanka</li>
        <li>Email : estateease.contact@gmail.com</li>
        <li>Open hours : 10:00 AM to 06:00 PM</li>
      </ul>
     </div>
     <div className="contactMiddle">
        <p>Branches</p>
        <ul>
        <li>Nugegoda</li>
        <li>Maharagama</li>
        <li>Ja-ela</li>
        <li>Minuwangoda</li>
      </ul>
     </div>
     <div className="contactRight">
     <p>Web Design and Development by Purna Anupama</p>
     <p>purna-anupama-portfolio.netlify.app</p>
     </div>
   </div>
  </>
  );
}

export default Home;
