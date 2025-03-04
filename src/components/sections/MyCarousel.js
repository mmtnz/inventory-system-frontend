import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import carousel styles
import { Carousel } from "react-responsive-carousel";

// const MyCarousel = () => {
//   return (
//     <Carousel 
//       showThumbs={false} 
//       autoPlay 
//       infiniteLoop 
//       showStatus={false} 
//       interval={5000} // Auto-scroll every 3 seconds
//     >
//       <div>
//             <img src="/images/new-storage-room.PNG" alt="Slide 1" />
//         {/* <p className="legend">Slide 1</p> */}
//       </div>
//       <div>
//             <img src="/images/home.PNG" alt="Slide 1" />
//         {/* <p className="legend">Slide 1</p> */}
//       </div>
//       <div>
//             <img src="/images/invite.PNG" alt="Slide 1" />
//         {/* <p className="legend">Slide 1</p> */}
//       </div>
//       <div>
//             <img src="/images/new-item.PNG" alt="Slide 1" />
//         {/* <p className="legend">Slide 1</p> */}
//       </div>
//       <div>
//             <img src="/images/search.PNG" alt="Slide 1" />
//         {/* <p className="legend">Slide 1</p> */}
//       </div>
//       <div>
//             <img src="/images/item.PNG" alt="Slide 1" />
//         {/* <p className="legend">Slide 1</p> */}
//       </div>
//       <div>
//             <img src="/images/settings.PNG" alt="Slide 1" />
//         {/* <p className="legend">Slide 1</p> */}
//       </div>
//       <div>
//             <img src="/images/profile.PNG" alt="Slide 1" />
//         {/* <p className="legend">Slide 1</p> */}
//       </div>
//     </Carousel>
//   );
// };
// import React from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, Pagination } from "swiper/modules"; // Import modules
// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";

// const MyCarousel = () => {
//   return (
//     <Swiper
//     modules={[Navigation, Pagination]} // Register modules
//       spaceBetween={10} 
//       slidesPerView={1} 
//       navigation // Enables prev/next buttons
//       pagination={{ clickable: true }} // Enables pagination dots
//       style={{ width: "100%", maxWidth: "600px" }}
//     >
//       <SwiperSlide>
//         <img src="/images/new-storage-room.PNG" alt="Slide 1" />
//       </SwiperSlide>
//       <SwiperSlide>
//         <img src="/images/new-storage-room.PNG" alt="Slide 2" />
//       </SwiperSlide>
//     </Swiper>
//   );
// };

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const MyCarousel = ({imagesList}) => {

    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true, // Enables prev/next buttons
    };

    return (
        <Slider {...settings}>
            {imagesList.map((image, index) => (
                <div key={index}>
                    <div className="carousel-title">{image.title}</div>
                    <img src={image.img}/>
                </div>
            ))}
        </Slider>
    );
};





export default MyCarousel;
