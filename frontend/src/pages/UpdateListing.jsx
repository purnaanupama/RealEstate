
import '../css/createListing.css'
import { useEffect, useState } from 'react'
import {getStorage, uploadBytesResumable,ref, getDownloadURL} from 'firebase/storage'
import {app} from '../../firebase'
import { useSelector } from 'react-redux'
import { useNavigate,useParams } from 'react-router-dom'

const UpdateListing = () => {
  const [files,setFiles]=useState([])
  const [formData,setFormData] =useState({
    imageUrls:[],
    name:'',
    description:'',
    address:'',
    type:'rent',
    bedrooms:1,
    bathrooms:1,
    regularPrice:5000,
    discountPrice:0,
    offers:false,
    parking:false,
    furnished:false
  });
  const [imageUploadError,setImageUploadError]=useState(false);
  const [uploading,setUploading] = useState(false);
  const [error,setError] = useState(false);
  const [loading,setLoading]=useState(false);
  const {currentUser}=useSelector(state=>state.user);
  const navigate = useNavigate();
  const params = useParams();

  useEffect(()=>{
   const fetchListing = async()=>{
      const listingId = params.ListingId;
      const res = await fetch(`/api/listing/get/${listingId}`)
      const data = await res.json();
      if(data.success === false){
        console.log(data.message);
        return;
      }
      setFormData(data)
   }
   fetchListing()
  },[]);

  const handleImageSubmit = () => {
    if (files.length > 0 && files.length+formData.imageUrls.length < 7) {
      setUploading(true);
      const promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises).then((urls) => {
        setFormData({...formData, imageUrls: formData.imageUrls.concat(urls)
        });
        setUploading(false);
      }).catch((err)=>{
        setImageUploadError('Image upload failed (4mb max per image)');
        setUploading(false);
      })
    }else{
      setImageUploadError('You can only upload 6 images per listing');
      setUploading(false);
    }
    }
  
  const storeImage = async(file)=>{
    return new Promise((resolve,reject)=>{
      const storage = getStorage(app);
      const fileName = new Date().getTime()+file.name;
      const storageRef = ref(storage,fileName)
      const uploadTask = uploadBytesResumable(storageRef,file)
      uploadTask.on(
        "state_changed",
        (snapshot)=>{
          const progress=(snapshot.bytesTransferred/snapshot.totalBytes)*100;
          console.log(`Upload is ${progress}% done`);
        },
          (error)=>{
            reject(error)
          },
          ()=>{
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
              resolve(downloadURL)
            })
          }
      )
    })
  }

  const handleRemoveImage = (index)=>{
    setFormData({
      ...formData,
      imageUrls:formData.imageUrls.filter((_,i)=>i!==index)
    })
  }
  const handleChange=(e)=>{
    if(e.target.id==='sale' || e.target.id==='rent'){
      setFormData({
        ...formData,
        type:e.target.id
      })
    }
    if(e.target.id==='parking'||e.target.id==='furnished'||e.target.id==='offers'){
      setFormData({
        ...formData,
        [e.target.id]:e.target.checked
      })
    }
    if(e.target.type==='number'||e.target.type==='text'||e.target.type==='textarea'){
      setFormData({
        ...formData,
        [e.target.id]:e.target.value
      })
    }
  }
  const handleSubmit=async(e)=>{
 e.preventDefault();
 try {
  if(formData.imageUrls.length < 1)return setError('You must upload atleast one image');
  if(+formData.regularPrice < +formData.discountPrice)return setError('Discount price must be lower than regular price')
  setLoading(true);
  setError(false);
  const res = await fetch(`/api/listing/update/${params.ListingId}`,{
    method:'POST',
    headers:{
      'Content-Type':'application/json'
    },
    body:JSON.stringify({
      ...formData,
      userRef:currentUser._id
    }),
  });
  const data = await res.json();
  setLoading(false);
  if(data.status==='fail'){
    setError(data.message)
    console.log(data);
    return;
  }
  navigate(`/listing/${data._id}`)
 } catch (error) {
  setError(error)
  setLoading(false);
 }
  }
  return (
    <div className='list-creator'>
        <h1>Update Listing</h1>
         <form className='list-form'>
          <div className="left">
           <input type="text" name="" id="name" placeholder='Enter Name' onChange={handleChange} value={formData.name}/>
           <textarea name="" id="description" placeholder="decription..." onChange={handleChange} value={formData.description}/>
           <input type="text" name="" id="address" placeholder="Enter Address"
            maxLength="500" onChange={handleChange} value={formData.address}/>
            <div className='checkbox'>
            <label>
                For Sale
                <input type="checkbox"  
                id='sale' 
                onChange={handleChange}
                checked={formData.type==='sale'}
                />
            </label>
            <label>
            For Rent
                <input type="checkbox" 
                id='rent'
                onChange={handleChange}
                checked={formData.type==='rent'}/>
            </label>
            <label>
            Parking
                <input type="checkbox" 
                id='parking'
                onChange={handleChange}
                checked={formData.parking}/>
            </label>
            <label>
            Furnished
                <input type="checkbox" 
                id='furnished'
                onChange={handleChange}
                checked={formData.furnished}
                />
            </label>
            <label>
            Offers
            <input type="checkbox" 
            id='offers'
            onChange={handleChange}
            checked={formData.offer}/>
            </label> 
            </div>
            <div className='set'>
            <input 
            type="number" 
            name="" 
            id="bedrooms" 
            placeholder='No. of Bedrooms'
            onChange={handleChange}
            value={formData.bedrooms}
            />
            <input 
            type="number" 
            name="" 
            id="bathrooms" 
            placeholder='No. of Bathrooms'
            onChange={handleChange}
            value={formData.bathrooms}
            />
            </div>
            <label className='rp'>Regular Price ($/month)
            <input 
            className='regular-price'
            min={250}
            max={100000}
            type="number" 
            name="" 
            id="regularPrice" 
            defaultValue={0}
            onChange={handleChange}
            value={formData.regularPrice}/>
            </label>
            {formData.offers && 
             <label className='rp'>Discount Price ($/month)
             <input 
             className='regular-price'
             min={0}
             max={100000}
             type="number" 
             name="" 
             id="discountPrice" 
             defaultValue={0}
             onChange={handleChange}
             value={formData.discountPrice}/>
             </label>
            }
           
          </div>
       
          <div className="right">
          <p>Images : <span style={{color:'#343434'}}>The first image will be the cover ( max 6 images )</span></p>
           <div className="uploadFile">
             <input type="file" id='images' onChange={(e)=>{setFiles(e.target.files)}} accept='image/*' multiple/>
             <button disabled={uploading} type='button' onClick={handleImageSubmit}>{uploading?'Uploading...':'Upload'}</button>
           </div>
           {imageUploadError && <p style={{padding:'5px 8px',border:'1px solid red',borderRadius:'5px',background:'#F3ABAB',color:'#AE1A1A',marginTop:'30px',fontSize:'14px'}}>{imageUploadError}</p>}
           <div className='listingImages'>
           {formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
              <div key={url} className='imageWrapper'>
              <img src={url} alt='listing image' style={{ width:'250px',height:'250px' }} />
              <button type='button' onClick={()=>{handleRemoveImage(index)}}>Delete</button>
              </div>
            ))}
           </div>
           <button className='create' disabled={loading || uploading} onClick={handleSubmit}>{loading ? 'Updating...':'Update Listing'}</button>
          {error && <p className='error'>{error}</p>}
          </div>
         </form>
    </div>
  )
}

export default UpdateListing