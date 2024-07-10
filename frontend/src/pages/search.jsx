import React from 'react'
import '../css/search.css'

const Search = () => {
  return (
    <div className='mainContainer'>
       <div className="leftSide">
         <form className='form4'>
            <div className="searchBar2">
                 <span style={{width:'200px'}}>Search Term :</span>
                 <input type="text" 
                 id='searchItem'
                 placeholder='Search...'
                 />
            </div>
            <div className="filters">
                <p>House Type </p>
                 <label htmlFor="">Sale and Rent
                 <input type="checkbox"  id="all" />
                 </label>
                 <label htmlFor="">Sale
                 <input type="checkbox" id="sale" />
                 </label>
                 <label htmlFor="">Rent
                 <input type="checkbox"  id="rent" />
                 </label>
                 <label htmlFor="">Offer
                 <input type="checkbox"  id="offers" />
                 </label>
                 <p>Amenities </p>
                 <label htmlFor="">Parking
                 <input type="checkbox" id="parking" />
                 </label>
                 <label htmlFor="">Furnished
                 <input type="checkbox" id="furnished" />
                 </label>
            </div>
            <p style={{fontSize:'17px',fontWeight:'500',marginLeft:'30px',marginBottom:'20px',marginTop:'15px'}}>Sort </p>
            <select id='sord_order' className="amenitiesDropdown">
                 <option value="">Price high to low</option>
                 <option value="wifi">Price low to high</option>
                 <option value="parking">Latest listings</option>
                 <option value="pool">Oldest listings</option>
            </select><br/>
            <button type='button' className='searchForHouses'>SEARCH</button>
         </form>
        </div> 
        <div className="rightSide">
           <h2>Listing results :</h2>
        </div>
    </div>
  )
}

export default Search;