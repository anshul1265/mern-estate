import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase";

export default function Profile() {

  const { currentUser } = useSelector(state => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePercentage, setFilePercentage] = useState(-1);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePercentage(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setFormData({ ...formData, avatar: downloadUrl });
        })
      }
    )
  };

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className="flex flex-col gap-4">
        {/* creating a way to store image and using it as the profile image  */}
        <input onChange={(e) => setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept="image" />
        <img onClick={() => fileRef.current.click()} src={formData.avatar || currentUser.avatar} alt="Profile" className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"></img>
        <p className="text-sm self-center">
          {
            fileUploadError
              ?
              <span className="text-red-700">Error while uploading the image.(size must be less than 2Mb)</span>
              :
              (
                (filePercentage >= 0 && filePercentage < 100)
                  ?
                  <span className="text-slate-700">{`Uploading ${filePercentage}%`}</span>
                  :
                  (filePercentage === 100)
                    ?
                    <span className="text-green-700">Upload Successful.</span>
                    :
                    ""
              )
          }
        </p>
        <input type="text" placeholder={"username"} id={"username"} className="border p-3 rounded-lg" />
        <input type="email" placeholder={"email"} id={"email"} className="border p-3 rounded-lg" />
        <input type="text" placeholder={"password"} id={"password"} className="border p-3 rounded-lg" />
        <button className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">update</button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer">Delete account</span>
        <span className="text-red-700 cursor-pointer">Sign out</span>
      </div>
    </div >
  )
}
