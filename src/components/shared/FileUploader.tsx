import { useCallback, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";

import { Button } from "../../components/ui/button";
import { convertFileToUrl } from "../../lib/utils";

type FileUploaderProps = {
  fieldChange: (files: File[]) => void;
  mediaUrl: string;
};

const FileUploader = ({ fieldChange, mediaUrl }: FileUploaderProps) => {
  const [fichier, setFichier] = useState<File[]>([]);
  const [fichierUrl, setFichierUrl] = useState<string>(mediaUrl);

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      setFichier(acceptedFiles);
      fieldChange(acceptedFiles);
      setFichierUrl(convertFileToUrl(acceptedFiles[0]));
    },
    [fichier]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpeg", ".jpg"],
    },
  });

  return (
    <div
      {...getRootProps()}
      className="flex flex-center flex-col bg-white rounded-xl cursor-pointer w-60 h-60 mx-auto">
      <input {...getInputProps()} className="cursor-pointer" />

      {fichierUrl ? (
        <>
          <div className="flex flex-1 justify-center w-full p-5 lg:p-10">
            <img src={fichierUrl} alt="image" className="file_uploader-img" />
          </div>
          <p className="file_uploader-label">Clickez ou glissez une photo pour remplacer</p>
        </>
      ) : (
        <div className="file_uploader-box ">
          <img
            src="/assets/icons/file-upload.svg"
            width={96}
            height={77}
            alt="file upload"
          />

          <h3 className="base-medium text-light-2 mb-2 mt-6">
            Mettez la photo ici
          </h3>
          <p className="text-light-4 small-regular mb-6">SVG, PNG, JPG</p>

          <Button type="button" className="shad-button_dark_4">
            Select from computer
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileUploader;