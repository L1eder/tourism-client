import React, { useState } from "react";
import "../styles/ImageGallery.css";

interface ImageGalleryProps {
  images: string[];
  alt?: string;
  width?: number;
  enlargedWidth?: number;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  alt,
  width = 300,
  enlargedWidth = 800,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const openModal = (img: string) => {
    console.log("Opening modal with image:", img);
    setSelectedImage(img);
  };

  const closeModal = () => {
    console.log("Closing modal");
    setSelectedImage(null);
  };

  if (images.length === 0) {
    return <p>Нет изображений для отображения.</p>;
  }

  return (
    <div className="image-gallery d-flex flex-wrap">
      {images.map((img, index) => (
        <img
          key={index}
          src={img}
          alt={alt || `image-${index}`}
          className="gallery-image m-2"
          style={{ width: `${width}px`, objectFit: "cover", cursor: "pointer" }}
          onClick={() => openModal(img)}
        />
      ))}

      {selectedImage && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <button type="button" className="close" onClick={closeModal}>
                &times;
              </button>
              <div className="modal-body">
                <img
                  src={selectedImage}
                  alt="Selected"
                  style={{ width: `${enlargedWidth}px` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
