import { Alert, Button, TextInput, Modal } from 'flowbite-react';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Link } from 'react-router-dom'
import { getStorage, 
        ref, 
        uploadBytesResumable, 
        getDownloadURL } from "firebase/storage";
import { useDispatch } from 'react-redux';
//circular progress bar
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import { updateStart,
        updateSuccess,
        updateFailure,
        deleteUserFailure,
        deleteUserStart,
        deleteUserSuccess,
        signoutUserSuccess } from '../redux/user/userSlice';


export default function DashProfile() {
    const {currentUser, error} = useSelector((state) => state.user);
    const [imageFile,setImageFile] = useState(null);
    const [imageFileUrl, setImageFileUrl] = useState(null);
    const [imageFileUploadingProgress,setimageFileUploadingProgress] = useState(0);
    const [imageFileUploadError,setImageFileUploadError] = useState(null);    //making reference for choosing image usiing profile pic
    const [imageFileUploading,setimageFileUploading] = useState(false);
    const [formData,setFormData] = useState({});
    const [updateUserSuccess,setUpdateUserSuccess] = useState(null);
    const [updateUserError,setUpdateUserError] = useState(null);
    const [showModel,setshowModel] = useState(false);

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
            const res = await fetch(`/api/user/update/${currentUser._id}`,{
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

    const handleDeleteUser = async () =>{
        setshowModel(false);
        try{
            dispatch(deleteUserStart());
            const res = await fetch(`/api/user/delete/${currentUser._id}`,{
                method: 'POST',
            });
            const data = await res.json();
            if(res != ok){
                dispatch(deleteUserSuccess(data))
            }
        }catch(err){
            dispatch(deleteUserFailure(err.message));
        }
    };

    const handleSignOut = async () => {
        try{
            const res = await fetch("/api/user/signout",{
                method: 'POST',
            });

            if(!res.ok){
                console.log(data.message);
            }
            else{
                dispatch(signoutUserSuccess());
            }

        }catch(err){
            console.log(err.message);
        }
    }


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

                {
                    currentUser.isAdmin && (
                        <Link to={'/create-post'}>
                            <Button
                                type='button'
                                gradientDuoTone='purpleToPink'
                                className='w-full'
                            >
                                Create a Post
                            </Button>
                        </Link>
                        
                    )
                }


            </form>


            <div className='flex justify-between text-red-500 mt-5'>
                <span onClick={()=>setshowModel(true)} className='cursor-pointer'>Delete Account</span>
                <span className='cursor-pointer' onClick={handleSignOut}>Sign Out</span>
            </div>
            {updateUserSuccess && (
                <Alert color='success' className='mt-5'>
                    {updateUserSuccess}
                </Alert>
            )}

            {updateUserError && (
                <Alert color='failure' className='mt-5'>
                    {updateUserError}
                </Alert>
            )}

            {error && (
                <Alert color='failure' className='mt-5'>
                    {error}
                </Alert>
            )}
            <>
            <Modal show={showModel} size="md" onClose={() => setshowModel(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete your account?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={()=>{handleDeleteUser();setshowModel(false)}}>
                {"Yes, I'm sure"}
              </Button>
              <Button color="gray" onClick={() => setshowModel(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      </>


        </div>
    
    
  );
}
