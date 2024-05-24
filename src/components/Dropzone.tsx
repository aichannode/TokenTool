

import { useCallback, useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone'
import { CSSProperties } from 'react';
import { useStorageUpload } from "@thirdweb-dev/react";
import { Spinner } from "@material-tailwind/react";

const baseStyle: CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
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
    const { mutateAsync: upload } = useStorageUpload();
    const [isLoading, setIsLoading] = useState(false);

    const uploadToIpfs = async (file: any) => {
        setIsLoading(true);
        const uploadUrl = await upload({
            data: [file],
            options: { uploadWithGatewayUrl: true, uploadWithoutDirectory: true },
        });
        setMetadata(uploadUrl)
        setIsLoading(false)
    };

    const onDrop = useCallback(async (acceptedFiles: any) => {
        const file = acceptedFiles[0];
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
        <section className="container">
            {
                <>
                    <div {...getRootProps({ style })}>
                        <input {...getInputProps()} />
                        <p>Drag 'n' drop some files here, or click to select files</p>
                    </div>
                    {isLoading ?
                        <div className='w-full flex flex-col items-center py-2'>
                            <Spinner color="blue" className='absolu'
                                onPointerEnterCapture={() => { }}
                                onPointerLeaveCapture={() => { }} /> :
                        </div> :
                        <aside>
                            <h4>Image Link</h4>
                            <ul className='w-full md:w-[700px] break-words'>{metadata}</ul>
                        </aside>
                    }
                </>
            }
        </section>
    );
}