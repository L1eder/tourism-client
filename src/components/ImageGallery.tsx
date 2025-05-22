import React from "react";

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
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      {images.map((img, index) => (
        <img
          key={index}
          src={img}
          alt={alt || `image-${index}`}
          style={{ width: width, margin: "10px", objectFit: "cover" }}
        />
      ))}
    </div>
  );
};

export default ImageGallery;
