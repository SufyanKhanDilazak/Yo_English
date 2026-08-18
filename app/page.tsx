import React from 'react'
import Navbar from './components/Navbar'

import WhyUs from './components/WhyUs'
import Courses from './components/Courses'
import ClassDetails from './components/Class'
import ContactForm from './components/Form'
import Footer from './components/Footer'
import ScrollFrameSequence from './components/HeroFrameSequence'


const page = () => {
  return (
    <div>
      
      <Navbar/> 
      <ScrollFrameSequence
        desktopBasePath="/frames-desktop"
        mobileBasePath="/frames-mobile"
        padLength={3}                    // frame_002.webp, not frame_0002.webp
        ariaLabel="Product rotating to show its key features"
      />
      <WhyUs/>
      <Courses/>
      <ClassDetails/>
      <ContactForm/>
      <Footer/>
    
    </div>
  )
}

export default page