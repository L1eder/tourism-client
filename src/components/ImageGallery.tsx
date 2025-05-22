import React from "react";
import "../styles/ImageGallery.css";

interface ImageGalleryProps {
  images: string[];
  alt?: string;
  width?: number;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  alt,
  width = 200,
}) => {
  return (
    <div className="image-gallery d-flex flex-wrap">
      {images.map((img, index) => (
        <img
          key={index}
          src={img}
          alt={alt || `image-${index}`}
          className="gallery-image m-2"
          style={{ width: width, objectFit: "cover" }}
        />
      ))}
    </div>
  );
};

export default ImageGallery;
