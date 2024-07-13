import {useEffect, useState} from 'react'
import '../css/search.css'
import {useNavigate} from 'react-router-dom'
import ListingCard from '../components/ListingCard'


const Search = () => {
  const navigate = useNavigate()
  const [sidebardata,setSidebardata]=useState({
    searchItem:'',
    type:'all',
    parking:false,
    furnished:false,
    offers:false,
    sort:'created_at',
    order:'desc'
  })

  const [loading,setLoading]=useState(false)
  const [listings,setListings]=useState('')
  console.log(listings)
  useEffect(()=>{
    const urlParams = new URLSearchParams(location.search)
    const searchTermFromUrl = urlParams.get('searchItem')
    const typeFromUrl = urlParams.get('type')
    const parkingFromUrl = urlParams.get('parking')
    const furnishedFromUrl = urlParams.get('furnished')
    const offerFromUrl = urlParams.get('offers')
    const sortFromUrl = urlParams.get('sort')
    const orderFromUrl = urlParams.get('order')
    if(searchTermFromUrl||typeFromUrl||parkingFromUrl||furnishedFromUrl||offerFromUrl||sortFromUrl||orderFromUrl )
      {
      setSidebardata({
        searchItem: searchTermFromUrl||'',
        type:typeFromUrl||'all',
        parking:parkingFromUrl==='true'?true:false,
        furnished:furnishedFromUrl==='true'?true:false,
        offers:offerFromUrl==='true'?true:false,
        sort:sortFromUrl||'created_at',
        order:orderFromUrl||'desc'
      })    
    }
    const fetchListings = async()=>{
      try {
      setLoading(true)
      const query = urlParams.toString();
      const response= await fetch(`/api/listing/get?${query}`)
      const data = await response.json();
        setListings(data)
        setLoading(false)
      } catch (error) {
        console.log(error);
        setLoading(false)
      }
      }
    fetchListings();  
  },[location.search])

  const handleChange=(e)=>{
    if(e.target.id ==='all'||e.target.id==='rent'||e.target.id==='sale'){
        setSidebardata({...sidebardata,type:e.target.id})
    }
    if(e.target.id === 'searchItem'){
        setSidebardata({...sidebardata,searchItem:e.target.value})
    }
    if(e.target.id ==='parking' || e.target.id ==='furnished' || e.target.id ==='offers'){
        setSidebardata({...sidebardata,[e.target.id]:e.target.checked||e.target.checked==='true'?true:false})
    }
    if(e.target.id === 'sort_order'){
      const sort = e.target.value.split('_')[0]||'created_at';
      const order = e.target.value.split('_')[1]||'desc';
      setSidebardata({...sidebardata,sort,order})
    }
  }
  const handleSubmit=(e)=>{
    e.preventDefault()
    const urlParams = new URLSearchParams()
    urlParams.set('searchItem',sidebardata.searchItem)
    urlParams.set('type',sidebardata.type)
    urlParams.set('parking',sidebardata.parking)
    urlParams.set('furnished',sidebardata.furnished)
    urlParams.set('offers',sidebardata.offers)
    urlParams.set('sort',sidebardata.sort)
    urlParams.set('order',sidebardata.order)
    const searchQuery = urlParams.toString()
    navigate(`/search?${searchQuery}`)
  }
  
  return (
    <div className='mainContainer'>
       <div className="leftSide">
         <form className='form4' onSubmit={handleSubmit}>
            <div className="searchBar2">
                 <span style={{width:'200px'}}>Search Term :</span>
                 <input type="text" 
                 value={sidebardata.searchItem}
                 onChange={handleChange}
                 id='searchItem'
                 placeholder='Search...'
                 readOnly={true}
                 />
            </div>
            <div className="filters">
                <p>House Type </p>
                 <label>Sale and Rent
                 <input 
                 type="checkbox"  
                 id='all'
                 onChange={handleChange} 
                 checked={sidebardata.type==='all'}/>
                 </label>
                 <label>Sale
                 <input 
                 type="checkbox" 
                 id='sale'
                 checked={sidebardata.type==='sale'}
                 onChange={handleChange} 
                />
                 </label>
                 <label>Rent
                 <input 
                 type="checkbox"  
                 id='rent'
                 onChange={handleChange} 
                 checked={sidebardata.type==='rent'}/>
                 </label>
                 <label>Offer
                 <input type="checkbox"  id="offers"
                  onChange={handleChange} 
                  checked={sidebardata.offers}/>
                 </label>
                 <p>Amenities </p>
                 <label>Parking
                 <input type="checkbox"
                  id="parking" 
                  onChange={handleChange} 
                  checked={sidebardata.parking}/>
                 </label>
                 <label>Furnished
                 <input 
                 type="checkbox" 
                 id="furnished" 
                 onChange={handleChange} 
                 checked={sidebardata.furnished}/>
                 </label>
            </div>
            <p style={{fontSize:'17px',fontWeight:'500',marginLeft:'30px',marginBottom:'20px',marginTop:'15px'}}>Sort </p>
            <select 
            onChange={handleChange} 
            id='sort_order' 
            className="amenitiesDropdown"
            defaultValue={'created_at_desc'}>
                 <option value='regularPrice_desc'>Price high to low</option>
                 <option value='regularPrice_asc'>Price low to high</option>
                 <option value='createdAt_desc'>Latest listings</option>
                 <option value='createdAt_asc'>Oldest listings</option>
            </select><br/>
            <button type='submit' className='searchForHouses'>SEARCH</button>
         </form>
        </div> 
        <div className="rightSide">
           <h2>Listing results :</h2>
           {loading &&<p style={{padding:'50px'}}>Loading Data...</p>}
           {!loading && listings.length < 1 &&<p className='noValues'>No Results Found...</p>}
           <div className="cardsContainer"  style={{display:'flex',flexWrap:'wrap',padding:'40px',gap:'30px',alignItems:'center',justifyContent:'center'}} >
           {!loading && listings && listings.map((listing)=>{
                return <ListingCard key={listing._id} Listing={listing}/>
           })}
           </div>
        
        </div>
    </div>
  )
  }

export default Search;