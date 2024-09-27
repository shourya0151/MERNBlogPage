import { Alert, Button, TextInput } from 'flowbite-react';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

//circular progress bar
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';


export default function DashProfile() {
    const {currentUser} = useSelector((state) => state.user);
    const [imageFile,setImageFile] = useState(null);
    const [imageFileUrl, setImageFileUrl] = useState(null);
    const [imageFileUploadingProgress,setimageFileUploadingProgress] = useState(0);
    const [imageFileUploadError,setImageFileUploadError] = useState(null);    //making reference for choosing image usiing profile pic
    const filePickerRef = useRef();


    

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
            },
            ()=>{
                // Upload completed successfully, now we can get the download URL
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImageFileUrl(downloadURL);
                });
            }

         )
    
    };


  return (
    
        <div className='mx-auto p-3 max-w-lg w-full'>
            <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
            <form className='flex flex-col gap-4'>
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
                    defaultValue={currentUser.username}
                />
                <TextInput
                    type='email'
                    id='email'
                    placeholder='email'
                    defaultValue={currentUser.email}
                />
                <TextInput
                    type='password'
                    id='password'
                    placeholder='Password'
                />
                <Button type='submit' gradientDuoTone='purpleToBlue' outline>
                    Update
                </Button>
            </form>
            <div className='flex justify-between text-red-500 mt-5'>
                <span className='cursor-pointer'>Delete Account</span>
                <span className='cursor-pointer'>Sign Out</span>
            </div>
        </div>
    
    
  )
}
