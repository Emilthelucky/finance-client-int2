import React from 'react'
import { Link } from '@chakra-ui/react'

export const Add = ({ img, href, title, paragraph, button }) => {
    return (
        <div className="add-container">
            <div className="add">
                <div className="rectangle">
                    <div className="add-circle">
                        <img src={img} className="flower"></img>
                    </div>
                </div>
                <p className="add-title">{title}</p>
                <p className="add-p">{paragraph}</p>
                <Link href={href} className="add-btn">
                    <p className="add-btn-p">{button}</p>
                </Link>
            </div>
        </div>
    )
}
