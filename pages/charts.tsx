import React, { FC } from "react"
import Footer from "../src/components/common/Footer";
import Navbar from "../src/components/common/Navbar";

const Charts: FC = () => {
    return <div>
        <Navbar />
        <div className="container">
            <p className="title">
                Welcome to Charts Page
            </p>
        </div>
        <Footer />
    </div>
}

export default Charts;