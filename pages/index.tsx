import React, { FC } from "react";
import Footer from "../src/components/common/Footer";
import Navbar from "../src/components/common/Navbar";

const HomePage: FC = () => {
  return (
    <>
      <Navbar />
      <div className="container">
        <p className="title">
          Welcome to the Our Home Page
        </p>

      </div>
      <Footer />
    </>
  )
}

export default HomePage
