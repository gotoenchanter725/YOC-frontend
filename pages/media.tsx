import React, { FC } from "react"
import Footer from "../src/components/common/Footer";
import Navbar from "../src/components/common/Navbar";

const Media: FC = () => {
    return <div>
        <Navbar />
        <div className="container">
            <p className="title">
                Welcome to Media Page
            </p>
        </div>
        <Footer />
    </div>
}

export default Media;