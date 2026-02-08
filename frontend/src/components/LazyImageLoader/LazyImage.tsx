import React from "react";

interface LazyImageProps
    extends React.ImgHTMLAttributes<HTMLImageElement> { }

const LazyImage: React.FC<LazyImageProps> = ({ src, alt, ...rest }) => {
    return (
        <img
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            {...rest}
        />
    );
};

export default LazyImage;
