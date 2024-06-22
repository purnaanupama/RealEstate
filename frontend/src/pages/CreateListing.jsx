import '../css/createListing.css'

const CreateListing = () => {
  return (
    <div className='list-creator'>
        <h1>Create Listing</h1>
         <form className='list-form'>
          <div className="left">
           <input type="text" name="" id="name" placeholder='Enter Name'/>
           <textarea name="" id="description" placeholder="decription..."/>
           <input type="text" name="" id="name" placeholder="Enter Address"
            maxLength="500"/>
            <div className='checkbox'>
            <label>
                For Sale
                <input type="checkbox"/>
            </label>
            <label>
            For Rent
                <input type="checkbox"/>
            </label>
            <label>
            Parking
                <input type="checkbox"/>
            </label>
            <label>
            Furnished
                <input type="checkbox"/>
            </label>
            <label>
            Offers
            <input type="checkbox"/>
            </label> 
            </div>
            <div className='set'>
            <input type="text" name="" id="name" placeholder='No. of Bedrooms'/>
            <input type="text" name="" id="name" placeholder='No. of Bathrooms'/>
            </div>
            <label className='rp'>Regular Price ($/month)
            <input className='regular-price' type="text" name="" id="name" defaultValue={0}/>
            </label>
           
          </div>
       
          <div className="right">
          <p>right</p>

          </div>
         </form>
    </div>
  )
}

export default CreateListing