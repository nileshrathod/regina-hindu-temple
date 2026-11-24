import React, { useState } from 'react';
import { ImageOff } from 'lucide-react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackTitle?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  className = '',
  fallbackTitle,
  ...rest
}) => {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-[#EFE9DF] dark:bg-[#241E1A] text-[#7D6E5D] dark:text-[#A99C8E] p-6 text-center ${className}`}
        role="img"
        aria-label={alt || fallbackTitle || 'Temple photograph'}
      >
        <ImageOff className="w-7 h-7 mb-2 opacity-60" strokeWidth={1.5} />
        <span className="font-serif text-base font-medium text-[#3B3026] dark:text-[#E4DBD0]">
          {fallbackTitle || alt || 'Regina Hindu Temple'}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
      {...rest}
    />
  );
};
