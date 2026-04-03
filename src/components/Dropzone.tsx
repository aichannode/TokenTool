

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
    borderRadius: 12,
    borderColor: 'rgba(45, 212, 191, 0.22)',
    borderStyle: 'dashed',
    backgroundColor: 'rgba(15, 23, 42, 0.35)',
    color: '#94a3b8',
    outline: 'none',
    boxShadow: 'inset 0 0 24px rgba(45, 212, 191, 0.04)',
    transition: 'border 0.2s ease, box-shadow 0.2s ease'
};

const focusedStyle = {
    borderColor: 'rgba(94, 234, 212, 0.55)',
    boxShadow: 'inset 0 0 28px rgba(45, 212, 191, 0.08), 0 0 20px rgba(45, 212, 191, 0.12)'
};

const acceptStyle = {
    borderColor: 'rgba(52, 211, 153, 0.7)',
    boxShadow: '0 0 24px rgba(52, 211, 153, 0.2)'
};

const rejectStyle = {
    borderColor: 'rgba(251, 113, 133, 0.65)',
    boxShadow: '0 0 20px rgba(251, 113, 133, 0.15)'
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
        <section className="container text-slate-400">
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
                            <h4 className="text-slate-300 font-semibold">Image Link</h4>
                            <ul className='w-full md:w-[700px] break-words text-slate-500 text-sm'>{metadata}</ul>
                        </aside>
                    }
                </>
            }
        </section>
    );
}