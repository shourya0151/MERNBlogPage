import { Alert, Button, TextInput } from 'flowbite-react';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { getStorage, 
    ref, 
    uploadBytesResumable, 
    getDownloadURL } 
    from "firebase/storage";
import { useDispatch } from 'react-redux';
//circular progress bar
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { updateStart,updateSuccess,updateFailure } from '../redux/user/userSlice';


export default function DashProfile() {
    const {currentUser} = useSelector((state) => state.user);
    const [imageFile,setImageFile] = useState(null);
    const [imageFileUrl, setImageFileUrl] = useState(null);
    const [imageFileUploadingProgress,setimageFileUploadingProgress] = useState(0);
    const [imageFileUploadError,setImageFileUploadError] = useState(null);    //making reference for choosing image usiing profile pic
    const [imageFileUploading,setimageFileUploading] = useState(false);
    const [formData,setFormData] = useState({});
    const [updateUserSuccess,setUpdateUserSuccess] = useState(null);
    const [updateUserError,setUpdateUserError] = useState(null);
    const filePickerRef = useRef();
    const dispatch = useDispatch();

    

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file){
            setImageFile(file);
            setImageFileUrl(URL.createObjectURL(file));//to create local url and set it to the img src

        }
    }

    useEffect(()=>{
        if (imageFile){
            uploadImage();
        }
    }, [imageFile]);

    const uploadImage = async ()=>{
        setimageFileUploading(true);
        setImageFileUploadError(null)
        const fileName = new Date().getTime() + imageFile.name;
        
        // Get a reference to the storage service, which is used to create references in your storage bucket
        const storage = getStorage();

        // Create a storage reference from our storage service
        const storageRef = ref(storage,fileName);
        const uploadTask = uploadBytesResumable(storageRef,imageFile)
         uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setimageFileUploadingProgress(progress.toFixed(0));
            },
            (error)=>{
                setImageFileUploadError('Could not upload image');
                setimageFileUploadingProgress(null);
                setImageFile(null);
                setImageFileUrl(null);
                setimageFileUploading(false);
            },
            ()=>{
                // Upload completed successfully, now we can get the download URL
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImageFileUrl(downloadURL);
                    setFormData({...formData, profilePicture: downloadURL});
                    setimageFileUploading(false);
                });
            }

         )
    
    };

    const handleChange = (e)=>{
        setFormData({...formData,[e.target.id]:e.target.value});
    };

    const handleSubmit = async (e) =>{
        e.preventDefault();
        setUpdateUserError(null);
        setUpdateUserSuccess(null);
        
        //chekc if form data is empty or not

        if (Object.keys(formData).length === 0){
            setUpdateUserError('No changes made');
            return;
        }
        if(imageFileUploading){
            setUpdateUserError('Please wait for the image to upload');
            return;
        }
        try{
            dispatch(updateStart());
            const res = await fetch(`api/user/update/${currentUser._id}`,{
                method: 'PUT',
                headers:{
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if(!res.ok){
                setUpdateUserError(data.message);
                dispatch(updateFailure(data.message));
                return;
            }else{
                setUpdateUserSuccess("User Profile updated successfully");
                dispatch(updateSuccess(data));
                
            }
        } catch(err){
            dispatch(updateFailure(err.message));
        }

    }

    console.log(updateUserSuccess);


  return (
    
        <div className='mx-auto p-3 max-w-lg w-full'>
            <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
            <form className='flex flex-col gap-4'onSubmit={handleSubmit}>
                <input type="file" accept='image/*' 
                onChange={handleImageChange} 
                ref={filePickerRef} 
                hidden/>
                <div className='relative w-32 h-32 self-center cursor-pointer shadow-md
                overflow-hidden rounded-full' 
                onClick={ () => filePickerRef.current.click()}>
                    
                    {imageFileUploadingProgress && (
                        <CircularProgressbar 
                            value={imageFileUploadingProgress || 0}
                            text={`${imageFileUploadingProgress}%`}
                            strokeWidth={5}
                            styles={{
                                root: {
                                width: '100%',
                                height: '100%',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                },
                                path: {
                                stroke: `rgba(62, 152, 199, ${
                                    imageFileUploadingProgress / 100
                                })`,
                                },
                            }}

                        />
                    )}
                    <img
                    src={imageFileUrl || currentUser.profilePicture}
                        alt='user'
                        className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
                        imageFileUploadingProgress &&
                        imageFileUploadingProgress < 100 &&
                        'opacity-60'
                        }`}
                    />
                </div>
                {imageFileUploadError && (
                    <Alert color='failure'>
                        {imageFileUploadError}
                        
                    </Alert>
                )}
                <TextInput
                    type='text'
                    id='username'
                    placeholder='username'
                    defaultValue={currentUser.username} onChange={handleChange}
                />
                <TextInput
                    type='email'
                    id='email'
                    placeholder='email'
                    defaultValue={currentUser.email} onChange={handleChange}
                />
                <TextInput
                    type='password'
                    id='password'
                    placeholder='Password' onChange={handleChange}
                />
                <Button type='submit' gradientDuoTone='purpleToBlue' outline>
                    Update
                </Button>
            </form>


            <div className='flex justify-between text-red-500 mt-5'>
                <span className='cursor-pointer'>Delete Account</span>
                <span className='cursor-pointer'>Sign Out</span>
            </div>
            {updateUserSuccess && 
                <Alert color='success' className='mt-5'>
                    {updateUserSuccess}
                </Alert>
            }

            {updateUserError && 
                <Alert color='failure' className='mt-5'>
                    {updateUserError}
                </Alert>
            }
        </div>
    
    
  );
}
