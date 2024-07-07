import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../css/listing.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';

const Listing = () => {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const params = useParams();

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
        setLoading(false);
        setListing(data);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.ListingId]);

  return (
    <main>
      {loading && <p className='loading'>Loading...</p>}
      {error && <p className='loading'>Something went wrong...</p>}
      {listing && !loading && !error && (
        <div>
          <Swiper navigation>
            {listing.imageUrls.map((url, index) => (
              <SwiperSlide key={url}>
                <div
                  className='swiper-slide'
                  style={{
                    position: 'relative',
                    backgroundImage: `url(${url})`,
                    height: '550px',
                    width: '100%',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <p className='overlay-text'>
                    {listing.name}
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </main>
  );
};

export default Listing;