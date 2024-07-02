import React from 'react';
import { CardMedia, CardMediaProps } from '@mui/material';
import { styled } from '@mui/system';

const ImageContainer = styled('div')({
    position: 'relative',
    width: '100%', // You can adjust the width as needed
    height: '0',
    // paddingBottom: '56.25%', // 16:9 aspect ratio, adjust as needed
    paddingBottom: '50%',
});

const StyledBackgroundImage = styled(CardMedia)({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
});

const StyledOverlayImage = styled(CardMedia)({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
});

interface LayeredCardMediaProps extends CardMediaProps {
    overlayImage: string;
    backgroundImage: string;
}

const LayeredCardMedia: React.FC<LayeredCardMediaProps> = ({ overlayImage, backgroundImage, ...props }) => {
    return (
        <ImageContainer>
            <StyledBackgroundImage
                image={backgroundImage}
                {...props}
            />
            <StyledOverlayImage
                image={overlayImage}
                {...props}
            />
        </ImageContainer>
    );
};

export default LayeredCardMedia;
