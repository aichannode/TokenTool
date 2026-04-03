

import { useCallback, useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone'
import { CSSProperties } from 'react';
import { uploadFilesToGateway } from "@/global/thirdwebStorage";
import { Spinner } from "@material-tailwind/react";

const baseStyle: CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 8,
    borderColor: '#52525b',
    borderStyle: 'dashed',
    backgroundColor: 'rgba(9, 9, 11, 0.5)',
    color: '#a1a1aa',
    outline: 'none',
    transition: 'border .24s ease-in-out'
};

const focusedStyle = {
    borderColor: '#2196f3'
};

const acceptStyle = {
    borderColor: '#00e676'
};

const rejectStyle = {
    borderColor: '#ff1744'
};


export default function StyledDropzone(props: any) {
    const { metadata, setMetadata } = props;
    const [isLoading, setIsLoading] = useState(false);
    const [paths, setPaths] = useState([]);
    const uploadToIpfs = async (file: any) => {
        setIsLoading(true);
        const uploadUrl = await uploadFilesToGateway([file]);
        setMetadata(uploadUrl)
        setIsLoading(false)
    };

    const onDrop = useCallback(async (acceptedFiles: any) => {
        const file = acceptedFiles[0];
        setPaths(acceptedFiles.map((file: any) => URL.createObjectURL(file)));
        await uploadToIpfs(file)
    }, [])
    const { getRootProps,
        getInputProps,
        isFocused,
        isDragAccept,
        isDragReject,
    } = useDropzone({ onDrop });

    const style = useMemo(() => ({
        ...baseStyle,
        ...(isFocused ? focusedStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
    }), [
        isFocused,
        isDragAccept,
        isDragReject
    ]);


    return (
        <section className="container text-zinc-300">
            {
                <>
                    <div {...getRootProps({ style })}>
                        <input {...getInputProps()} />
                        <p>Drag 'n' drop some files here, or click to select files</p>
                        <div className='flex flex-row items-center'>
                            {
                                paths.map((item: any) => {
                                    return (<img src={item} key={item} alt={item} className='w-[100px] h-[100px]' />)
                                })
                            }
                        </div>
                    </div>
                    {isLoading ?
                        <div className='w-full flex flex-col items-center py-2'>
                            <Spinner color="blue" className='absolu'
                                onPointerEnterCapture={() => { }}
                                onPointerLeaveCapture={() => { }} /> :
                        </div> :
                        <aside>
                            <h4 className="text-zinc-200 font-semibold">Image Link</h4>
                            <ul className='w-full md:w-[700px] break-words text-zinc-400 text-sm'>{metadata}</ul>
                        </aside>
                    }
                </>
            }
        </section>
    );
}