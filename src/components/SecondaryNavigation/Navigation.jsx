import React from 'react'
import { Link } from '@chakra-ui/react'
import { useRouter } from 'next/router'

export const Navigation = ({
    mainTitle,
    title,
    save,
    icoF,
    icoS,
    href,
    click,
    back,
}) => {
    const router = useRouter()

    return (
        <div className="my-products-navigation">
            <div
                className="my-products-first flex gap-20 aic jcc cursor-pointer"
                onClick={() => {
                    back && router.push(`${back}`)
                }}
            >
                {icoF ? (
                    <div className="back-icon flex aic jcc">
                        <img src={icoF}></img>
                    </div>
                ) : null}
                {mainTitle && <p>{mainTitle}</p>}
                {icoS && <img src={icoS}></img>}
                {title && <p>{title}</p>}
            </div>
            <div className="my-products-second">
                {href ? (
                    <button
                        className="my-products-add"
                        onClick={() => router.push(`${href}`)}
                    >
                        {save}
                    </button>
                ) : null}
                {click ? (
                    <button className="my-products-add" onClick={click}>
                        {save}
                    </button>
                ) : null}
            </div>
        </div>
    )
}
