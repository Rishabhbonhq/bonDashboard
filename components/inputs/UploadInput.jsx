import { Button, Input } from '@nextui-org/react'
import React, { useEffect, useRef, useState } from 'react'
import UploadIcon from '../icons/upload-icon'
import axios from 'axios'
import config from '@/config/config'

export default function UploadInput({setFileParent, label, value}) {
  const [file, setFile] = useState({name: value})
  const ref = useRef()

  useEffect(()=>{
    setFile({name: value})
  },[value])

  const onUpload = (e) => {
    ref.current.click()
  }

  return (
    <div className='flex flex-row justify-content-center'>
        <Input
            disabled         
            label={label?label:"Upload Image"}
            value={file?.name}
        />

        <input ref={ref} accept="image/png, image/gif, image/jpeg" type='file' hidden onChange={(e)=>{
          setFile(e.target.files[0])
          setFileParent(e.target.files[0])
          }}/>
        <Button color="primary" className='h-[56px] w-[36px] min-w-[56px] p-[14px] ml-2' onClick={onUpload}>
            <UploadIcon/>
        </Button>
    </div>
  )
}
