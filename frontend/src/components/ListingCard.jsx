import '../css/listingCard.css'
import { Link } from 'react-router-dom'
import { FaMapMarkerAlt } from 'react-icons/fa';

const ListingCard = ({Listing}) => {
  return (
    <Link style={{textDecoration:'none',color:'black'}} to={`/listing/${Listing._id}`}>
        <div className="cardContainer">
           <img src={Listing.imageUrls[0]} alt="coverImage" />
           <div className="cardDetails">
           <p className='title'>{Listing.name}</p>
           <div className="addressContainer" style={{display:'flex',width:'100%',alignItems:'center',gap:'2px'}}>
           <FaMapMarkerAlt style={{ color: 'green',fontSize:'12px'}} />
           <p className='address'>{Listing.address}</p>
           </div>
           <p className='description'>{Listing.description}</p>
           {Listing.type==='rent'?
             <div className="listingType">
                <p className='price' style={{background:'rgb(46, 76, 229)',color:'white',padding:'3px 8px',borderRadius:'4px'}}>${Listing.regularPrice.toLocaleString('en-US')}/month</p>
                <p style={{background:'#8A2251',color:'white',padding:'3px 8px',borderRadius:'4px'}}>{Listing.type}</p>
             </div>
             :
             <div className="listingType">
             <p className='price' style={{background:'rgb(46, 76, 229)',color:'white',padding:'3px 8px',borderRadius:'4px'}}>${Listing.regularPrice.toLocaleString('en-US')}</p>
             <p  style={{background:'green',color:'white',padding:'3px 8px',borderRadius:'4px'}}>{Listing.type}</p>
          </div>}
           </div>
        </div>
    
    </Link>

  )
}

export default ListingCard