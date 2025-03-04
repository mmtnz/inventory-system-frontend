import React, {useEffect, useState} from "react";
import { Link } from "react-scroll";

const Arrow2Top = () => {

    const [isVisible, setIsVisible] = useState(false);

    // Show button when scrolled down 300px
    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);
    return (
        <div className="arrow-to-top">
            {isVisible && (
                <nav className="nav-bar">
                    <Link to="welcome" smooth={true} duration={500} className="nav-bar-item">
                        <span className="material-symbols-outlined" translate="no" aria-hidden="true">
                            arrow_upward
                        </span>
                    </Link>
                </nav>
            )}
        </div>
    )
};
export default Arrow2Top;
