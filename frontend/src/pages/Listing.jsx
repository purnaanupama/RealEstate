import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../css/listing.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { FaBed } from 'react-icons/fa';
import { FaParking } from 'react-icons/fa';
import { FaCouch } from 'react-icons/fa';
import { FaSink } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import Contact from '../components/Contact';


const Listing = () => {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [contact, setContact] = useState(false);
  const params = useParams();
  const {currentUser} = useSelector(state=>state.user)

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.ListingId}`);
        const data = await res.json();
        if (data.success === false) {
          console.log(data.message);
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
      } catch (error) {
        console.error('Fetch listing error:', error);
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.ListingId]);

  return (
    <div className='listingContainer'>
      {loading && <p className='loading'>Loading...</p>}
      {error && <p className='loading'>Something went wrong...</p>}
      {listing && !loading && !error && (
        <div>
          <div className='HouseSlider'>
            <Swiper navigation>
              {listing.imageUrls && listing.imageUrls.map((url, index) => (
                <SwiperSlide key={url}>
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
              ))}
            </Swiper>
          </div>
          <div className="DetailWrapper">
            <h2 className='houseName'>
              {listing.name}&nbsp;&nbsp;
              {listing.type==='rent'&&<span className='spanPrice'>{`$ ${listing.regularPrice.toLocaleString('en-US')} /month`}</span>}
              {listing.type==='sale'&&<span className='spanPrice'>{`$ ${listing.regularPrice.toLocaleString('en-US')}`}</span>}
           </h2>
            <p className='houseAddress'><FaMapMarkerAlt style={{ color: 'green',fontSize:'20px' }} />&nbsp;&nbsp;{listing.address}</p>
            <div className="specialDetails">
            {listing.discountPrice > 0?<p>Discount ${listing.discountPrice.toLocaleString('en-US')}</p>:<p>No Discount</p>}
            {<p>For {listing.type}</p>}
            </div>
            <div className="houseDescription">
             <span style={{fontWeight:'600'}}>Description : </span>{listing.description}
            </div>
            <div className="specifications">
              <p><FaBed style={{ color: 'green',fontSize:'20px' }} />{listing.bedrooms} Bedrooms</p>
              <p><FaSink style={{ color: 'green',fontSize:'20px' }} />{listing.bathrooms} Bathrooms</p>
              {listing.parking&&<p><FaParking style={{ color: 'green',fontSize:'20px' }}/>Parking</p>}
              {listing.furnished &&<p><FaCouch style={{ color: 'green',fontSize:'20px' }} />Furnished</p>}
            </div>
          </div>
          {!contact && currentUser && listing.userRef !== currentUser._id && (
               <button onClick={()=>{setContact(true)}} className='contactOwner'>Contact landowner</button>
          )}
          {contact&& <Contact listing={listing}/>}
        </div>
      )}
    </div>
  );
};

export default Listing;