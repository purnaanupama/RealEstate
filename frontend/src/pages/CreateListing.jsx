import '../css/createListing.css'
import { useState } from 'react'
import {getStorage, uploadBytesResumable,ref, getDownloadURL} from 'firebase/storage'
import {app} from '../../firebase'

const CreateListing = () => {
  const [files,setFiles]=useState([])
  const [formData,setFormData] =useState({
    imageUrls:[],
  })
  const [imageUploadError,setImageUploadError]=useState(false);
  const [uploading,setUploading] = useState(false);

  console.log(formData);
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
            <input type="number" name="" id="name" placeholder='No. of Bedrooms'/>
            <input type="number" name="" id="name" placeholder='No. of Bathrooms'/>
            </div>
            <label className='rp'>Regular Price ($/month)
            <input className='regular-price' type="number" name="" id="name" defaultValue={0}/>
            </label>
           
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
           <button className='create'>Create Listing</button>
         
          </div>
         </form>
    </div>
  )
}

export default CreateListing